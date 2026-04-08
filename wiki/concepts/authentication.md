---
title: Authentication
type: concept
sources: [initial-setup-session]
related: [architecture, asana-client, credential-storage, installation-guide]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Authentication

How the Asana connection authenticates with the API.

## Method: Personal Access Token (PAT)

Asana uses Bearer token authentication:

```
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

## Token lookup chain

The [[asana-client]] checks these locations in order:

1. `ASANA_API_KEY` environment variable
2. `.asana-api-key` file in current working directory
3. `.asana-api-key` file in home directory
4. Optional: credential vault (if configured via apiboss path)

First match wins.

## Storage

| Location | Purpose | Gitignored? |
|----------|---------|-------------|
| `.asana-api-key` (project root) | Fast local access | Yes |
| `ASANA_API_KEY` env var | CI/CD or session-based | N/A |

## Generating a new token

1. Go to https://app.asana.com/0/my-apps
2. Developer Console → Personal Access Tokens
3. Create New Token → name it → copy
4. Save to `.asana-api-key` file

## Token format

```
2/{user_gid}/{token_gid}:{secret}
```

## Security notes

- PATs have full access to everything the user can access — treat as a password
- Token never expires unless manually revoked
- `.asana-api-key` is in `.gitignore` — never committed
- **Never hardcode tokens in source code**
