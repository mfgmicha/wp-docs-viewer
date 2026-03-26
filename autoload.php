<?php
/**
 * Autoloader for the plugin.
 *
 * Handles loading classes both with and without Composer.
 *
 * @package WpDocsViewer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Load Composer autoloader if available.
 *
 * @return bool True if Composer autoloader was loaded, false otherwise.
 */
function wpdocsviewer_load_composer_autoloader(): bool {
	$autoload_path = __DIR__ . '/vendor/autoload.php';

	if ( file_exists( $autoload_path ) ) {
		require_once $autoload_path;
		return true;
	}

	return false;
}

/**
 * Load a class from the inc/ directory.
 *
 * @param string $class The fully qualified class name.
 * @return void
 */
function wpdocsviewer_autoload_class( string $class ): void {
	// Only handle classes in our namespace.
	if ( strpos( $class, 'WpDocsViewer\\' ) !== 0 ) {
		return;
	}

	// Remove namespace prefix.
	$class_without_prefix = substr( $class, strlen( 'WpDocsViewer\\' ) );

	// Convert namespace separators to directory separators.
	$class_path = str_replace( '\\', '/', $class_without_prefix );

	// Try to load the class file.
	$file = __DIR__ . '/inc/' . $class_path . '.php';

	if ( file_exists( $file ) ) {
		require_once $file;
	}
}

/**
 * Load Parsedown class from lib/ directory.
 *
 * @param string $class The fully qualified class name.
 * @return void
 */
function wpdocsviewer_autoload_parsedown( string $class ): void {
	if ( $class !== 'Parsedown' ) {
		return;
	}

	$file = __DIR__ . '/lib/Parsedown.php';

	if ( file_exists( $file ) ) {
		require_once $file;
	}
}

/**
 * Initialize the autoloader.
 *
 * @return void
 */
function wpdocsviewer_autoload(): void {
	// Try Composer autoloader first.
	if ( wpdocsviewer_load_composer_autoloader() ) {
		return;
	}

	// Fall back to custom autoloader.
	spl_autoload_register( 'wpdocsviewer_autoload_class' );
	spl_autoload_register( 'wpdocsviewer_autoload_parsedown' );
}

// Initialize autoloader.
wpdocsviewer_autoload();
