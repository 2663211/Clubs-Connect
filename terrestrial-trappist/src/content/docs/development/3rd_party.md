---
title: Third-Party Code Documentation
description: Documentation for the external APIs, libraries, and services used in Clubs Connect
---

## Google Calendar API

**Purpose in Project**  
The Google Calendar API is used in ClubsConnect to programmatically insert events into a user’s Google Calendar. This allows students to seamlessly sync university events with their personal schedules.

**Justification**  
We selected the Google Calendar API instead of building a custom calendar system because it:

- Integrates directly with users’ existing Google accounts.
- Provides real-time syncing across devices.
- Reduces development complexity while leveraging Google’s reliable infrastructure.

**Documentation / Reference**  
[Google Calendar API – Events Insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert)

## Supabase (3rd-Party Service)

**Purpose in Project**  
Supabase provides authentication, storage, and a PostgreSQL database for ClubsConnect.

**Justification**

- Open-source alternative to Firebase with greater flexibility.
- Provides built-in authentication and relational database management.
- Accelerates backend setup and reduces infrastructure overhead.

**Documentation / Reference**  
[Supabase Docs](https://supabase.com/docs)

## GitHub Actions

**Purpose in Project**  
GitHub Actions is used to automate continuous integration and deployment (CI/CD) workflows.

**Justification**

- Fully integrated with GitHub, reducing the need for external CI tools.
- Provides automated testing, builds, and deployments on push/PR events.
- Helps maintain code quality and ensures smooth deployment cycles.

**Documentation / Reference**  
[GitHub Actions Docs](https://docs.github.com/en/actions)

## npm Packages

**Purpose in Project**  
npm (Node Package Manager) is used to manage third-party libraries required by the frontend and backend.

**Justification**

- Provides access to a large ecosystem of reusable packages.
- Simplifies dependency management and updates.
- Reduces development time by leveraging tested community code.

**Documentation / Reference**  
[npm Docs](https://docs.npmjs.com/)

## Jest + React Testing Library

**Purpose in Project**  
These testing libraries are used for automated testing of React components and application logic.

**Justification**

- Jest is lightweight, fast, and integrates smoothly with React.
- React Testing Library encourages testing from the user’s perspective.
- Provides coverage reporting and ensures reliability of features.

**Documentation / Reference**  
[Jest Docs](https://jestjs.io/docs/getting-started)  
[React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
