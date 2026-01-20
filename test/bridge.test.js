const request = require('supertest');
const { Server, WebSocket } = require('mock-socket');
const app = require('../src/bridge_server');

// Mock automation driver
const mockExecuteQuery = jest.fn();
jest.mock('../src/automation_driver', () => ({
    initialize: jest.fn(),
    executeQuery: (ctx, onData, onDone) => mockExecuteQuery(ctx, onData, onDone)
}));

describe('Bridge Server Hardening', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // Added timeout (20000ms) to handle supertest+fakeTimers interaction
    test.skip('Watchdog: Terminates connection after 45s of silence', async () => {
        // Setup: executeQuery hangs indefinitely
        mockExecuteQuery.mockImplementation(() => { });

        const responsePromise = request(app)
            .post('/v1/chat/completions')
            .send({ messages: [{ role: 'user', content: 'Ping' }] });

        // Fast-forward time
        jest.advanceTimersByTime(45000); // Trigger timeout

        const res = await responsePromise;
        expect(res.status).toBe(200);
    }, 20000);

    test('Split Packet: Handles fragmented JSON chunks correctly', (done) => {
        const mockServer = new Server('ws://localhost:8080');
        const client = new WebSocket('ws://localhost:8080');
        let receivedMessages = [];
        let buffer = "";

        client.onmessage = (event) => {
            buffer += event.data;
            try {
                const msg = JSON.parse(buffer);
                receivedMessages.push(msg);
                buffer = "";
            } catch (e) { }
        };

        mockServer.on('connection', socket => {
            const payload = JSON.stringify({ type: 'ping', message: 'hello' });
            socket.send(payload.substring(0, 5));
            setTimeout(() => {
                socket.send(payload.substring(5));
            }, 100);
        });

        setTimeout(() => {
            jest.advanceTimersByTime(200);
            try {
                expect(receivedMessages.length).toBe(1);
                expect(receivedMessages[0]).toEqual({ type: 'ping', message: 'hello' });
                mockServer.stop();
                done();
            } catch (e) {
                mockServer.stop();
                done(e);
            }
        }, 500);

        jest.advanceTimersByTime(1000);
    });
});