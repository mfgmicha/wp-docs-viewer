# Local Development

## Prerequisites

- Node.js >= 20.0.0
- npm >= 8.0.0
- PHP >= 8.3
- Composer

## Setup

```bash
# Install dependencies
npm install
composer install
```

## Development Commands

- `npm run start` - Start development server (WordPress Playground)
- `npm run build` - Build for production
- `npm run test` - Run Playwright tests
- `npm run lint:js` - Lint JavaScript
- `npm run lint:css` - Lint CSS
- `npm run format` - Format code (Prettier)
- `npm run zip` - Create plugin zip
- `composer run lint` - Lint PHP (PHPCS with WordPress Coding Standards)
- `composer run lint:fix` - Fix PHP linting issues
- `composer run analyse` - Run static analysis (PHPStan)

## Testing

Try the block instantly in your browser without installing WordPress locally:

**[Open in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/wp-docs-viewer/main/.wordpress/blueprint.json)**

## Adding New Blocks

This template supports multiple blocks. To add a new block:

```bash
npm run new
```

Or pass parameters directly:

```bash
npm run new -- --title 'Your Block Title' --variant static 'your-block-slug'
```

See all available parameters with `--help`:

```bash
npm run new -- --help
```

Then rename the generated `src/new-block/` folder to match your block slug (e.g., `src/your-block-slug/`), update the block files, and run `npm run build`.
