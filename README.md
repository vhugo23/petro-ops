# PetroOps

PetroOps is an industrial operations intelligence MVP for Houston-based energy companies.

The system connects OT-style sensor data, AI asset health monitoring, SAP-style maintenance work orders, and commercial operations insights.

This project is being built using a disciplined AI-assisted engineering workflow:
- Plan before coding
- Document architecture
- Use tests before implementation
- Run AI agents inside a controlled environment
- Review every AI-generated change

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and docker-compose — all commands run inside the Docker dev container
- Node 22 + npm (optional, for running outside Docker)

---

## Quick Start

```bash
# First run only — install dependencies
docker compose -f infra/docker-compose.yml run --rm dev npm install

# Start the API (port 3000 forwarded to host)
docker compose -f infra/docker-compose.yml run --rm --service-ports dev npm start
```

Then from your host machine:

```bash
curl http://localhost:3000/assets
```

---

## Install

```bash
docker compose -f infra/docker-compose.yml run --rm dev npm install
```

> Always run inside the Docker dev container — never on the Windows host.

---

## Run Tests

```bash
docker compose -f infra/docker-compose.yml run --rm dev npm test
```

Watch mode (interactive TTY required):

```bash
docker compose -f infra/docker-compose.yml run --rm -it dev npm run test:watch
```

---

## Run the API

```bash
# Default port 3000
docker compose -f infra/docker-compose.yml run --rm --service-ports dev npm start

# Custom port
docker compose -f infra/docker-compose.yml run --rm --service-ports -e PORT=8080 dev npm start
```

The `PORT` variable can also be set in `.env.example` (loaded automatically inside the container).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/assets` | List all monitored assets |
| GET | `/assets/:id/summary` | Full operational summary for one asset |
| GET | `/operations-summary` | Operational summary for all assets |

### Examples

```bash
# List all assets
curl http://localhost:3000/assets

# Get summary for a specific asset
curl http://localhost:3000/assets/asset-1/summary

# Get summary for all assets
curl http://localhost:3000/operations-summary
```

All endpoints return `application/json`. Unknown routes return `404` with an `{ "error": "..." }` body.
