# WP Docs Viewer - Implementation Plan

## Architecture

### Block Modes

| Mode | Condition | Description |
|------|-----------|-------------|
| **Browser Mode** | No `file` attribute | Full sidebar + preview (file browser) |
| **Single File Mode** | `file` attribute set | Shows selected markdown file only |

### Shared Components

```
Block Frontend (Interactivity API)
        ↓
  Shared View Component
        ↓
Admin Page (Tools → WP Docs Viewer)
```

## Existing Code

| Component | Path |
|-----------|------|
| Admin_Page | `inc/class-admin-page.php` |
| Markdown_Parser | `inc/class-markdown-parser.php` |
| Docs_Finder | `inc/class-docs-finder.php` |
| REST_API | `inc/class-rest-api.php` |
| docs-viewer block | `src/docs-viewer/` |

## REST API (Implemented)

**Endpoints:**
- `GET /wp/v2/docs-viewer/files` - Get all docs (grouped by source)
- `GET /wp/v2/docs-viewer/file?path=...` - Get specific file content

Returns all .md files from:
- `WP_PLUGIN_DIR/*/docs/*.md`
- `WP_CONTENT_DIR/themes/*/docs/*.md`
- `ABSPATH docs/*.md` (if exists)

**Note:** REST API is implemented but needs verification. Currently getting 401 errors in local playground.

## Issue Order

### Phase 1: Backend Foundation
1. ~~**#2** - File Discovery REST API~~ ✅ Done
2. **#6** - Cache file list

### Phase 2: Admin Page Integration
3. **#1** - Render block in browser mode

### Phase 3: Block Enhancements
4. **#3** - File browser UI
5. **#4** - Shared preview component
6. **#5** - Mode switching

### Phase 4: Future
7. **#7** - Interactivity API

## Key Context

- Block in browser mode = no `file` attribute set
- Admin page renders block via `do_blocks()`
- Markdown_Parser uses Parsedown library
- File list cached in transients
