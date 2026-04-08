---
title: Credential Storage
type: entity
sources: [initial-setup-session]
related: [authentication, architecture]
created: 2026-04-08
updated: 2026-04-08
confidence: high
---

# Credential Storage

How API tokens are stored securely.

## Primary: `.asana-api-key` file

A plain text file containing only the Asana PAT. Located in the project root, gitignored.

```bash
# Create it
echo "your_token_here" > .asana-api-key

# Verify it's gitignored
cat .gitignore  # Should contain ".asana-api-key"
```

## Alternative: Environment variable

```bash
export ASANA_API_KEY="your_token_here"
```

Useful for CI/CD or when you don't want a file on disk.

## Optional: Centralized credential vault

If you use a centralized credential management system (like an `apiboss.json` vault), the [[asana-client]] can be extended to read from it as a fallback. See the `getApiKey()` function in `shared/asana-client.ts`.

## Security checklist

- [ ] `.asana-api-key` is in `.gitignore`
- [ ] Token is NOT hardcoded anywhere in source code
- [ ] No GIDs are hardcoded (use env vars or discover at runtime)
- [ ] `.asana-api-key` is NOT in git history (if it was, revoke and regenerate)
