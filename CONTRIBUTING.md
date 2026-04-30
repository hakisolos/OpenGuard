# Contributing to OpenGuard

Thank you for taking the time to improve OpenGuard. This project protects repository maintainers from risky pull requests, weak issue reports, and missed webhook activity, so contributions should be clear, tested, and security-aware.

## Development Setup

Install dependencies:

```sh
bun install
```

Run the development server:

```sh
bun run dev
```

Run checks before opening a pull request:

```sh
bun run test
bun run typecheck
```

## Pull Request Standards

- Keep changes focused on one problem.
- Include tests for routing, prompt, parsing, or service behavior when logic changes.
- Do not commit secrets, tokens, local logs, or `.env` files.
- Keep public AI messages professional, direct, and free of emojis.
- Prefer small pure functions for logic and isolate network calls behind services.
- Document new environment variables in `.env.example` and `README.md`.

## Commit Messages

Use short, direct commit messages:

```txt
Add pull request review routing
Fix webhook signature validation
Document Docker deployment
```

## Reporting Bugs

Open an issue with:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Relevant logs with secrets removed
- Runtime details such as Bun, Docker, or PM2 version

## Security Work

For vulnerabilities or sensitive findings, do not open a public issue. Follow `SECURITY.md`.
