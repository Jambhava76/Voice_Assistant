# Deployment Guide

## Local Development

Backend:

```powershell
python -m uvicorn backend.app.main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Docker

```powershell
Copy-Item .env.example .env
docker compose up --build
```

## Kubernetes

1. Build and push images:

```powershell
docker build -f deploy/docker/backend.Dockerfile -t ghcr.io/your-org/jarvis-backend:latest .
docker build -f deploy/docker/frontend.Dockerfile -t ghcr.io/your-org/jarvis-frontend:latest .
docker push ghcr.io/your-org/jarvis-backend:latest
docker push ghcr.io/your-org/jarvis-frontend:latest
```

2. Create secrets:

```powershell
kubectl create secret generic jarvis-backend-secrets --from-env-file=.env
```

3. Apply manifests:

```powershell
kubectl apply -f deploy/kubernetes
```

## AWS

Recommended baseline:

- Backend: ECS Fargate or EKS.
- Frontend: Amplify, S3 plus CloudFront, or Vercel.
- Database: RDS PostgreSQL.
- Cache: ElastiCache Redis.
- Secrets: AWS Secrets Manager.
- Observability: CloudWatch and OpenTelemetry.

## Vercel

Deploy the `frontend` directory. Set:

```text
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain/api/v1
```

## Production Checklist

- Replace demo credentials and JWT secret.
- Use HTTPS everywhere.
- Move persistence from SQLite to PostgreSQL.
- Disable desktop actions in hosted environments.
- Add real identity provider integration.
- Configure structured logs and monitoring.
- Add API rate limiting and audit logs.
