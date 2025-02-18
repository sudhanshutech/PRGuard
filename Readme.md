# PR Review Bot

## Overview
PR Review Bot is a GitHub Action that automatically reviews pull requests based on predefined and user-defined policy rules. It comes with built-in checks for PR title requirements, security audits, linting, and formatting validations. Users can also define additional custom policies.

## Features
- ✅ Predefined PR review rules included
- 🔍 Enforce PR title and description requirements
- 🔒 Security vulnerability checks with `npm audit`
- 🎨 Code linting and formatting enforcement
- 📑 Adds comments on PRs with review feedback
- 🛠️ Supports user-defined policies for custom rules

## Whose GitHub Token is Used?
The GitHub Action automatically uses `secrets.GITHUB_TOKEN`, which GitHub provides for each workflow run. This token is scoped to the repository and allows the action to fetch pull request data, add comments, and run necessary checks.

## Usage
### 1. Add PR Review Bot to Your Repository
Create a GitHub Actions workflow under `.github/workflows/pr-review.yml`:

```yaml
name: PR Review Bot
on:
  pull_request:
    types: [opened, synchronize, edited]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run PR Review Bot
        uses: your-username/pr-review-bot@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          config_file: "config/pr-bot-config.json"
```

### 2. Built-in Rules
The PR Review Bot includes the following default checks:
- **PR Title Check**: Ensures the PR has a valid title.
- **PR Description Recommendation**: Suggests adding a description if missing.
- **Security Vulnerability Check**: Runs `npm audit` to detect vulnerabilities.
- **Linting and Formatting Check**: Runs `npm run lint` and `npm run format` to enforce code standards.

### 3. Adding Custom Rules
If you need additional rules, create a `config/pr-bot-config.json` file in your repository and define your own policies:

```json
{
  "rules": [
    {
      "id": "checkCommitMessages",
      "description": "Ensure commit messages follow the conventional format",
      "type": "regex",
      "pattern": "^(feat|fix|docs|style|refactor|test|chore): .+",
      "errorMessage": "❌ Commit messages should follow conventional commits format."
    }
  ]
}
```

This configuration allows you to enforce additional PR validation policies beyond the default rules.

### 4. Run the Action
Whenever a pull request is opened or updated, the bot will review the PR based on the built-in and configured custom rules, then post comments accordingly.

## License
This project is open-source under the MIT License.

