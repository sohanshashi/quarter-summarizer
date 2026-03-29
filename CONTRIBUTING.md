# Contributing to Quarter Summarizer

Thanks for your interest in contributing! This guide walks you through the process.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally

```bash
git clone https://github.com/<your-username>/quarter-summarizer.git
cd quarter-summarizer
```

3. **Set up** the development environment by following the [Development](README.md#development) section in the README

## Making Changes

1. Create a new branch off `main`

```bash
git checkout -b your-branch-name
```

2. Make your changes — keep commits focused and atomic
3. Make sure linting passes for both frontend and backend

```bash
# Frontend
npm run lint --prefix frontend

# Backend
npm run lint --prefix backend
```

4. Test your changes locally using the dev Docker Compose stack

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Submitting a Pull Request

1. Push your branch to your fork

```bash
git push origin your-branch-name
```

2. Open a **Pull Request** against `main` on the upstream repository
3. Fill in a clear title and description of what your changes do and why
4. Wait for a review — we may suggest changes or improvements before merging

## Guidelines

- **Keep PRs small and focused.** One feature or fix per PR makes review faster and history cleaner.
- **Follow existing code style.** The project uses ESLint and Prettier — let the tooling do the formatting for you.
- **Write meaningful commit messages.** Describe *what* changed and *why*, not just *how*.
- **Don't include unrelated changes.** Refactors, dependency bumps, or formatting fixes should be separate PRs.

## Reporting Issues

Found a bug or have a feature request? [Open an issue](../../issues) with a clear description and steps to reproduce (if applicable).
