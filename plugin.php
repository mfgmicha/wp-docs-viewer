<?php
/**
 * Plugin Name:      Template WP Plugin Blocks
 * Description:      A clean and minimal WordPress Plugin with block.
 * Version:          0.1.0
 * Requires at least: 6.9
 * Requires PHP:     8.3
 * Author:           Micha Krapp
 * License:          GPLv2 or later
 * License URI:      https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     template-wp-plugin-blocks
 *
 * @package TemplateWpPluginBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Register the block.
 */
if ( ! function_exists( 'mfgmicha_block_init' ) ) {

	/**
	 * Initialize blocks.
	 *
	 * @return void
	 */
	function mfgmicha_block_init(): void {
		wp_register_block_types_from_metadata_collection(
			plugin_dir_path( __FILE__ ) . 'build',
			plugin_dir_path( __FILE__ ) . 'build/blocks-manifest.php',
		);
	}
}
add_action( 'init', 'mfgmicha_block_init' );
