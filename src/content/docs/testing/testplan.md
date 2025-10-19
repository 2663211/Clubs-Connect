---
title: Test Plan
description: Plan of how we are going to conduct testing
---

## Introduction

The product to be tested is the Clubs Connect web application developed by the Bit-by-Bit team. The application’s goal is to connect CSOs and students by streamlining the processes between CSO executives and the SGO, the office overseeing CSOs, while also providing a platform for students to discover CSOs and follow their activities.

## Objectives

The objective of testing is to ensure that the application meets the client’s requirements by delivering a bug-free product. This will be achieved through continuous testing and regular communication with the client and as part of the continuous integration process, testing will be required when merging code.

## Roles and Responsibilities

As outlined in the methodology, the team follows a flat structure where all members contribute equally. This approach also applies to testing: each team member will be responsible for writing tests for the features they develop and submitting them along with their new features or updates ones.

## Risks and Assumptions

### Risks

- Team members may fall behind and fail to submit tests with their features, which could introduce bugs into the system.
- Incomplete test coverage may leave some features insufficiently tested.
- Automated tests may become flaky, failing inconsistently due to timing issues or asynchronous operations.
- Integration challenges may arise when combining Jest with React Testing Library if configurations are inconsistent.
- Code may pass in local environments but fail in CI/CD due to configuration mismatches.
- Developers may deprioritize testing under time pressure, leading to reduced quality.
- Test data may become inconsistent with real data, causing false positives or negatives.

### Assumptions

- Jest and React Testing Library will remain compatible with the chosen React version.
- Developers will follow agreed-upon testing standards, including naming conventions and coverage expectations.
- The CI/CD pipeline will reliably execute all automated tests before merges are approved.
- Mock data and test doubles will be maintained to reflect real-world scenarios.
- The client will provide timely feedback to support acceptance testing.
- External dependencies such as APIs will be mocked to avoid instability in tests.

## In Scope (Features to Be Tested)

The following features will be covered in the testing process to ensure that all core functionalities of the Clubs Connect platform are working as intended:

- **Authentication** – Verify login, sign-up, and access control.
- **Adding a CSO** – Test creation of new clubs or societies.
- **Changing roles** – Ensure role assignment and permissions are correctly applied.
- **Posting on a CSO page** – Validate creation, editing, and deletion of posts.
- **Following a CSO** – Confirm users can follow and unfollow clubs and see updates.
- **API functionality** – Check API responses, data retrieval, and data consistency.
- **Creating CSO events** – Test event creation, display, and calendar integration.
- **Comments** – Ensure commenting, editing, and deletion works as expected.
- **Likes** – Confirm likes are correctly recorded and displayed.
- **Dashboards** – Verify student, executive, and SGO dashboards reflect correct data.
- **Other interactive features** – Test any additional functionality with user interaction.

Note: All files containing executable functionality will be tested to ensure that each feature behaves correctly.

## Out of Scope (Features Not to Be Tested)

The following files and features will not be included in the testing process:

- **`index.js` and app routing files** – These are required by Vite for the build process and primarily handle routing between pages. They do not contain feature-specific functionality, so testing is not necessary.
- **Report Web Vitals** – Performance measurement scripts included by default; they are not part of the application’s functional requirements.

Reason: Testing is focused on **functional features** that directly impact user experience. Infrastructure and configuration files, while important for application setup, do not implement interactive functionality and are therefore out of scope.

## Environment & Tools

The testing framework to be used is the React Testing Library, alongside Jest. The development environment will be integrated with the GitHub workflow and CI/CD pipeline. Version control and test integration will be managed collaboratively through GitHub.

## Timescales

Testing will take place concurrently with development. Unit and integration tests will be written for each feature as it is developed and integrated. User testing will be conducted at the end of each sprint for the features completed by that time. Regular client meetings will be held to demonstrate progress and support acceptance testing.

The Sprints are scheduled as follows:

![Project timeline](/Clubs-Connect/timeline.png "Timeline")
