<?php
/**
 * Admin page functionality.
 *
 * @package WpDocsViewer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

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
