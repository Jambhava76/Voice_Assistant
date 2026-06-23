$ErrorActionPreference = "Stop"
python -m ruff check .
python -m pytest
Set-Location frontend
npm run typecheck
npm run lint
