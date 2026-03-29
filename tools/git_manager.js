#!/usr/bin/env node
const { execSync } = require('child_process');
const https = require('https');
const url = require('url');

// --- CONFIG ---
const fs = require('fs');
const GITEA_TOKEN = process.env.GITEA_TOKEN;
const GITEA_URL = process.env.GITEA_URL || 'https://gitea.example.com';
const REPO_OWNER = process.env.REPO_OWNER || 'owner';
const REPO_NAME = process.env.REPO_NAME || 'repo';
const CA_FILE = process.env.GITLAB_CA_FILE; // Custom CA Bundle

let CA_BUNDLE = null;
if (CA_FILE) {
    try {
        CA_BUNDLE = fs.readFileSync(CA_FILE);
        console.log(`[Config] Loaded Custom CA from ${CA_FILE}`);
    } catch (e) {
        console.error(`[Config] Failed to load CA: ${e.message}`);
        process.exit(1);
    }
}

// --- GIT HELPER ---
const runGit = (cmd) => {
    try {
        console.log(`[Git] Running: git ${cmd}`);
        return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
    } catch (e) {
        console.error(`[Git] Error: ${e.message}`);
        process.exit(1);
    }
};

// --- GITEA CLIENT ---
async function createPullRequest(title, body, head, base = 'main') {
    if (!GITEA_TOKEN) {
        console.error("[Gitea] Error: GITEA_TOKEN not set.");
        process.exit(1);
    }

    console.log(`[Gitea] Creating PR: "${title}" (${head} -> ${base})`);

    const postData = JSON.stringify({
        title,
        body,
        head,
        base
    });

    const parsedUrl = url.parse(`${GITEA_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}/pulls`);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${GITEA_TOKEN}`,
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Sovereign-Agent'
        },
        ca: CA_BUNDLE // Inject Custom CA
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const json = JSON.parse(data);
                    console.log(`[Gitea] PR Created: ${json.html_url}`);
                    resolve(json);
                } else {
                    console.error(`[Gitea] API Error (${res.statusCode}): ${data}`);
                    reject(new Error(data));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

// --- MAIN ---
async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--help')) {
        console.log(`
Usage: node tools/git_manager.js [options]

Options:
  --status            Show git status
  --add <files...>    Git add files
  --commit <msg>      Git commit with message
  --push              Git push current branch
  --create-pr         Create PR (requires --title)
  --title <text>      PR Title
  --body <text>       PR Body (optional)
        `);
        return;
    }

    if (args.includes('--status')) {
        console.log(runGit('status'));
    }

    const addIdx = args.indexOf('--add');
    if (addIdx !== -1) {
        const files = args[addIdx + 1]; // Naive single file support for demo, loop for robust
        runGit(`add ${files}`);
    }

    const commitIdx = args.indexOf('--commit');
    if (commitIdx !== -1) {
        const msg = args[commitIdx + 1];
        runGit(`commit -m "${msg}"`);
    }

    if (args.includes('--push')) {
        const branch = runGit('rev-parse --abbrev-ref HEAD');
        runGit(`push origin ${branch}`);
    }

    if (args.includes('--create-pr')) {
        const titleIdx = args.indexOf('--title');
        if (titleIdx === -1) {
            console.error("Error: --title required for PR");
            process.exit(1);
        }
        const title = args[titleIdx + 1];
        const bodyIdx = args.indexOf('--body');
        const body = bodyIdx !== -1 ? args[bodyIdx + 1] : "Automated PR by Sovereign Agent";

        const branch = runGit('rev-parse --abbrev-ref HEAD');
        await createPullRequest(title, body, branch);
    }
}

main().catch(console.error);
