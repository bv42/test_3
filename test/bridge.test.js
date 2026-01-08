// test/bridge.test.js
const request = require('supertest');
const fs = require('fs');
const path = require('path');

// 1. Mock the Automation Driver
jest.mock('../src/automation_driver', () => ({
    initialize: jest.fn(),
    executeQuery: jest.fn((prompt, onData, onComplete) => {
        // Simulate a streaming response
        onData("Hello");
        onData(" World");
        // Simulate async completion
        setTimeout(() => onComplete(), 10);
    })
}));

const server = require('../src/bridge_server');
const CONV_DIR = path.join(__dirname, '..', 'conversations');

describe('Bridge Server Capabilities', () => {

    // cleanup
    afterAll((done) => {
        server.close(done);
    });

    it('should stream response in OpenAI format', async () => {
        const res = await request(server)
            .post('/v1/chat/completions')
            .send({ messages: [{ role: 'user', content: 'Test Query' }] })
            .expect('Content-Type', /text\/event-stream/);

        // Check for data chunks
        expect(res.text).toContain('data: {');
        expect(res.text).toContain('"content":"Hello"');
        expect(res.text).toContain('"content":" World"');
        expect(res.text).toContain('[DONE]');
    });

    it('should archive conversation to disk', async () => {
        // Wait for the previous request's async file write to finish
        await new Promise(r => setTimeout(r, 100));

        const files = fs.readdirSync(CONV_DIR);
        expect(files.length).toBeGreaterThan(0);

        // Read the most recent file
        const content = fs.readFileSync(path.join(CONV_DIR, files[0]), 'utf8');
        expect(content).toContain('## USER');
        expect(content).toContain('Test Query');
        expect(content).toContain('## ASSISTANT');
        expect(content).toContain('Hello World');
    });
});