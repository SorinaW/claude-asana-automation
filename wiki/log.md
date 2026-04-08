# Wiki Evolution Log

## [2026-04-08] ingest | Initial setup session + Karpathy wiki architecture

- **Sources**: Session transcript documenting full Asana connection build; Karpathy LLM Wiki video transcript
- Created wiki structure: `raw/`, `wiki/concepts/`, `wiki/entities/`, `wiki/guides/`, `wiki/sources/`
- Created 10 wiki pages:
  - Guides: installation-guide
  - Concepts: architecture, skills-system, authentication, asana-client, cli-reference, asana-api, validation
  - Entities: credential-storage, n8n-connection, workspace-config
  - Sources: initial-setup-session
- Created hot.md (hot cache for quick context)
- Created index.md (master catalog)
- Updated CLAUDE.md with wiki workflows (ingest, query, lint)
- Cross-references established between all pages via `[[backlinks]]`
