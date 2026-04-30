# OpenGuard

OpenGuard is a Bun webhook service for GitHub repositories. It listens for pull request, issue, pull request comment, and push events, then notifies maintainers by email and uses Cohere to review repository activity.

## Features

- Pull request AI reviews posted directly to GitHub
- Issue triage comments posted directly to GitHub
- Pull request comment re-review
- Admin email summaries for pull requests, issues, comments, and pushes
- Optional GitHub webhook signature verification
- Append-only JSONL event log
- Bun test coverage for pure review and routing logic

## Setup

1. Install dependencies:

```sh
bun install
```

2. Create `.env` from `.env.example` and fill in the values.

3. Run locally:

```sh
bun run dev
```

4. Configure the GitHub webhook URL:

```txt
https://your-domain.com/webhook/github
```

Subscribe to `Pull requests`, `Issues`, `Issue comments`, and `Pushes`.

## Environment

`ADMINS` accepts emails separated by `|` or `,`.

`GITHUB_TOKEN` needs permission to read pull requests and create pull request reviews and issue comments.

`COHERE_MODEL` defaults to `command-a-03-2025`.

`OPENGUARD_CUSTOM_INSTRUCTIONS` is appended to OpenGuard's system instructions.

## Commands

```sh
bun run start
bun run start:docker
bun run stop
bun run restart
bun run logs
bun run dev
bun run test
bun run typecheck
```

`bun run start` runs OpenGuard through PM2 as `openguard` and attaches logs to the terminal.

## Docker

Build the image:

```sh
docker build -t openguard .
```

Run the container with your environment file:

```sh
docker run --env-file .env -p 3000:3000 openguard
```

For persistent event logs, mount the logs directory:

```sh
docker run --env-file .env -p 3000:3000 -v openguard-logs:/app/logs openguard
```

## Community

- Contributions: `CONTRIBUTING.md`
- Security policy: `SECURITY.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
- License: `LICENSE`
