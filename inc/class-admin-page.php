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
		\add_action( 'admin_enqueue_scripts', [ self::class, 'enqueue_assets' ] );
	}

	/**
	 * Enqueue block editor assets for the admin page.
	 *
	 * @param string $hook_suffix The current admin page.
	 * @return void
	 */
	public static function enqueue_assets( string $hook_suffix ): void {
		if ( $hook_suffix !== 'tools_page_wp-docs-viewer' ) {
			return;
		}

		$asset_file = include \plugin_dir_path( __FILE__ ) . '../build/docs-viewer/index.asset.php';

		\wp_enqueue_style(
			'wp-docs-viewer-editor',
			\plugin_dir_url( __FILE__ ) . '../build/docs-viewer/index.css',
			[],
			$asset_file['version'],
		);

		\wp_enqueue_script(
			'wp-docs-viewer-editor',
			\plugin_dir_url( __FILE__ ) . '../build/docs-viewer/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true,
		);

		// Enqueue WordPress components styles.
		\wp_enqueue_style( 'wp-components' );
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
		?>
		<div class="wrap">
			<h1><?php \esc_html_e( 'WP Docs Viewer', 'wp-docs-viewer' ); ?></h1>
			<div class="wp-docs-viewer-admin">
				<?php echo \wp_kses_post( \do_blocks( '<!-- wp:mfgmicha/docs-viewer --><!-- /wp:mfgmicha/docs-viewer -->' ) ); ?>
			</div>
		</div>
		<?php
	}
}
