# Contributing to Clubs-Connect

This file explains how to contribute to the project, including setup, workflow, and coding standards.

---

## 🚀 Quick Start

### 1. Clone the repo

- git clone https://github.com/2663211/Clubs-Connect.git
- cd Clubs-Connect

2. Install dependencies
   - npm install

3. Create a feature/fix branch
   - git checkout -b feature/<your-feature-name>

4. Code with VS Code
   - Auto-lint & format on save with ESLint + Prettier.

5. Run lint & format checks
   - npm run lint
   - npm run format:check

6. Commit using Conventional Commits
   - git add .
   - git commit -m "feat(auth): add login functionality"

7. Push branch & open Pull Request
   - git push origin feature/<your-feature-name>
   - Merge after approval and passing CI.

🌀 Git + PR Workflow Diagram
graph LR

A[Clone Repo] --> B[Create feature branch]
B --> C[Code & Format on Save]
C --> D[Run npm run lint & format:check]
D --> E[Commit using Conventional Commits]
E --> F[Push branch & open PR]
F --> G[CI runs & Review]
G --> H[Merge to main after approval]

📋 Team Workflow Summary

1. Clone the repo.

2. Install dependencies:
   - npm install

3. Create a feature/fix branch:
   - git checkout -b feature/<name>

4. Code in VS Code with ESLint + Prettier auto-format.

5. Run lint & format checks before committing:
   - npm run lint
   - npm run format:check

6. Commit with Conventional Commits.

7. Push branch and open Pull Request (CI runs automatically).

8. Merge into main after approval and passing CI.
