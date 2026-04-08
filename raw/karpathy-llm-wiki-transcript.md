# Karpathy LLM Wiki — Video Transcript Reference

**Source:** YouTube video transcript provided by Sorina
**Date ingested:** 2026-04-08
**Type:** Reference architecture

## Core idea

Use LLMs to build personal knowledge bases. Instead of fancy RAG with vector databases, just use well-organized markdown files. The LLM maintains indexes, cross-references, and summaries automatically.

## Architecture

```
vault/
├── raw/          # Human-curated source documents (immutable)
├── wiki/         # LLM-generated and maintained knowledge layer
│   ├── index.md  # Master catalog of all pages
│   ├── log.md    # Append-only timeline of changes
│   └── [pages]   # Topic pages with relationships
└── CLAUDE.md     # Configuration and workflow instructions
```

## Three workflows

1. **INGEST** — Read source → extract takeaways → create wiki pages → update index → cross-reference → log
2. **QUERY** — Search index → read pages → synthesize answer → file results back into wiki
3. **LINT** — Find contradictions, stale facts, orphan pages, missing cross-references, research gaps

## Key quotes from transcript

- "I thought I had to reach for fancy RAG. But the LLM has been pretty good about auto-maintaining index files and brief summaries."
- "Your only cost is tokens. No embedding model, no vector database, no chunking pipeline."
- "One user turned 383 scattered files into a compact wiki and dropped token usage by 95%."
- "This is left vague so that you can hack it and customize it to your own project."

## Hot cache concept

Optional `hot.md` file — ~500 words of the most recent/important context. Saves token cost by avoiding full wiki crawls for common queries.

## Scale limits

- Hundreds of pages with good indexes: wiki works fine
- Millions of documents: use traditional RAG pipeline
- Current sweet spot: ~100 articles, ~500K words
