# WP Docs Viewer

A WordPress block plugin to display documentation files from plugins, themes, and WordPress core.

## Test on WordPress Playground

Try the block instantly in your browser without installing WordPress locally:

**[Open in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/wp-docs-viewer/main/.wordpress/blueprint.json)**

## Development

```bash
# Install dependencies
npm install
composer install

# Start development
npm run start

# Build for production
npm run build

# Run tests
npm run test

# Run linters
composer run lint
composer run analyse

# Create plugin zip
npm run zip
```

## Installation

### Manual Installation

1. Download the plugin as a ZIP file
2. Upload to your `wp-content/plugins/` directory
3. Activate the plugin

### Via Composer

You can also install the plugin directly from GitHub using Composer:

```bash
composer require mfgmicha/wp-docs-viewer:dev-main --prefer-dist
```

Or if you want a specific version/tag:

```bash
composer require mfgmicha/wp-docs-viewer:^1.0 --prefer-dist
```

Then move the plugin to your `wp-content/plugins/` directory:

```bash
mv vendor/mfgmicha/wp-docs-viewer wp-content/plugins/
```

Or add this to your `composer.json` to install directly to the correct location:

```json
"repositories": [
    {
        "type": "vcs",
        "url": "https://github.com/mfgmicha/wp-docs-viewer"
    }
],
"require": {
    "mfgmicha/wp-docs-viewer": "^1.0"
},
"extra": {
    "installer-paths": {
        "wp-content/plugins/{$name}/": ["mfgmicha/wp-docs-viewer"]
    }
}
```

With the [Composer Installers](https://github.com/composer/installers) package, the plugin will be automatically installed to the correct location.

**Note:** When installed via Composer, run `composer install` to install the Parsedown dependency. Without Composer, the plugin bundles Parsedown in the `lib/` folder for standalone use.

## License

GPLv2 or later
