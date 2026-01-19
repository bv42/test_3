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

            // ANTI-DETECT: Hide Webdriver
            const applyStealth = async (p) => {
                await p.evaluateOnNewDocument(() => {
                    Object.defineProperty(navigator, 'webdriver', { get: () => false });
                });
                await p.evaluate(() => {
                    Object.defineProperty(navigator, 'webdriver', { get: () => false });
                });
            };

            if (!this.page) {
                this.page = await this.browser.newPage();
                try { await applyStealth(this.page); } catch (e) { console.log(`[Warn] Stealth NewPage failed: ${e.message}`); }
                await this.page.goto(CONFIG.targetBaseUrl, { waitUntil: 'domcontentloaded' });
            } else {
                try { await applyStealth(this.page); } catch (e) { console.log(`[Warn] Stealth ExistingPage failed: ${e.message}`); }
            }

            // Console Mirroring
            this.page.on('console', msg => {
                const text = msg.text();
                if (text.startsWith('[Bridge]') || text.startsWith('[WS]')) {
                    console.log(`[Chrome] ${text}`);
                }
            });
        } catch (e) { console.warn(`[Warn] Connection Failed: ${e.message}`); }
    }

    async executeQuery(contextPayload, onData, onComplete) {
        if (!this.page) await this.initialize();
        const requestId = 'req_' + Date.now();

        await this.page.exposeFunction(requestId, (data) => {
            if (data === "EOF") onComplete();
            else onData(data);
        });

        await this.page.evaluate(async (payload, callbackId) => {
            const log = (msg) => console.log(`[Bridge] ${msg}`);
            const wsLog = (msg) => console.log(`[WS] ${msg}`);

            // 1. HELPER: Fetch CSRF & UserID
            const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.content;
            const csrf = getCsrf();
            if (!csrf) { window[callbackId]("EOF"); return; }

            // Fetch User ID (Legacy Logic)
            let userId = "gid://gitlab/User/1";
            try {
                const res = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                    body: JSON.stringify({ query: `query { currentUser { id } }` })
                });
                const json = await res.json();
                if (json.data?.currentUser?.id) userId = json.data.currentUser.id;
            } catch (e) { log("User ID Fetch Failed"); }

            // 2. WebSocket Setup
            const clientSubscriptionId = crypto.randomUUID();
            const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${wsProtocol}//${location.host}/-/cable`;
            const ws = new WebSocket(wsUrl);

            // 3. Subscription Identifier
            const subIdentifier = JSON.stringify({
                channel: 'GraphqlChannel',
                query: `subscription aiCompletionResponse($userId: UserID, $clientSubscriptionId: String, $aiAction: AiAction) {
                    aiCompletionResponse(userId: $userId, clientSubscriptionId: $clientSubscriptionId, aiAction: $aiAction) { content, errors }
                }`,
                variables: { userId, clientSubscriptionId, aiAction: "CHAT" }
            });

            ws.onopen = () => {
                wsLog("Sending Subscribe...");
                ws.send(JSON.stringify({ command: "subscribe", identifier: subIdentifier }));
            };

            let isMutationSent = false;
            let accumulated = "";

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'ping') return;

                // A. CONFIRMATION
                if (msg.type === 'confirm_subscription') {
                    if (!isMutationSent) {
                        isMutationSent = true;
                        fetch('/api/graphql', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                            body: JSON.stringify({
                                query: `mutation chat($content: String!, $clientSubscriptionId: String!) {
                                    aiAction(input: { chat: { content: $content }, conversationType: DUO_CHAT, clientSubscriptionId: $clientSubscriptionId }) { errors }
                                }`,
                                variables: { content: payload, clientSubscriptionId }
                            })
                        });
                    }
                    return;
                }

                // B. DATA EXTRACTION (Debugged)
                if (msg.message) {
                    // Try all known paths
                    const responseData = msg.message.result?.data?.aiCompletionResponse ||
                        msg.message.data?.aiCompletionResponse ||
                        msg.message.aiCompletionResponse; // Some versions flat-pack it

                    if (responseData) {
                        const content = responseData.content;
                        if (content) {
                            wsLog(`RX Len:${content.length}`);
                            resetSilence();
                            // BUFFER STRATEGY:
                            // Due to out-of-order delivery of deltas vs full text, we cannot stream reliably.
                            // We wait for the "Full Text" which is usually the longest.
                            if (content.length > accumulated.length) {
                                accumulated = content;
                            }
                        }
                    } else {
                        // DEBUG: If we have message but no payload, log keys to debug
                        wsLog(`Payload Keys: ${Object.keys(msg.message).join(', ')}`);
                    }

                    if (msg.message.more === false) {
                        finalize();
                    }
                }
            };

            const finalize = () => {
                if (ws.readyState !== WebSocket.OPEN) return;
                wsLog(`[EOF] Finalizing (${accumulated.length} chars)`);
                window[callbackId](accumulated);
                window[callbackId]("EOF");
                ws.close();
            };

            let silenceTimer;
            const resetSilence = () => {
                clearTimeout(silenceTimer);
                silenceTimer = setTimeout(() => {
                    if (accumulated.length > 0) {
                        wsLog(`[Timeout] Silence detected, forcing EOF.`);
                        finalize();
                    }
                }, 2000);
            };

            // Watchdog (30s)
            setTimeout(() => { if (ws.readyState === WebSocket.OPEN) ws.close(); }, 30000);

        }, contextPayload, requestId);
    }
}

module.exports = new AutomationService();