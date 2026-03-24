# WP Docs Viewer - Implementation Plan

## Overview

A WordPress block plugin to display documentation files from various sources (plugins, themes, WordPress core) with a unified file browser experience.

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

| Component | Path | Description |
|-----------|------|-------------|
| Admin_Page | `inc/class-admin-page.php` | Admin page under Tools menu |
| Markdown_Parser | `inc/class-markdown-parser.php` | Parses MD to HTML using Parsedown |
| docs-viewer block | `src/docs-viewer/` | Block registration and edit.js |

## Issue Order

### Phase 1: Backend Foundation

1. **#2 - File Discovery REST API** → Create `Docs_Finder` class + REST endpoint
2. **#6 - Cache file list** → Add transient caching for file discovery

### Phase 2: Admin Page Integration

3. **#1 - Render block in browser mode** → Update Admin_Page to use block

### Phase 3: Block Enhancements

4. **#3 - File browser UI** → Add browser mode to block's `edit.js`
5. **#4 - Shared preview component** → Enhance Markdown_Parser + shared component
6. **#5 - Mode switching** → Add switch between browser/single file mode, copy shortcode

### Phase 4: Future Enhancements

7. **#7 - Interactivity API** → Refactor block frontend to use Interactivity API

## REST API Design

**Endpoint:** `GET /wp/v2/docs-viewer/files`

**Response:**
```json
{
  "files": [
    {
      "path": "plugins/wp-docs-viewer/docs/LOCAL-DEVELOPMENT.md",
      "source": "wp-docs-viewer",
      "source_type": "plugin",
      "name": "Local Development",
      "url": "/wp-content/plugins/wp-docs-viewer/docs/LOCAL-DEVELOPMENT.md"
    }
  ]
}
```

**Sources:**
- `WP_PLUGIN_DIR/*/docs/*.md`
- `WP_CONTENT_DIR/themes/*/docs/*.md`
- `ABSPATH docs/*.md` (if exists)

## Acceptance Criteria

- [ ] Admins can browse all documentation files from Tools menu
- [ ] Block can be used to embed single documentation files
- [ ] Block can be used in browser mode for full file browsing
- [ ] Markdown files render correctly with code highlighting
- [ ] Copy shortcode functionality works
- [ ] File list is cached for performance
