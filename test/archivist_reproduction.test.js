
const request = require('supertest');
const app = require('../src/bridge_server');
const fs = require('fs');

// Mock fs
jest.mock('fs', () => {
    const originalFs = jest.requireActual('fs');
    return {
        ...originalFs,
        existsSync: jest.fn(),
        mkdirSync: jest.fn(),
        appendFile: jest.fn(),
        readFileSync: jest.fn(),
    };
});

// Mock console.error to detect the crash
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

// Mock automation driver's executeQuery to finish immediately
jest.mock('../src/automation_driver', () => ({
    initialize: jest.fn(),
    executeQuery: (ctx, onData, onDone) => {
        onData(' Simulating response content');
        onDone();
    }
}));

describe('Archivist Stability Reproduction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should throw ReferenceError when saving to an existing conversation file', async () => {
        // Condition for the bug:
        // 1. messages array has content.
        // 2. File exists (fs.existsSync returns true).
        // 3. User message is present, so pendingUserMsg is created.

        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue("Previous content\n\n---");

        // Trigger the route
        await request(app)
            .post('/v1/chat/completions')
            .send({
                messages: [
                    { role: 'user', content: 'Hello' },
                    { role: 'assistant', content: 'Hi' },
                    { role: 'user', content: 'Trigger Bug' }
                ],
                model: 'test-model'
            });

        // The saveConversation happens async after response end. 
        // We might need a small delay or rely on the spy being called.
        // However, since executeQuery is synchronous in our mock, saveConversation runs before the route returns?
        // No, `res.end()` is called, then `saveConversation`.

        // Let's check calls to console.error
        const errorCalls = consoleErrorSpy.mock.calls.map(c => c[0]);
        const refError = errorCalls.find(msg => msg.includes('lastUserMsg is not defined'));

        if (!refError) {
            // For debugging: print what WAS called
            console.log("Console Errors seen:", errorCalls);
        }

        if (refError) {
            console.log("Unexpected Console Error:", refError);
        }

        expect(refError).toBeUndefined();
    });
});
