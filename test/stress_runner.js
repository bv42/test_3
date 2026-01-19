
const http = require('http');

async function chat(messages, model = "gitlab-integrated", validationFn = null) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ messages, model });
        const options = {
            hostname: '127.0.0.1',
            port: 11435,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log(`\n[Test] Sending payload length: ${postData.length} chars...`);
        const req = http.request(options, (res) => {
            let fullResponse = "";
            let buffer = ""; // Buffer for handling split chunks

            res.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last incomplete fragment

                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices[0].delta.content) {
                                fullResponse += data.choices[0].delta.content;
                                process.stdout.write(data.choices[0].delta.content);
                            }
                        } catch (e) {
                            // ignore partial json
                        }
                    }
                }
            });

            res.on('end', () => {
                process.stdout.write('\n');
                if (validationFn) {
                    try {
                        validationFn(fullResponse);
                        console.log("✅ PASS");
                        resolve(fullResponse);
                    } catch (e) {
                        console.error(`❌ FAIL: ${e.message}`);
                        reject(e);
                    }
                } else {
                    console.log("✅ DONE");
                    resolve(fullResponse);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log("=== STARTING STRESS TESTS ===");

    try {
        // Test 1: Short connectivity check
        console.log("\n--- Test 1: Connectivity Check ---");
        await chat(
            [{ role: "user", content: "Say 'Ready'." }],
            "gitlab-integrated",
            (res) => { if (!res.includes("Ready")) throw new Error("Did not receive 'Ready'"); }
        );

        // Test 2: Long Prompt (Token Limit)
        console.log("\n--- Test 2: Long Prompt (~4000 chars) ---");
        const longText = "This is a stress test. ".repeat(200);
        await chat(
            [{ role: "user", content: `Repeat the following phrase exactly once: "End of Test". Ignore the preamble: ${longText}` }],
            "gitlab-integrated",
            (res) => { if (!res.toLowerCase().includes("end of test")) throw new Error("Did not receive completion for long prompt"); }
        );

        // Test 3: Special Characters & Injection Safety
        console.log("\n--- Test 3: Special Characters ---");
        const specialChars = "Special chars: \" ' \n \r \t \\ / < > & % $ # @ !";
        await chat(
            [{ role: "user", content: `Repeat this exactly: ${specialChars}` }],
            "gitlab-integrated",
            (res) => {
                // Flexible check because LLMs might render newlines differently
                if (!res.includes("Special chars")) throw new Error("Response missed the core phrase");
            }
        );

        // Test 4: Multi-turn Context
        console.log("\n--- Test 4: Multi-turn Context ---");
        const conversation = [];

        // Turn 1
        console.log("Turn 1: Define variable");
        conversation.push({ role: "user", content: "Remember this secret code: 'BLUE-BANANA-42'." });
        let resp1 = await chat(conversation);
        conversation.push({ role: "assistant", content: resp1 });

        // Turn 2
        console.log("Turn 2: Distractor");
        conversation.push({ role: "user", content: "What is 2+2?" });
        let resp2 = await chat(conversation);
        conversation.push({ role: "assistant", content: resp2 });

        // Turn 3
        console.log("Turn 3: Recall");
        conversation.push({ role: "user", content: "What was the secret code I told you earlier?" });
        await chat(conversation, "gitlab-integrated", (res) => {
            if (!res.includes("BLUE-BANANA-42")) throw new Error(`Context lost. Response: ${res}`);
        });

    } catch (e) {
        console.error("\n!!! SUITE FAILED !!!");
        console.error(e);
        process.exit(1);
    }

    console.log("\n=== ALL TESTS PASSED ===");
}

runTests();
