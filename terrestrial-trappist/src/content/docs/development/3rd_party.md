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

## Astro JS x Starlight

## Big O No API

**Study Nest API**: A REST API for accessing current study groups & sessions from the Study Nest team.
**Base URL**: https://studynester.onrender.com

**Groups API & Session API**

**`GET /groups`**

- **Description**: Fetch all current groups
- **Method**: `GET`

**Group Response**

```json
[
  {
    "id": "7bde1924-58e5-4bac-aa32-d5de51ee0c93",
    "name": "new group",
    "description": "specifically for testing",
    "created_by": "3b8711f9-5de7-4129-9cb4-71ba40df42ca",
    "created_at": "2025-09-27T11:24:50.020945+00:00"
  },
  {
    "id": "f2e03448-16d2-4d2b-bdb5-8af9e7158ad0",
    "name": "COMS30003A",
    "description": "FLA",
    "created_by": "3b8711f9-5de7-4129-9cb4-71ba40df42ca",
    "created_at": "2025-09-29T17:41:01.752733+00:00"
  }
]
```

**Usage Examples**

JavaScript ( / Browser)

fetch("https://studynester.onrender.com/groups")
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

**Sessions API**

_Note : Use the groupId's from the groups' json response you will get_

**`GET /sessions/{groupId}`**

- **Description**: Fetch all current sessions
- **Method**: `GET`

**Session Response**

```json
[
  {
    "id": "c9705cf6-40e1-4ad4-a4a7-b2045aed6276",
    "group_id": "f2e03448-16d2-4d2b-bdb5-8af9e7158ad0",
    "title": "Session#1",
    "description": "Session #1 Description",
    "created_by": "906607d7-4752-45b3-bfd2-ed0f119a61be",
    "created_at": "2025-10-16T19:08:23.926022+00:00",
    "start_time": "2025-10-25T21:08:00+00:00",
    "end_time": "2025-10-25T21:15:00+00:00",
    "location": "MSL 108"
  }
]
```

**Usage Examples**

JavaScript ( / Browser)

fetch("https://studynester.onrender.com/sessions/groupId)
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
