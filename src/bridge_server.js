// src/bridge_server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const automationService = require('./automation_driver');

const app = express();
app.use(express.json({ limit: '30mb' }))

// --- CONFIG ---
const CONVERSATION_DIR = path.join(__dirname, '..', 'conversations');
if (!fs.existsSync(CONVERSATION_DIR)) {
    fs.mkdirSync(CONVERSATION_DIR, { recursive: true });
}

// --- ARCHIVIST: Saved Conversations ---
function saveConversation(messages, fullResponse, model) {
    if (!messages || messages.length === 0) return;
    try {
        const firstMsg = messages[0].content || "empty";
        const threadId = crypto.createHash('sha256').update(firstMsg).digest('hex').substring(0, 8);
        const safeTitle = firstMsg.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = path.join(CONVERSATION_DIR, `${dateStr}_${safeTitle}_${threadId}.md`);

        let content = "";
        let pendingUserMsg = "";


        let lastUserMsg = null;

        if (!fs.existsSync(filename)) {
            content += `---\nid: ${threadId}\nmodel: ${model}\ncreated: ${new Date().toISOString()}\n---\n\n`;
            messages.forEach(m => content += `## ${m.role.toUpperCase()}\n\n${m.content}\n\n---\n\n`);
        } else {
            // Append only the new turn (Last User Message + Assistant Response)
            lastUserMsg = messages[messages.length - 1];
            if (lastUserMsg.role === 'user') {
                pendingUserMsg = `## USER\n\n${lastUserMsg.content}\n\n---\n\n`;
            }
        }

        // DEDUPLICATION: Check if the last text in file matches pending User Msg
        if (fs.existsSync(filename) && pendingUserMsg) {
            const existing = fs.readFileSync(filename, 'utf-8'); // Trade-off: Read whole file for safety
            if (!existing.trim().endsWith(lastUserMsg.content.trim() + "\n\n---")) {
                content += pendingUserMsg;
            } else {
                console.log("[Archivist] Skipping duplicate user message.");
            }
        } else if (pendingUserMsg) {
            content += pendingUserMsg;
        }

        content += `## ASSISTANT\n\n${fullResponse}\n\n---\n\n`;

        fs.appendFile(filename, content, (err) => {
            if (err) console.error(`[Archivist] Save failed: ${err.message}`);
            else console.log(`[Archivist] Saved turn to ${path.basename(filename)}`);
        });
    } catch (e) {
        console.error(`[Archivist] Error: ${e.message}`);
    }
}

// --- LOGGING ---
app.use((req, res, next) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);

    // REDACT sensitive headers
    const safeHeaders = { ...req.headers };
    ['authorization', 'cookie', 'x-gitlab-token'].forEach(h => {
        if (safeHeaders[h]) safeHeaders[h] = '[REDACTED]';
    });

    console.log(`[${timestamp}] [Gateway] INCOMING -> ${req.method} ${req.url}`);
    console.log(`[${timestamp}] [Gateway] Headers: ${JSON.stringify(safeHeaders)}`);
    next();
});

// Initialize Connection
automationService.initialize();

// --- CHAT HANDLER ---
const chatHandler = async (req, res) => {
    const messages = req.body.messages || [];
    const model = req.body.model || "gitlab-integrated";

    // 1. Context Aggregation (Flattening)
    let aggregatedContext = "";
    messages.forEach(msg => {
        aggregatedContext += `[${msg.role.toUpperCase()}]: ${msg.content}\n`;
    });
    aggregatedContext += "\n[RESPONSE]:";

    // 2. Setup Stream Headers
    res.setHeader('Content-Type', 'text/event-stream'); // Better for some IDEs than x-ndjson
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let isComplete = false;
    let fullResponseAccumulator = ""; // For the Archivist

    let idleTimeout = setTimeout(() => {
        if (!isComplete) {
            console.log("[Bridge] Timeout waiting for browser data.");
            res.end();
            isComplete = true;
        }
    }, 45000);

    const resetIdleTimeout = () => {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            if (!isComplete) {
                console.log("[Bridge] Timeout waiting for browser data.");
                res.end();
                isComplete = true;
            }
        }, 45000);
    };

    try {
        await automationService.executeQuery(
            aggregatedContext,
            (chunk) => {
                resetIdleTimeout(); // Reset timeout on activity

                // Handle Data Chunk
                if (fullResponseAccumulator.length < 1024 * 1024) { // 1MB Limit
                    fullResponseAccumulator += chunk;
                } else if (fullResponseAccumulator.length === 1024 * 1024) {
                    fullResponseAccumulator += "\n[...Truncated for RAM Safety...]";
                }

                // Format: OpenAI Stream
                const payload = JSON.stringify({
                    id: "chatcmpl-" + Date.now(),
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: model,
                    choices: [{ index: 0, delta: { content: chunk }, finish_reason: null }]
                });
                res.write(`data: ${payload}\n\n`);
            },
            () => {
                // Handle Completion
                if (!isComplete) {
                    const donePayload = JSON.stringify({
                        id: "chatcmpl-" + Date.now(),
                        object: "chat.completion.chunk",
                        created: Math.floor(Date.now() / 1000),
                        model: model,
                        choices: [{ index: 0, delta: {}, finish_reason: "stop" }]
                    });
                    res.write(`data: ${donePayload}\n\n`);
                    res.write(`data: [DONE]\n\n`);
                    res.end();

                    isComplete = true;
                    clearTimeout(idleTimeout);

                    // Trigger Archivist
                    saveConversation(messages, fullResponseAccumulator, model);
                }
            }
        );
    } catch (e) {
        console.error("Bridge Error:", e.message);
        if (!res.headersSent) res.status(500).json({ error: e.message });
    }
};

app.post('/api/chat', chatHandler);
app.post('/v1/chat/completions', chatHandler);
app.get('/api/tags', (req, res) => res.json({ models: [{ name: "gitlab-integrated" }] }));

if (require.main === module) {
    const PORT = 11435;
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`[Info] Bridge active on 127.0.0.1:${PORT}`);
    });
}

module.exports = app;