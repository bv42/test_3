// src/automation_driver.js
const puppeteer = require('puppeteer-core');

const CONFIG = {
    connectionURL: 'http://127.0.0.1:9222',
    targetBaseUrl: 'https://gitlab.com'
};

class AutomationService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        try {
            this.browser = await puppeteer.connect({
                browserURL: CONFIG.connectionURL,
                defaultViewport: null
            });

            const pages = await this.browser.pages();
            this.page = pages.find(p => p.url().includes('gitlab'));

            if (!this.page) {
                console.log("[Driver] No GitLab tab found. Opening new one...");
                this.page = await this.browser.newPage();
                await this.page.goto(CONFIG.targetBaseUrl, { waitUntil: 'domcontentloaded' });
            } else {
                console.log(`[Driver] Attaching to existing tab: ${this.page.url()}`);
            }

            // Mirror browser logs
            this.page.on('console', msg => {
                const text = msg.text();
                if (text.startsWith('[Bridge]') || text.startsWith('[WS]')) {
                    console.log(`[Chrome] ${text}`);
                }
            });

        } catch (e) {
            console.warn(`[Warn] CDP Connection Failed: ${e.message}`);
        }
    }

    async executeQuery(contextPayload, onData, onComplete) {
        if (!this.page) await this.initialize();
        const requestId = 'req_' + Date.now();

        await this.page.exposeFunction(requestId, (data) => {
            if (data === "EOF") {
                onComplete();
            } else {
                onData(data);
            }
        });

        console.log("[Driver] Injecting 'Old Logic' protocol...");

        await this.page.evaluate(async (payload, callbackId) => {
            const log = (msg) => console.log(`[Bridge] ${msg}`);
            const wsLog = (msg) => console.log(`[WS] ${msg}`);

            log("--- SEQUENCE START (LEGACY PROTOCOL) ---");

            // 1. HELPER: GraphQL Fetcher (Exact same headers as old code)
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            if (!csrfMeta) {
                window[callbackId]("Error: CSRF Missing");
                window[callbackId]("EOF");
                return;
            }
            const csrf = csrfMeta.content;

            const gitlabQuery = async (query, variables = {}) => {
                const res = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrf,
                        'X-GitLab-Feature-Category': 'source_code_management' // Header from old code
                    },
                    body: JSON.stringify({ query, variables })
                });
                const json = await res.json();
                return json.data;
            };

            // 2. STEP 1: Get User ID (The robust way from old code)
            let userId = null;
            try {
                log("Fetching Current User ID...");
                const uData = await gitlabQuery(`query { currentUser { id } }`);
                userId = uData.currentUser.id;
                log(`User ID Retrieved: ${userId}`);
            } catch (e) {
                log(`Failed to fetch User ID: ${e.message}`);
                window[callbackId]("EOF");
                return;
            }

            // 3. STEP 2: Configure Subscription (Exact copy from old proxy.js)
            const clientSubscriptionId = crypto.randomUUID();

            // This is the EXACT subscription query from the working code
            const subscriptionQuery = `subscription aiCompletionResponse($userId: UserID, $clientSubscriptionId: String, $aiAction: AiAction) {
                aiCompletionResponse(userId: $userId, clientSubscriptionId: $clientSubscriptionId, aiAction: $aiAction) { content, errors }
            }`;

            const subIdentifier = JSON.stringify({
                channel: 'GraphqlChannel', // OLD CODE USED THIS, NOT AiActionChannel
                query: subscriptionQuery,
                variables: {
                    userId: userId,
                    clientSubscriptionId: clientSubscriptionId,
                    aiAction: "CHAT"
                }
            });

            // 4. STEP 3: WebSocket Connection
            const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${wsProtocol}//${location.host}/-/cable`;

            wsLog(`Connecting to ${wsUrl}`);
            const ws = new WebSocket(wsUrl);

            let isMutationSent = false;

            const closeSession = (reason) => {
                log(`Closing: ${reason}`);
                if (ws.readyState === WebSocket.OPEN) ws.close();
                window[callbackId]("EOF");
            };

            ws.onopen = () => {
                wsLog("OPEN. Sending Subscribe (GraphqlChannel)...");
                ws.send(JSON.stringify({
                    command: "subscribe",
                    identifier: subIdentifier
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                if (msg.type === 'ping') return;
                wsLog(`RX [${msg.type || 'DATA'}]`);

                if (msg.type === 'welcome') return;

                // --- CONFIRMATION HANDLER ---
                if (msg.type === 'confirm_subscription') {
                    if (!isMutationSent) {
                        log("Subscription Confirmed. Sending Mutation (DUO_CHAT)...");
                        isMutationSent = true;

                        // Exact Mutation from Old Code (includes conversationType)
                        const mutation = `mutation chat($content: String!, $clientSubscriptionId: String!) {
                            aiAction(input: { 
                                chat: { content: $content }, 
                                conversationType: DUO_CHAT, 
                                clientSubscriptionId: $clientSubscriptionId 
                            }) { 
                                requestId, errors 
                            }
                        }`;

                        gitlabQuery(mutation, {
                            content: payload, // mapped from 'question' in variable
                            clientSubscriptionId: clientSubscriptionId
                        }).then(data => {
                            if (data.aiAction?.errors?.length > 0) {
                                log(`Mutation Error: ${JSON.stringify(data.aiAction.errors)}`);
                            } else {
                                log("Mutation Sent Successfully.");
                            }
                        });
                    }
                    return;
                }

                // --- PAYLOAD HANDLER ---
                if (msg.message) {
                    // Logic from old code: msg.message.result.data...
                    const payload = msg.message.result?.data?.aiCompletionResponse ||
                        msg.message.data?.aiCompletionResponse;

                    if (payload) {
                        const content = payload.content;
                        if (content) {
                            window[callbackId](content);
                        }

                        // Error Handling from old code
                        if (payload.errors && payload.errors.length > 0) {
                            log(`GraphQL Payload Error: ${JSON.stringify(payload.errors)}`);
                            closeSession("API Error");
                        }
                    }

                    if (msg.message.more === false) {
                        log("Stream Complete (more=false).");
                        closeSession("Done");
                    }
                }
            };

            ws.onerror = (e) => closeSession("Socket Error");
            // Watchdog: 45s timeout
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) closeSession("Timeout");
            }, 45000);

        }, contextPayload, requestId);
    }
}

module.exports = new AutomationService();