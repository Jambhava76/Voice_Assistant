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

## Quick Start

1. Copy environment settings:

```powershell
Copy-Item .env.example .env
```

2. Install backend dependencies:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
```

3. Start the backend:

```powershell
python -m uvicorn backend.app.main:app --reload --port 8000
```

4. Install and start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

5. Open the dashboard:

```text
http://localhost:3000
```

Or start the connected backend and frontend together on Windows:

```powershell
.\scripts\start-full-app.ps1
```

Default demo login used by the frontend:

```text
admin@example.com / admin123
```

Change these values in `.env` before any real deployment.

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
