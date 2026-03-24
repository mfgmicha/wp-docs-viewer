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
