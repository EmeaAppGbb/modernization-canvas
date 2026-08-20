# Security policy

Please do not disclose suspected vulnerabilities in a public issue.

Use GitHub's **Report a vulnerability** flow for this repository. Include the
affected version, reproduction steps, impact, and any suggested mitigation.

The canvas binds its renderer to loopback only, uses a per-instance request
token for state-changing requests, and does not execute generated Modernize CLI
commands.
