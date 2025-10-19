---
title: Supply Chain Attack
description: Audit of the system - Supply Chain Attack
---

## Introduction

During the development of the Clubs Connect application, a supply chain attack targeting npm packages was identified. The purpose of this audit was to determine whether the packages used in the project were compromised and to ensure that the system was protected against malware that could endanger the integrity of the Clubs Connect application.

This report examines two major supply chain attacks that occurred in September 2025:

- The npm debug and chalk package compromise
- The Tinycolor npm package compromise

It further presents findings from the evaluation of the packages used in the application and outlines strategies to safeguard the system against future incidents.

## The Shai-hulud Supply Chain Attack

The Shai-Hulud attack chain originated from a phishing email disguised as an npm security alert, which successfully tricked a developer into disclosing their credentials. Attackers then compromised the developer’s npm account and uploaded a malicious package.

Unlike traditional compromises, Shai-Hulud exhibited worm-like self-replication, autonomously spreading to additional packages and environments (Trend Micro, 2025).

**Summary of Attack Behavior:**

- Upon installation, the package executed JavaScript and embedded Unix shell scripts to establish persistence and begin data theft.
- Using stolen GitHub access tokens, the malware authenticated with the GitHub API, enumerated repository access (including private repos), and cloned them into attacker-controlled accounts.
- It created malicious branches and automated workflows for data exfiltration.
- It downloaded and ran TruffleHog to harvest additional secrets.
- It made private repositories public and mirrored their full history.
- Stolen data was exfiltrated through automated web requests.

![Shai-Hulud Attack Summary](/Clubs-Connect/shaihuludattackchain.png "Shai-Hulud")

**Key Characteristics:**

- Self-propagation: Acts as a worm, infecting additional npm packages and projects.
- Autonomy: Functions without continuous operator intervention.
- Environmental impact: Targets CI/CD pipelines, credentials, and tokens.

**Technical Methodology:**

- Post-install abuse: Exploits npm’s post-install scripts to execute arbitrary code.
- Network activity: Communicates with remote servers for data theft and updates.
- Recursive infection: Maintains persistence by re-infecting updated dependencies.

### The npm debug and chalk packages compromise

This malware operated as a browser-based interceptor, hijacking both network traffic and application APIs. It injected itself into functions such as fetch, XMLHttpRequest, and crypto wallet APIs, silently rewriting transaction destinations.

**How It Worked:**

- Injected itself into the browser.
- Monitored sensitive data.
- Rewrote transaction targets.
- Hijacked approvals and payments before user confirmation.
- Remained stealthy, using look-alike values to avoid detection.

The malicious updates added code that silently intercepted crypto and Web3 activity in the browser, manipulated wallet interactions, and redirected payments to attacker-controlled accounts.

**Indicators of Compromise:**

- Malicious versions released across affected packages.
- Phishing domain: npmjs.help (Eriksen, 2025).

### The Tinycolor npm Package compromise

A malicious update to @ctrl/tinycolor (with over 2.2 million weekly downloads) was identified as part of a larger supply chain attack that affected more than 40 npm packages at the beginning of the attack across multiple maintainers (Socket, 2025).

**Malicious Functionality:**

The compromised package included a function (NpmModule.updatePackage) that:

- Downloaded legitimate package tarballs.
- Modified package.json and injected a malicious script (bundle.js).
- Repacked and republished the package, spreading the trojanized version downstream.

**How It Worked:**

- bundle.js executed TruffleHog to search hosts for tokens and credentials.
- Harvested secrets were validated and used to create malicious GitHub Actions workflows.
- Exfiltrated data to a hardcoded webhook: hxxps://webhook[.]site/bb8ca5f6-4175-45d2-b042-fc9ebb8170b7.
- Executed automatically upon installation.

### Compromised Packages and Versions

**The npm debug and chalk packages compromise**

Affected Packages and Versions:

```
- backslash 0.2.1
- chalk-template 1.1.1
- supports-hyperlinks 4.1.1
- has-ansi 6.0.1
- simple-swizzle 0.2.3
- color-string 2.1.1
- error-ex 1.3.3
- color-name 2.0.1
- is-arrayish 0.3.3
- slice-ansi 7.1.1
- color-convert 3.1.1
- wrap-ansi 9.0.1
- ansi-regex 6.2.1
- supports-color 10.2.1
- strip-ansi 7.1.1
- chalk 5.6.1
- debug 4.4.2
- ansi-styles 6.2.2
```

