// src/bridge_server.js
const express = require('express');
const automationService = require('./automation_driver');
const app = express();

app.use(express.json());

// --- LOGGING MIDDLEWARE (New) ---
app.use((req, res, next) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm
    const snippet = req.body.messages
        ? `Messages: ${req.body.messages.length}`
        : `Body: ${JSON.stringify(req.body).substring(0, 50)}...`;

    console.log(`[${timestamp}] [Gateway] INCOMING -> ${req.method} ${req.url} | ${snippet}`);

    // Capture response finish to log duration/status
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] [Gateway] OUTGOING <- ${res.statusCode} (${duration}ms)`);
    });

    next();
});

// Initialize CDP connection
automationService.initialize();

// --- CORE HANDLER ---
const chatHandler = async (req, res) => {
    const messages = req.body.messages || [];
    const model = req.body.model || "gitlab-integrated";

    console.log(`[Bridge] Processing ${messages.length} messages for model '${model}'...`);

    let aggregatedContext = "";

    // Context Aggregation
    messages.forEach(msg => {
        if (msg.role === 'system') {
            aggregatedContext += `[SYSTEM]: ${msg.content}\n`;
        } else if (msg.role === 'user') {
            aggregatedContext += `[USER]: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
            aggregatedContext += `[ASSISTANT]: ${msg.content}\n`;
        }
    });

    aggregatedContext += "\n[RESPONSE]:";

    // Setup Stream
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');

    let isComplete = false;
    const idleTimeout = setTimeout(() => {
        if (!isComplete) {
            console.log("[Bridge] Timeout: No response from browser within 45s.");
            res.end();
            isComplete = true;
        }
    }, 45000);

    try {
        await automationService.executeQuery(
            aggregatedContext,
            (chunk) => {
                // OpenAI/Ollama compatible stream format
                const payload = JSON.stringify({
                    id: "chatcmpl-" + Date.now(),
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: model,
                    choices: [{
                        index: 0,
                        delta: { content: chunk },
                        finish_reason: null
                    }]
                });
                res.write(payload + '\n');
            },
            () => {
                if (!isComplete) {
                    const donePayload = JSON.stringify({
                        id: "chatcmpl-" + Date.now(),
                        object: "chat.completion.chunk",
                        created: Math.floor(Date.now() / 1000),
                        model: model,
                        choices: [{
                            index: 0,
                            delta: {},
                            finish_reason: "stop"
                        }]
                    });
                    res.write(donePayload + '\n');
                    res.end();
                    isComplete = true;
                    clearTimeout(idleTimeout);
                    console.log("[Bridge] Stream complete.");
                }
            }
        );
    } catch (e) {
        console.error("Bridge Error:", e.message);
        // Ensure we don't crash the stream if headers are already sent
        if (!res.headersSent) res.status(500).json({ error: e.message });
        else res.end();
    }
};

// --- ROUTES ---

// 1. Ollama Standard
app.post('/api/chat', chatHandler);

// 2. OpenAI Standard (Fixes your 404 error)
app.post('/v1/chat/completions', chatHandler);

// 3. Service Discovery
app.get('/api/tags', (req, res) => {
    res.json({ models: [{ name: "gitlab-integrated" }] });
});
app.get('/v1/models', (req, res) => {
    res.json({ object: "list", data: [{ id: "gitlab-integrated", object: "model" }] });
});

const PORT = 11434;
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Info] DevTools Bridge active on 127.0.0.1:${PORT}`);
    console.log(`[Info] Supported Routes: /api/chat, /v1/chat/completions`);
});

module.exports = server;