# Security Policy

OpenGuard handles repository webhooks, GitHub tokens, Cohere API keys, and SMTP credentials. Treat all reports involving authentication, webhook verification, token leakage, prompt abuse, or unsafe review behavior as security-sensitive.

## Reporting a Vulnerability

Do not open a public issue for vulnerabilities.

Send a private report to the maintainers with:

- A clear summary of the issue
- Steps to reproduce
- Impact and affected configuration
- Relevant logs with secrets removed
- Suggested fix, if known

If no private security channel is available yet, contact a repository maintainer directly and ask for a secure disclosure path.

## Supported Versions

The `main` branch is the supported development line.

## Security Expectations

- Never commit `.env` files, API keys, webhook secrets, SMTP credentials, or GitHub tokens.
- Use `GITHUB_WEBHOOK_SECRET` in production.
- Use the least privileged GitHub token that can read pull requests and create reviews/comments.
- Rotate credentials immediately if logs, screenshots, or commits expose them.
- Review AI-generated output before relying on it for high-risk changes.
