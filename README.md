# Jarvis Enterprise AI Voice Assistant

Jarvis is a production-ready AI Voice Assistant platform with a clean Python backend, modular AI engine, and a futuristic Next.js dashboard. It upgrades the original desktop voice assistant into a scalable portfolio project with enterprise architecture, authentication, command memory, analytics, workflow automation, plugin support, and deployment assets.

## Highlights

- FastAPI backend with controllers, services, repositories, security, configuration, and structured exceptions.
- AI engine modules for speech recognition, text-to-speech, NLP, intent detection, command execution, context memory, workflows, and plugins.
- Next.js, React, TypeScript, Tailwind CSS, ShadCN-compatible UI, Framer Motion, Three.js, GSAP, Zustand, and React Query frontend.
- Interactive AI voice orb, particle field, waveform visualizer, command console, status dashboard, preferences, notifications, analytics, and recommendations.
- JWT authentication, role-based authorization, SQLite persistence, environment-driven configuration, Docker, Kubernetes, GitHub Actions, Vercel-ready frontend, and AWS-friendly containers.

## Architecture

```text
Voice_Assistant/
├── backend/
│   └── app/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── repositories/
│       ├── utilities/
│       ├── configurations/
│       └── security/
├── ai_engine/
│   ├── speech_recognition/
│   ├── text_to_speech/
│   ├── nlp/
│   ├── intent_detection/
│   ├── command_execution/
│   ├── context_management/
│   └── plugins/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── assets/
│   ├── lib/
│   └── types/
├── deploy/
│   ├── docker/
│   └── kubernetes/
├── docs/
├── scripts/
└── tests/
```

## Quick Start For Windows

Use **PowerShell** or **Command Prompt**. The backend and frontend are two separate servers, so keep two terminals open.

### 1. Open the Project Folder

If you are using **Command Prompt**, use `/d` so Windows actually switches from `C:` to `D:`.

```cmd
cd /d D:\Projects\Voice_Assistant
```

If you are using **PowerShell**, this also works:

```powershell
Set-Location -LiteralPath D:\Projects\Voice_Assistant
```

### 2. Create Environment File

Run this once:

```powershell
Copy-Item .env.example .env
```

The default demo login is:

```text
admin@example.com / admin123
```

### 3. Install Backend Dependencies

Run this once from the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
```

### 4. Install Frontend Dependencies

Run this once:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" install
```

If that path does not exist, install Node.js from:

```text
https://nodejs.org
```

## How To Run The Full Web Application

### Terminal 1: Start Backend

Open the first terminal:

```powershell
cd /d D:\Projects\Voice_Assistant
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Keep this terminal open.

Backend health check:

```text
http://localhost:8000/api/v1/health
```

Backend API docs:

```text
http://localhost:8000/docs
```

### Terminal 2: Start Frontend

Open a second terminal:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run start -- -p 3000
```

Keep this terminal open.

Open the app:

```text
http://localhost:3000
```

## Development Mode

Use this when actively changing frontend code:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Then open:

```text
http://localhost:3000
```

If dev mode hangs or shows no output, use the production run commands:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run start -- -p 3000
```

## LAN / Mobile Testing

The frontend also prints a Network URL like:

```text
http://192.168.1.183:3000
```

Open that URL on another device connected to the same Wi-Fi.

The frontend automatically connects to the backend on the same host:

```text
http://192.168.1.183:8000/api/v1
```

Make sure the backend was started with:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

## Common Windows Problems

### Problem: Windows Shows "Select an app to open 'npm'"

This means Windows is trying to open `npm` like a file instead of running the npm command.

Use `npm.cmd` explicitly:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run start -- -p 3000
```

Do not type two commands together like this:

```text
npm run start -- -p 3000npm run build
```

Run commands one line at a time.

### Problem: npm Looks For `C:\Windows\System32\package.json`

You are still in `C:\Windows\System32`.

Use:

```cmd
cd /d D:\Projects\Voice_Assistant\frontend
```

Your prompt should become:

```text
D:\Projects\Voice_Assistant\frontend>
```

### Problem: `localhost:3000` Shows Nothing

Check if the frontend server is running:

```text
http://localhost:3000
```

If it does not open, start frontend again:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run start -- -p 3000
```

### Problem: Frontend Says Backend Offline

Check backend:

```text
http://localhost:8000/api/v1/health
```

If it fails, start backend:

```powershell
cd /d D:\Projects\Voice_Assistant
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

### Problem: Port Already In Use

Stop existing processes or use another frontend port:

```powershell
cd /d D:\Projects\Voice_Assistant\frontend
& "C:\Program Files\nodejs\npm.cmd" run start -- -p 3001
```

Then open:

```text
http://localhost:3001
```

## Database

The app uses SQLite by default.

Database file:

```text
D:\Projects\Voice_Assistant\data\voice_assistant.db
```

It stores:

- Users
- JWT login user seed
- Command history
- User preferences
- Voice/theme/settings

The database is created automatically when the backend starts.

## Running the Desktop Assistant

The legacy entry points now launch the refactored assistant runtime:

```powershell
python Jarvis.py
```

If speech libraries or microphone support are not available, the assistant falls back to typed commands.

## Backend API

Interactive OpenAPI docs are available after starting the backend:

```text
http://localhost:8000/docs
```

Primary endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/login` | Demo JWT login |
| GET | `/api/v1/auth/me` | Current user |
| GET | `/api/v1/assistant/status` | Assistant runtime status |
| POST | `/api/v1/assistant/commands` | Execute a text or voice command |
| GET | `/api/v1/assistant/commands/history` | Command history |
| GET | `/api/v1/dashboard/overview` | Dashboard analytics and activity |
| GET | `/api/v1/dashboard/preferences` | User preferences |
| PUT | `/api/v1/dashboard/preferences` | Save user preferences |

## Example Commands

```text
open youtube
search for python tutorial
wikipedia artificial intelligence
tell me the time
system status
run workflow automation
recommend a shortcut
```

## Deployment

Docker Compose:

```powershell
docker compose up --build
```

Kubernetes manifests are in `deploy/kubernetes`. Frontend deployment to Vercel only needs the `frontend` directory and `NEXT_PUBLIC_API_BASE_URL`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Design](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)

## Security Notes

- Replace `JWT_SECRET`, `DEFAULT_USER_PASSWORD`, and SMTP values before deployment.
- Keep `ENABLE_DESKTOP_ACTIONS=false` in server environments.
- Add a managed identity provider for production users.
- Move SQLite to PostgreSQL before multi-instance production traffic.

## Author

Buchigalla Jambavadattudu

- GitHub: [https://github.com/Jambhava76](https://github.com/Jambhava76)
- LinkedIn: [www.linkedin.com/in/buchigalla-jambavadattudu](http://www.linkedin.com/in/buchigalla-jambavadattudu)
- Email: [jambhava76@gmail.com](mailto:jambhava76@gmail.com)
