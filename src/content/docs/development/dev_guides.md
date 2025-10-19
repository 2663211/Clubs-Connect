---
title: Development Guides
description: How to create a database
---

## Application Guide/ Team Workflow Guide

This section explains how to contribute to the project, including setup, workflow, and coding standards.

### Clone the repo

- git clone https://github.com/2663211/Clubs-Connect.git
- cd Clubs-Connect

### Install dependencies

- npm install

### Create a feature/fix branch

- git checkout -b feature/<your-feature-name>

### Code with VS Code

- Auto-lint & format on save with ESLint + Prettier.

### Run lint & format checks

- npm run lint
- npm run format:check

### Commit using Conventional Commits

- git add .
- git commit -m "feat(auth): add login functionality"

### Push branch & open Pull Request

- git push origin feature/<your-feature-name>
- Merge after approval and passing CI.

## Git + PR Workflow Diagram

```
graph LR
A[Clone Repo] --> B[Create feature branch]
B --> C[Code & Format on Save]
C --> D[Run npm run lint & format:check]
D --> E[Commit using Conventional Commits]
E --> F[Push branch & open PR]
F --> G[CI runs & Review]
G --> H[Merge to main after approval]
```

## Testing Guide

### Automatic Tests

Automatic tests are done using the React Testing Library and Jest as the test runner.

### Writing Test Files

- Test files should be saved with a `.test.js` or `.spec.js` extension so the test runner can detect them.

### Installing Jest

Before running tests, install Jest in your project:

```bash
npm install --save-dev jest
```

### Running Tests

Once tests are written and Jest is installed, run the tests with:

```bash
npm run test
```

## Documentation Guide

To make changes to the document

- cd terrestrial-trappist
- npm run dev

## Git Workflow Guide

To make sure the `main` branch always works and stays clean, we followed these steps when contributing.

### Get the latest code

Always start by syncing your local repo with GitHub.

```bash
git checkout main
git pull origin main
```

### Create your own branch

Work on a new branch for your feature, bug fix, or update.

```bash
git checkout -b feature/my-feature
```

### Do your work

- Add / edit / delete files.
- Save and test your changes locally.
- Commit often with meaningful messages(refer to git methodology).

```bash
git add .
git commit -m "Add login form with validation"
```

### Keep your branch up-to-date

Before pushing, always pull the latest main and merge/rebase into your branch.

```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
```

### Push your branch

Push your changes to GitHub.

```bash
git push origin feature/my-feature
```

### Open a Pull Request (PR)

- Go to GitHub.
- Open a Pull Request from your branch → main.
- Wait for teammate responsible for main to review and merge it.
