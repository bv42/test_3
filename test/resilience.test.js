const request = require('supertest');

// Note: We'll require app inside verify for fresh timer mocks
let app;
let mockExecuteQuery;

describe('Resilience: Stream Rescue', () => {
    beforeEach(() => {
        jest.resetModules(); // CRITICAL: Reset cache so 'app' gets fresh globals
        jest.useFakeTimers();

        // Re-mock after resetModules (though jest.mock is usually persistent, 
        // local variables need refreshing if module is re-evaluated)
        jest.doMock('../src/automation_driver', () => ({
            initialize: jest.fn(),
            executeQuery: (ctx, onData, onDone) => mockExecuteQuery(ctx, onData, onDone)
        }));

        mockExecuteQuery = jest.fn();
        app = require('../src/bridge_server');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Scenario: The Silent Server - Rescues stalled stream with partial success', async () => {
        let resolveExecutionStarted;
        const executionStarted = new Promise(resolve => resolveExecutionStarted = resolve);

        // Setup: executeQuery emits 3 chunks then hangs
        mockExecuteQuery.mockImplementation((ctx, onData, onDone) => {
            resolveExecutionStarted();
            onData("Hello");
            onData(" ");
            onData("World");
            // Deliberately NOT calling onDone() to simulate stall
        });

        // Create the request chain
        const testReq = request(app)
            .post('/v1/chat/completions')
            .send({ messages: [{ role: 'user', content: 'Say Hello World' }] });

        // Manually initiate the request and capture response via a promise
        // This prevents the deadlock where we wait for executionStarted before the request is even sent.
        const responsePromise = new Promise((resolve, reject) => {
            testReq.end((err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

        // Wait for handler to hit the service
        await executionStarted;

        // Trigger timeout
        jest.runAllTimers();

        const res = await responsePromise;

        // 1. Assert Status 200
        expect(res.status).toBe(200);

        // 2. Assert Body contains the chunks
        const text = res.text;
        expect(text).toContain('Hello');
        expect(text).toContain('World');

        // Extract all IDs
        const ids = [...text.matchAll(/"id":"([^"]+)"/g)].map(m => m[1]);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(1); // CRITICAL: IDs must be consistent for client aggregation

        // 3. Assert Protocol Compliance (The Rescue)
        expect(text).toMatch(/"finish_reason":"length"/);

        // 4. Assert [DONE] signal
        expect(text).toContain('data: [DONE]');
    }, 10000); // Increase test timeout to 10s
});
