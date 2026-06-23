$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendPython = Join-Path $root ".venv\Scripts\python.exe"

if (-not (Test-Path $backendPython)) {
  Write-Host "Creating backend virtual environment..."
  python -m venv (Join-Path $root ".venv")
  & $backendPython -m pip install -r (Join-Path $root "requirements-dev.txt")
}

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$root'; & '$backendPython' -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$root\frontend'; npm run dev"
)

Write-Host "Backend:  http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:3000"
