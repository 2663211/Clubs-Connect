# 🌱 Git Workflow Guide (Keep `main` Clean)

To make sure our `main` branch always works and stays clean, please follow these steps when contributing.

---

## 1. Get the latest code

Always start by syncing your local repo with GitHub.

```bash
git checkout main
git pull origin main
```

# 2. Create your own branch

Work on a new branch for your feature, bug fix, or update.

```bash
git checkout -b feature/my-feature
```

# 3. Do your work

Add / edit / delete files.

Save and test your changes locally.

Commit often with meaningful messages.

```bash
git add .
git commit -m "Add login form with validation"
```

# 4. Keep your branch up-to-date

Before pushing, always pull the latest main and merge/rebase into your branch.

```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
```

# 5. Push your branch

Push your changes to GitHub.

```bash
git push origin feature/my-feature
```

# 6. Open a Pull Request (PR)

Go to GitHub.

Open a Pull Request from your branch → main.

Wait for teammate responsible for main to review and merge it.

# 🌐 Live Demo

🚀 **View the deployed site here:**  
👉 [https://gentle-coast-05e458303.1.azurestaticapps.net](https://gentle-coast-05e458303.1.azurestaticapps.net/)