**The Tinycolor npm Package compromise**

Affected Packages and Versions:

```
- angulartics2 14.1.2
- @ctrl/deluge 7.2.2
- @ctrl/golang-template 1.4.3
- @ctrl/magnet-link 4.0.4
- @ctrl/ngx-codemirror 7.0.2
- @ctrl/ngx-csv 6.0.2
- @ctrl/ngx-emoji-mart 9.2.2
- @ctrl/ngx-rightclick 4.0.2
- @ctrl/qbittorrent 9.7.2
- @ctrl/react-adsense 2.0.2
- @ctrl/shared-torrent 6.3.2
- @ctrl/tinycolor 4.1.1, 4.1.2
- @ctrl/torrent-file 4.1.2
- @ctrl/transmission 7.3.1
- @ctrl/ts-base32 4.0.2
- encounter-playground 0.0.5
- json-rules-engine-simplified 0.2.4, 0.2.1
- koa2-swagger-ui 5.11.2, 5.11.1
- @nativescript-community/gesturehandler 2.0.35
- @nativescript-community/sentry 4.6.43
- @nativescript-community/text 1.6.13
- @nativescript-community/ui-collectionview 6.0.6
- @nativescript-community/ui-drawer 0.1.30
- @nativescript-community/ui-image 4.5.6
- @nativescript-community/ui-material-bottomsheet 7.2.72
- @nativescript-community/ui-material-core 7.2.76
- @nativescript-community/ui-material-core-tabs 7.2.76
- ngx-color 10.0.2
- ngx-toastr 19.0.2
- ngx-trend 8.0.1
- react-complaint-image 0.0.35
- react-jsonschema-form-conditionals 0.3.21
- react-jsonschema-form-extras 1.0.4
- rxnt-authentication 0.0.6
- rxnt-healthchecks-nestjs 1.0.5
- rxnt-kue 1.0.7
- swc-plugin-component-annotate 1.9.2
- ts-gaussian 3.0.6
```

## Dependencies Overview

This section outlines the current dependencies that are in our package-lock files. As of the time of this report, there is no indication that any of the listed packages have been affected by the Shaid-Hulud Supply Chain Attack. This report is prepared prior to the Sprint 3 deadline on 29 September 2025. Due to the worm-like propagation characteristics of Shai-Hulud, additional packages may become affected over time. This analysis represents an initial assessment of our dependencies, forming the first line of response in safeguarding the Clubs Connect Application.

A comprehensive system audit is available [Clubs Connect Audit](/Clubs-Connect/testing/audit) where tools such as Dependabot alerts and code scanners were used to identify potential risks and malware that could impact the application.

### Application Dependencies

```
@supabase/supabase-js 2.55.0
@testing-library/dom 10.4.1
bootstrap 5.3.8
cors 2.8.5
express: 5.1.0
lucide-react 0.542.0
react 19.1.1
react-bootstrap 2.10.10
react-dom 19.1.1
react-router 6.30.1
react-router-dom 6.30.1
react-scripts 5.0.1
web-vitals 2.1.4
```

### Application Dev Dependencies

```
@babel/preset-env 7.28.3
@babel/preset-react 7.27.1
@testing-library/jest-dom 6.8.0
@testing-library/react 16.3.0
@testing-library/user-event 14.6.1
babel-jest 30.1.2
cross-env 10.1.0
eslint 8.57.1
eslint-config-prettier 10.1.8
eslint-plugin-prettier 5.5.4
eslint-plugin-react-hooks 5.2.0
gh-pages 6.3.0
husky 9.1.7
jest 27.5.1
lint-staged 16.1.6
prettier 3.6.2
react-test-renderer 19.1.1
supertest 7.1.4
```

### Server Dependencies

```
express 4.18.2
cors 2.8.5
@supabase/supabase-js 2.0.0
dotenv 16.0.0
```

### Documentation Website Dependencies

```
@astrojs/starlight 0.36.0
astro 5.14.4
sharp 0.34.2
```
