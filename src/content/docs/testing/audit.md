---
title: Security Audit Report
description: Audit of the system - Supply Chain Attack
---

## Response Plan

### Audit Results

The first step in responding to the supply chain attack was to conduct a thorough audit of the system. The Clubs Connect application is built using React and relies on npm packages. The audit focused on identifying whether any of the packages in use were affected by known vulnerabilities.

1. **Dependabot Alerts**  
   Dependabot alerts were enabled on GitHub for the `main` branch. These alerts provided automated notifications about vulnerable dependencies and helped identify packages requiring attention.
   ![Dependabot Alert](/Clubs-Connect/dependabots1.png "Dependabot Alert")
   ![Dependabot Alert](/Clubs-Connect/dependabots2.png "Dependabot Alert")

2. **Code Scanning**  
    As an additional layer of protection, code scanning was employed to detect obfuscated or suspicious code that could be introduced by malware. We used GitHub’s CodeQL tool, which provides static analysis to identify security risks in the codebase.
   ![CodeQL Scan](/Clubs-Connect/codeql.png "CodeQL Scan")

3. **npm Audit Results**  
   We ran `npm audit` in the terminal to analyze the project dependencies. The key results are summarized below:

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

The audit revealed a small number of vulnerabilities, with one high-severity and one low-severity issue. Most vulnerabilities originated from dependencies used indirectly by the project through Create React App and its associated packages.

### Solution/ fix of results

- **React/Vite Migration**: To address unresolved issues with Create React App dependencies, the project was migrated to Vite. This migration reduced dependency-related vulnerabilities and enabled better control over the build process.
- **Dependency Updates**: Fixed vulnerabilities in `devalue`, Astro, and Vite packages. These are some of the closed alerts that we could fix:
  ![Closed Dependabot Alert](/Clubs-Connect/closed-dependabots.png "Closed Dependabot Alert")
  ![Closed CodeQL Alerts](/Clubs-Connect/closed-codeql.png "Closed CodeQL Alerts")

## Risk Assessment

The identified vulnerabilities, if exploited, could allow attackers to perform actions such as prototype pollution or file exposure. Although the risk is mitigated by limited direct exposure and read-only production configurations, it is essential to remain vigilant and maintain regular audits.

## Mitigation & Prevention

### Protecting Against Supply Chain Attacks (Upstream Protection)

- Enable Dependabot alerts and automated updates for dependencies.
- Use code scanning and static analysis tools such as CodeQL.
- Review third-party packages before integration.
- Maintain minimal direct dependencies wherever possible.

### Protecting Against Malware Infection (Downstream Protection)

- Apply least privilege principles for access to the codebase.
- Conduct regular security audits of builds and CI/CD pipelines.
- Monitor user and contributor activity for anomalies.

## Lessons Learned & Recommendations

- Supply chain attacks can affect even well-maintained projects; proactive monitoring and automated tools are essential.
- The migration to Vite demonstrates that architectural adjustments can mitigate dependency-related vulnerabilities.
- Human judgment alone is insufficient for security; automated scanning and dependency alerts are critical for maintaining a safe environment.
- Maintain systematic resolution of security alerts using CodeQL and Dependabot.
- Continue periodic audits and static analysis to ensure the security of newly added code and dependencies.

## Conclusion

The Clubs Connect team actively manages security debt, addressing vulnerabilities promptly while strengthening the overall application architecture. The system now has improved protection against supply chain risks, DOM-based XSS, and dependency-related vulnerabilities, ensuring safer interactions for students, executives, and SGO staff.
