# Creating a New Plugin from This Template

This guide walks you through creating a new WordPress block plugin from this template.

## Quick Start

1. Create a new repository using this template
2. Clone your new repository
3. Run `npm install`
4. Search and replace placeholders (see below)
5. Run `npm run build`
6. Test in WordPress

## Placeholder Values

Search and replace these placeholders in your new plugin:

| Placeholder | Example Value | Description |
|-------------|---------------|-------------|
| `template-wp-plugin-blocks` | `my-awesome-blocks` | Package name (kebab-case) |
| `Template WP Plugin Blocks` | `My Awesome Blocks` | Plugin display name |
| `example-dynamic` | `awesome-block` | Block folder name (kebab-case) |
| `mfgmicha_` | `myprefix_` | PHP function prefix |
| `TemplateWpPluginBlocks` | `MyAwesomeBlocks` | PHP package name |

## Files to Update

### package.json

Update these fields:
- `name` - Package name (e.g., `my-awesome-blocks`)
- `author` - Your name
- `description` - Plugin description

### plugin.php

Update the plugin header:
- Plugin Name
- Description
- Version
- Author
- Text Domain

Update PHP code:
- Function prefix (e.g., change `mfgmicha_block_init` to `myprefix_block_init`)
- Package name in `@package` declaration

### src/example-dynamic/

1. Rename the folder to your block name (e.g., `src/awesome-block/`)
2. Update `block.json`:
   - `name` - Block name (e.g., `my-awesome-blocks/awesome-block`)
   - `title` - Block title
   - `description` - Block description
3. Update `index.js` - Update block registration if needed

### .wordpress/blueprint.json

Update the `plugins` section with the correct plugin ZIP URL. You'll need to upload your built plugin to get the URL, or use a local path for testing.

### AGENTS.md

Update the AGENTS.md file with your plugin-specific information:
- Update the development commands if they differ from the template
- Update the project structure if you renamed blocks
- Update template placeholders section if needed

This file provides instructions for AI agents working on your plugin.

## Step-by-Step Setup

### 1. Create Repository

Use GitHub's template feature:
```
https://github.com/new?template_name=template-wp-plugin-blocks&template_owner=mfgmicha
```

### 2. Clone and Install

```bash
git clone https://github.com/your-username/your-plugin-name.git
cd your-plugin-name
npm install
composer install
```

### 3. Update Placeholders

Run a global search and replace in your editor for all placeholder values.

### 4. Update AGENTS.md

Review and update AGENTS.md with your plugin-specific information (see Files to Update section).

### 5. Build and Verify

```bash
npm run build
```

This creates the `build/` folder with compiled assets and `build/blocks-manifest.php`.

> **Note:** The pre-push hook automatically runs `npm run build`, format, linting, and static analysis before pushing. Use `git push --no-verify` to bypass if needed.

### 5. Test in WordPress

Option A - Use WordPress Playground:
```bash
npx @wp-playground/cli serve --blueprint .wordpress/blueprint.json
```

Option B - Zip and install locally:
```bash
npm run plugin-zip
```
Then upload the generated ZIP to your WordPress site.

## Adding Multiple Blocks

This template supports multiple blocks. To add a new block:

1. Run the scaffolding command:
   ```bash
   npm run new -- --slug=your-block-slug --title="Your Block Title"
   ```
   This uses `@wordpress/create-block` to scaffold a new block.

2. Rename the generated `src/new-block/` folder to match your block slug (without the namespace prefix).
   For example, if your block is `mfgmicha/my-awesome-block`, rename the folder to `src/my-awesome-block/`.

3. Update the generated files with your block's functionality
4. Run `npm run build` - the build script automatically discovers all blocks

## Verification Checklist

After setup, verify everything works:

- [ ] `npm run build` completes without errors
- [ ] `build/blocks-manifest.php` is generated
- [ ] All placeholder values are replaced
- [ ] AGENTS.md is updated with plugin-specific information
- [ ] `composer run lint` passes without errors
- [ ] `composer run analyse` passes without errors
- [ ] `npm run test` passes
- [ ] Block appears in WordPress block inserter
- [ ] Block saves and renders correctly

## Common Issues

### Block not appearing

- Ensure `npm run build` ran successfully
- Check browser console for JavaScript errors
- Verify `blocks-manifest.php` exists in `build/`

### Build errors

- Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires >= 20.0.0)

### PHP errors

- Ensure WordPress version >= 6.9
- Ensure PHP version >= 8.3
- Check that plugin is activated
