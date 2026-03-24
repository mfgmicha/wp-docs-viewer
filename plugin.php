<?php
/**
 * Plugin Name:       WP Docs Viewer
 * Description:       A WordPress block plugin to display documentation files.
 * Version:           0.1.0
 * Requires at least: 6.9
 * Requires PHP:      8.3
 * Author:            Micha Krapp
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-docs-viewer
 *
 * @package WpDocsViewer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Register the block.
 */
if ( ! function_exists( 'wpdocsviewer_block_init' ) ) {

	/**
	 * Initialize blocks.
	 *
	 * @return void
	 */
	function wpdocsviewer_block_init(): void {
		wp_register_block_types_from_metadata_collection(
			plugin_dir_path( __FILE__ ) . 'build',
			plugin_dir_path( __FILE__ ) . 'build/blocks-manifest.php',
		);
	}
}
add_action( 'init', 'wpdocsviewer_block_init' );

/**
 * Add admin subpage under Tools menu.
 */
if ( ! function_exists( 'wpdocsviewer_add_tools_page' ) ) {

	/**
	 * Add the admin page.
	 *
	 * @return void
	 */
	function wpdocsviewer_add_tools_page(): void {
		add_management_page(
			__( 'WP Docs Viewer', 'wp-docs-viewer' ),
			__( 'WP Docs Viewer', 'wp-docs-viewer' ),
			'manage_options',
			'wp-docs-viewer',
			'wpdocsviewer_render_tools_page',
		);
	}
}
add_action( 'admin_menu', 'wpdocsviewer_add_tools_page' );

/**
 * Render the admin page content.
 *
 * @return void
 */
if ( ! function_exists( 'wpdocsviewer_render_tools_page' ) ) {

	/**
	 * Render the tools page.
	 *
	 * @return void
	 */
	function wpdocsviewer_render_tools_page(): void {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'WP Docs Viewer', 'wp-docs-viewer' ); ?></h1>
			<p><?php esc_html_e( 'Welcome to WP Docs Viewer! This plugin helps you display documentation files.', 'wp-docs-viewer' ); ?></p>
		</div>
		<?php
	}
}
