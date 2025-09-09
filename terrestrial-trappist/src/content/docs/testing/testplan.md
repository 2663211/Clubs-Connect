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

## In Scope (Features to be tested)

- Authentication
- Adding a CSO
- Changing roles
- Posting on a CSO page
- Following a CSO
- API functionality
- Creating a CSO event

## Out of Scope (Features not to be tested)

- Browser compatibility across different platforms
- External APIs from third-party projects

## Environment & Tools

The testing framework to be used is the React Testing Library, alongside Jest. The development environment will be integrated with the GitHub workflow and CI/CD pipeline. Version control and test integration will be managed collaboratively through GitHub.

## Timescales

Testing will take place concurrently with development. Unit and integration tests will be written for each feature as it is developed and integrated. User testing will be conducted at the end of each sprint for the features completed by that time. Regular client meetings will be held to demonstrate progress and support acceptance testing.

The Sprints are scheduled as follows:

![Project timeline](/Clubs-Connect/timeline.png "Timeline")
