---
title: Code Structure
description: Overview of the project folder organization
---

The repository follows a structured layout to separate concerns and make collaboration easier.

```bash
Clubs-Connect/
│
├── src/                  # Main application source code
│   ├── components/       # Reusable React components (buttons, forms, modals, etc.)
│   ├── pages/            # Page-level components (routes in the app)
│   ├── styles/           # CSS files and global styles
│   ├── utils/            # Utility/helper functions
│   ├── services/         # API calls and integrations (e.g., Supabase, Google API)
│   └── tests/            # Unit and integration tests
│
├── public/               # Static assets (images, icons, logos)
│
├── docs/                 # Documentation site (Astro Starlight)
│
├── .github/workflows/    # GitHub Actions CI/CD workflows
│
├── package.json          # Dependencies and npm scripts
├── README.md             # Project overview
└── ...other config files (eslint, prettier, etc.)
```
