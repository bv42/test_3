// test/bridge.test.js
const request = require('supertest');
// FIX: Mock the correct file
jest.mock('../src/automation_driver', () => ({
    initialize: jest.fn(),
    executeQuery: jest.fn((prompt, onChunk, onDone) => {
        onChunk("Automation Sequence Initiated...");
        onChunk("Sequence Complete.");
        onDone();
    })
}));

const server = require('../src/bridge_server');

describe('DevTools Bridge API', () => {
    it('GET /api/tags returns discovery info', async () => {
        const res = await request(server).get('/api/tags');
        expect(res.statusCode).toEqual(200);
        expect(res.body.models[0].name).toBe('gitlab-integrated');
    });

    it('POST /api/chat handles automation stream', async () => {
        const res = await request(server)
            .post('/api/chat')
            .send({
                model: 'gitlab-integrated',
                messages: [{ role: 'user', content: 'Run Diagnostics' }]
            });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('"content":"Automation Sequence Initiated..."');
    });

    afterAll((done) => {
        server.close(done);
    });
});