# Template WP Plugin Blocks

A clean and minimal WordPress Plugin with block.

## Test on WordPress Playground

Try the block instantly in your browser without installing WordPress locally:

**[Open in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/template-wp-plugin-blocks/main/.wordpress/blueprint.json)**

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

## Adding New Blocks

This template supports multiple blocks. To add a new block:

```bash
npm run new
```

The terminal will ask you the missing information interactively.

Or you can pass them directly
```bash
--title="Your Block Title"
--textdomain=your-block-slug
...

# Full command example
npm run new -- --title 'Your Block Title' --variant static 'your-block-slug'
```

See all available parameters with `--help`
````
npm run new -- --help
```

Then rename the generated `src/new-block/` folder to match your block slug (e.g., `src/your-block-slug/`), update the block files, and run `npm run build`.

## License

GPLv2 or later

## Using as Template

To create a new WordPress block plugin from this template, see the detailed setup guide in [docs/SETUP.md](docs/SETUP.md).
