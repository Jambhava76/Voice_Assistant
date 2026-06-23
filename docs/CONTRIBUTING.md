# Contributing

## Development Standards

- Keep controller logic thin.
- Put business use cases in services.
- Depend on repository interfaces instead of concrete persistence when possible.
- Keep AI provider integrations behind adapters.
- Add tests when changing command behavior, security, persistence, or public API contracts.

## Backend Checks

```powershell
python -m ruff check .
python -m pytest
```

## Frontend Checks

```powershell
cd frontend
npm run typecheck
npm run build
```

## Branch and PR Guidance

- Use small, focused commits.
- Document API changes in `docs/API.md`.
- Update diagrams when changing architecture boundaries.
- Include screenshots for major UI changes.
