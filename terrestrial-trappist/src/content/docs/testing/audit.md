---
title: Security Audit Report
description: Audit of the system - Supply Chain Attack
---

## Response Plan

### Audit Results

The first step in response to the attack was to audit the system. We used React for the development and it uses npm packages, and the first thing was to find out if the we were using some of the affected packages, the .

1. Dependabots Alerts
   We enabled the Dependabots Alert on GitHub to run on main. These were thenresults

2. Code Scanning
   As an extra layer of protection we employed code scanning to help detect obfuscated code than can be caused by malware. These were the initial results after the tool was enabled. We used CodeQL and the results are as follows from GitHub

3. npm audit results. We ran npm audit on the terminal

```
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "devalue": {
      "name": "devalue",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1106997,
          "name": "devalue",
          "dependency": "devalue",
          "title": "devalue prototype pollution vulnerability",
          "url": "https://github.com/advisories/GHSA-vj54-72f3-p5jv",
          "severity": "high",
          "cwe": [
            "CWE-1321"
          ],
          "cvss": {
            "score": 0,
            "vectorString": null
          },
          "range": "<5.3.2"
        }
      ],
      "effects": [],
      "range": "<5.3.2",
      "nodes": [
        "node_modules/devalue"
      ],
      "fixAvailable": true
    },
    "vite": {
      "name": "vite",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1107324,
          "name": "vite",
          "dependency": "vite",
          "title": "Vite middleware may serve files starting with the same name with the public directory",
          "url": "https://github.com/advisories/GHSA-g4jq-h2w9-997c",
          "severity": "low",
          "cwe": [
            "CWE-22",
            "CWE-200",
            "CWE-284"
          ],
          "cvss": {
            "score": 0,
            "vectorString": null
          },
          "range": ">=6.0.0 <=6.3.5"
        },
        {
          "source": 1107328,
          "name": "vite",
          "dependency": "vite",
          "title": "Vite's `server.fs` settings were not applied to HTML files",
          "url": "https://github.com/advisories/GHSA-jqfw-vq24-v9c3",
          "severity": "low",
          "cwe": [
            "CWE-23",
            "CWE-200",
            "CWE-284"
          ],
          "cvss": {
            "score": 0,
            "vectorString": null
          },
          "range": ">=6.0.0 <=6.3.5"
        }
      ],
      "effects": [],
      "range": "6.0.0 - 6.3.5",
      "nodes": [
        "node_modules/vite"
      ],
      "fixAvailable": true
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 1,
      "moderate": 0,
      "high": 1,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 375,
      "dev": 0,
      "optional": 95,
      "peer": 1,
      "peerOptional": 0,
      "total": 470
    }
  }
}
```

### Analysis of results

### Solution/ fix of results

Most of the alerts we could not fix them because we were using Create React App which used React 5.0.0, the last

## Risk Assessment

## Mitigation & Prevention

To mitigate the impact of

### Protecting Against Supply Chain Attacks (Upstream Protection)

### Protecting Against Malware Infection (Downstream Protection)

## Lessons Learned & Recommendations

One of the biggest lesson learned is that anyone can be victim to cyber crime even the most technincal people hence it is important to install tools that will help in identifying the problems when our judgement fails as humans. How a single compromise can affect millions of people around the world (This chain shows how a single compromised account can lead to the spread of malicious code, credential theft, and mass data leakage across an organization’s entire development environment.)
