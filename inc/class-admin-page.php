<?php
/**
 * Admin page functionality.
 *
 * @package WpDocsViewer
 */

namespace WpDocsViewer;

if ( ! \defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Class Admin_Page
 *
 * Handles the admin page under Tools menu.
 */
class Admin_Page {

	/**
	 * Initialize the admin page.
	 *
	 * @return void
	 */
	public static function init(): void {
		\add_action( 'admin_menu', [ self::class, 'add_menu_page' ] );
	}

	/**
	 * Add the admin page.
	 *
	 * @return void
	 */
	public static function add_menu_page(): void {
		\add_management_page(
			\__( 'WP Docs Viewer', 'wp-docs-viewer' ),
			\__( 'WP Docs Viewer', 'wp-docs-viewer' ),
			'manage_options',
			'wp-docs-viewer',
			[ self::class, 'render' ],
		);
	}

	/**
	 * Render the admin page.
	 *
	 * @return void
	 */
	public static function render(): void {
		$parser      = new Markdown_Parser();
		$plugin_path = \dirname( __DIR__ ) . '/';
		$html        = $parser->parse( $plugin_path . 'docs', 'setup.md' );
		?>
		<div class="wrap">
			<h1><?php \esc_html_e( 'WP Docs Viewer', 'wp-docs-viewer' ); ?></h1>
			<div class="wp-docs-viewer-content">
				<?php echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		</div>
		<?php
	}
}
