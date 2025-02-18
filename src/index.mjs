import { Octokit } from "@octokit/rest";  // ES Module import
import { execSync } from "child_process";
import fs from "fs";  // Use import for fs as well
import dotenv from "dotenv";  // Use import for dotenv

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const prNumber = process.env.PR_NUMBER;
const CONFIG_FILE = "config/pr-bot-config.json";

async function reviewPR() {
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
    let comments = [];

    // Load user-defined policies
    let policies = {};
    if (fs.existsSync(CONFIG_FILE)) {
        policies = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    }

    if (!policies.rules || !Array.isArray(policies.rules)) {
        console.error("Invalid policy configuration");
        return;
    }

    // Apply user-defined rules
    policies.rules.forEach(rule => {
        if (rule.type === "required" && (!pr[rule.field] || pr[rule.field].trim() === "")) {
            comments.push(rule.errorMessage);
        }
        
        if (rule.type === "recommended" && (!pr[rule.field] || pr[rule.field].trim() === "")) {
            comments.push(rule.errorMessage);
        }
        
        if (rule.type === "command") {
            try {
                execSync(rule.command, { stdio: "ignore" });
            } catch (error) {
                comments.push(rule.errorMessage);
            }
        }
    });

    // Post review comments
    if (comments.length > 0) {
        await octokit.issues.createComment({ owner, repo, issue_number: prNumber, body: comments.join("\n") });
    }
}

reviewPR().catch(console.error);
