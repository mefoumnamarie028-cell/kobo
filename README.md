# Kobo Frontend

## Structure

- `frontend/` : application React
- `modules/` : modules prototypes
- `infra/k8s/frontend/` : manifests Kubernetes (base + overlays)
- `.github/workflows/` : CI/CD GitHub Actions

## CI/CD

- `frontend-ci.yml`
  - install dependencies
  - build React
- `frontend-cd.yml`
  - build image Docker du front
  - push GHCR
  - deployment Kubernetes sur:
    - `kobo-dev` (branche `module/store` ou manuel `dev`)
    - `kobo-prod` (branche `main` ou manuel `prod`)

## Docker local

```bash
cd frontend
docker build -t kobo-frontend:local .
docker run --rm -p 8085:80 kobo-frontend:local
```

## Secrets GitHub Actions

Configurer `KUBE_CONFIG` dans les environments GitHub:

- `dev`
- `production`

## Hosts ingress a ajuster

Fichiers:

- `infra/k8s/frontend/overlays/dev/patch-ingress.yaml`
- `infra/k8s/frontend/overlays/prod/patch-ingress.yaml`

Remplacer:

- `app-dev.kobo.your-domain.tld`
- `app.kobo.your-domain.tld`
