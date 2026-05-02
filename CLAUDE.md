# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

Quarter Summarizer fetches a user's merged GitHub pull requests, classifies them by impact category using an LLM, then streams a first-person performance-review narrative back to the user.

## Project Structure

```
quarter-summarizer/
├── backend/          # NestJS API server
├── frontend/         # React + Vite SPA
├── docker-compose.dev.yml   # Dev stack with hot reload
└── docker-compose.prod.yml  # Prod stack (nginx serving frontend, proxying /api/ to backend)
```

## Commands

### Development (Docker — recommended)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Frontend at `http://localhost:5173`, backend at `http://localhost:3001`. Source files are volume-mounted so changes are picked up instantly (Vite HMR + NestJS watch mode).

### Backend only (without Docker)

```bash
cd backend
npm install
npm run start:dev      # watch mode
npm run start:debug    # watch + Node inspector on port 9229
npm run build          # compile to dist/
```

### Frontend only (without Docker)

```bash
cd frontend
npm install
npm run dev
```

### Linting

```bash
npm run lint --prefix frontend
npm run lint --prefix backend   # also runs prettier --fix
```

### Backend tests

```bash
cd backend
npm test                    # unit tests (jest, rootDir: src, *.spec.ts)
npm run test:watch
npm run test:cov
npm run test:e2e            # uses test/jest-e2e.json
```

### Production

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Opens on `http://localhost` (port 80). Nginx serves the built frontend and proxies `/api/*` to the NestJS backend.

## Architecture

### Backend (`backend/src/`)

NestJS application. Entry point is `main.ts`; the cluster entrypoint (`cluster.ts`) is used in production, spawning ~40% of CPU cores as workers via `recluster`.

The single feature module is **`SummaryModule`** (`summary/`):

- **`SummaryController`** — exposes three routes under `/summary`:
  - `GET /summary` (SSE) — streams the generated summary in three event phases: 1) sends `pullRequests` array, 2) streams `content` chunks, 3) sends `done: true`
  - `GET /summary/available_models` — lists models from the configured LLM provider
  - `GET /summary/pull_requests` — returns PRs without generating a summary

- **`GithubService`** — wraps Octokit. Uses GitHub search API to paginate merged PRs matching a filter query (`is:pr author:X is:merged merged:START..END org:ORG`). Concurrently fetches review comments for each PR (concurrency capped at 10 via `p-limit`).

- **`AiSummarizerService`** — wraps the OpenAI-compatible SDK. Two-step pipeline:
  1. **Classify** PRs (non-streaming): sends all PRs to the LLM using `system/classify_prs.njk` + `user/classify_prs.njk` templates; parses JSON response into `LLMClassifiedPullRequest[]` (categories: `performance`, `reliability`, `infrastructure`, `feature`, `integration`, `maintenance`; significance: `high` | `low`).
  2. **Summarize** (streaming): streams the narrative using `system/summarize_prs.njk` + `user/summarize_prs.njk` templates.

- **`PromptService`** (`prompts/prompt.service.ts`) — renders Nunjucks templates from `prompts/system/` and `prompts/user/`. Template names are defined in `config/constants.ts`.

- **`PullRequest`** class (`summary/structures/PullRequest.ts`) — domain model; groups review comments into threaded conversations and labels each message as `Author` or `Reviewer`.

LLM client defaults to Ollama (`http://host.docker.internal:11434/v1`) when `LLM_API_KEY` / `LLM_BASE_URL` are not set.

### Frontend (`frontend/src/`)

React + Vite + TypeScript SPA using Tailwind CSS and shadcn/ui components.

Two routes:

- `/` (`Home`) — landing page with a "Get Started" dialog for entering GitHub username, org, date range, and model selection
- `/summary` (`Summary`) — receives form state via `react-router-dom` location state; opens an `EventSource` to `GET /api/summary?...` and streams content into a Lexical rich-text editor (`ResponseTextArea`)

API base URLs are defined in `frontend/src/lib/constants.ts` (`ApiEndpoints`). In production, nginx proxies `/api/` to the backend, so no cross-origin configuration is needed.

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

| Variable                       | Required | Notes                                                       |
| ------------------------------ | :------: | ----------------------------------------------------------- |
| `GITHUB_PERSONAL_ACCESS_TOKEN` |   Yes    | Classic PAT with `repo` scope; authorize SSO for org access |
| `LLM_API_KEY`                  |    No    | Falls back to Ollama if blank                               |
| `LLM_BASE_URL`                 |    No    | Falls back to `http://host.docker.internal:11434/v1`        |
| `DEVELOPER_ROLE`               |    No    | Injected into the summarization prompt for context          |

## Frontend Coding Conventions

- **Cancelling async operations in `useEffect`**: Use `AbortController` and pass `signal` to `fetch`. Do not use a `cancelled` boolean flag. In the cleanup, call `controller.abort()`. In the catch block, guard with `if (hasRequestAborted) return;` to suppress abort errors.
- **Avoid synchronous `setState` inside `useEffect`**: Calling `setState` synchronously (before any `await` or `setTimeout`) triggers cascading renders. Derive synchronous state with `useMemo` during render instead, and only call `setState` inside async callbacks within effects.

## VS Code Debugging

The dev stack exposes port `9229` for Node.js inspector. Use the **"Debug NestJS app in Docker"** launch configuration to attach.
