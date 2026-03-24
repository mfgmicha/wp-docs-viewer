<?php
/**
 * Docs Finder class.
 *
 * Scans WordPress installation for documentation files.
 *
 * @package WpDocsViewer
 */

namespace WpDocsViewer;

if ( ! \defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Class Docs_Finder
 *
 * Scans plugins, themes, and WordPress root for .md documentation files.
 */
class Docs_Finder {

	/**
	 * Cache group name.
	 */
	public const string CACHE_GROUP = 'wp_docs_viewer';

	/**
	 * Cache key for file list.
	 */
	public const string CACHE_KEY = 'docs_files';

	/**
	 * Cache expiry in seconds (1 hour).
	 */
	public const int CACHE_EXPIRY = \HOUR_IN_SECONDS;

	/**
	 * Find all documentation files.
	 *
	 * @return array<string, array<int, array{path: string, source: string, source_type: string, name: string, url: string}>> Grouped by source type.
	 */
	public function find_all(): array {
		$files = [
			'plugins'   => [],
			'themes'    => [],
			'wordpress' => [],
		];

		$files['wordpress'] = $this->find_wordpress_docs();
		$files['plugins']   = $this->find_plugin_docs();
		$files['themes']    = $this->find_theme_docs();

		return $files;
	}

	/**
	 * Find docs in WordPress root.
	 *
	 * @return array<int, array{path: string, source: string, source_type: string, name: string, url: string}>
	 */
	public function find_wordpress_docs(): array {
		$docs_path = \ABSPATH . 'docs';

		if ( ! \is_dir( $docs_path ) ) {
			return [];
		}

		return $this->scan_directory(
			$docs_path,
			'docs',
			'wordpress',
			'',
		);
	}

	/**
	 * Find docs in all plugins.
	 *
	 * @return array<int, array{path: string, source: string, source_type: string, name: string, url: string}>
	 */
	public function find_plugin_docs(): array {
		$files   = [];
		$plugins = \get_plugins();

		foreach ( $plugins as $plugin => $data ) {
			$plugin_slug = \dirname( $plugin );
			$plugin_path = \WP_PLUGIN_DIR . '/' . $plugin_slug . '/docs';

			if ( ! \is_dir( $plugin_path ) ) {
				continue;
			}

			$plugin_files = $this->scan_directory(
				$plugin_path,
				$plugin_slug,
				'plugin',
				'plugins/' . $plugin_slug,
			);

			$files = \array_merge( $files, $plugin_files );
		}

		return $files;
	}

	/**
	 * Find docs in all themes.
	 *
	 * @return array<int, array{path: string, source: string, source_type: string, name: string, url: string}>
	 */
	public function find_theme_docs(): array {
		$files  = [];
		$themes = \wp_get_themes();

		foreach ( $themes as $theme ) {
			$theme_slug = $theme->get_stylesheet();
			$theme_path = $theme->get_stylesheet_directory() . '/docs';

			if ( ! \is_dir( $theme_path ) ) {
				continue;
			}

			$theme_files = $this->scan_directory(
				$theme_path,
				$theme_slug,
				'theme',
				'themes/' . $theme_slug,
			);

			$files = \array_merge( $files, $theme_files );
		}

		return $files;
	}

	/**
	 * Scan a directory for .md files.
	 *
	 * @param string $directory     The directory to scan.
	 * @param string $source        The source name (plugin/theme slug).
	 * @param string $source_type   The source type (plugin/theme/wordpress).
	 * @param string $relative_base The relative base path.
	 *
	 * @return array<int, array{path: string, source: string, source_type: string, name: string, url: string}>
	 */
	private function scan_directory( string $directory, string $source, string $source_type, string $relative_base ): array {
		$files = [];

		if ( ! \is_dir( $directory ) || ! \is_readable( $directory ) ) {
			return $files;
		}

		$items = \scandir( $directory );

		if ( $items === false ) {
			return $files;
		}

		foreach ( $items as $item ) {
			if ( $item === '.' || $item === '..' ) {
				continue;
			}

			$full_path = \trailingslashit( $directory ) . $item;

			if ( \is_dir( $full_path ) ) {
				// Recursively scan subdirectories.
				$sub_files = $this->scan_directory(
					$full_path,
					$source,
					$source_type,
					$relative_base,
				);
				$files     = \array_merge( $files, $sub_files );
				continue;
			}

			// Only include .md files.
			if ( \pathinfo( $item, \PATHINFO_EXTENSION ) !== 'md' ) {
				continue;
			}

			$relative_path = ( $relative_base ) ? $relative_base . '/' . $item : $item;
			$name          = \pathinfo( $item, \PATHINFO_FILENAME );
			$url           = $this->get_file_url( $full_path );

			$files[] = [
				'path'        => $relative_path,
				'source'      => $source,
				'source_type' => $source_type,
				'name'        => $name,
				'url'         => $url,
			];
		}

		return $files;
	}

	/**
	 * Get the URL for a file.
	 *
	 * @param string $file_path The file path.
	 *
	 * @return string The URL.
	 */
	private function get_file_url( string $file_path ): string {
		$content_dir = \WP_CONTENT_DIR;
		$relative    = \str_replace( $content_dir, '', $file_path );
		$relative    = \ltrim( $relative, '/' );

		return \content_url( $relative );
	}

	/**
	 * Get all files from cache or fresh scan.
	 *
	 * @param bool $force_refresh Force refresh the cache.
	 *
	 * @return array<string, array<int, array{path: string, source: string, source_type: string, name: string, url: string}>> Grouped by source type.
	 */
	public function get_files( bool $force_refresh = false ): array {
		if ( ! $force_refresh ) {
			$cached = \get_transient( self::CACHE_KEY );
			if ( $cached !== false ) {
				return $cached;
			}
		}

		$files = $this->find_all();

		// Sort files within each group.
		foreach ( $files as $source_type => $group ) {
			\usort(
				$files[ $source_type ],
				static fn( array $a, array $b ) => \strcasecmp( $a['name'], $b['name'] ),
			);
		}

		\set_transient( self::CACHE_KEY, $files, self::CACHE_EXPIRY );

		return $files;
	}

	/**
	 * Clear the cache.
	 *
	 * @return void
	 */
	public static function clear_cache(): void {
		\delete_transient( self::CACHE_KEY );
	}

	/**
	 * Initialize cache invalidation hooks.
	 *
	 * @return void
	 */
	public static function init_hooks(): void {
		// Clear cache on plugin activation/deactivation.
		\add_action( 'activated_plugin', [ self::class, 'clear_cache' ] );
		\add_action( 'deactivated_plugin', [ self::class, 'clear_cache' ] );

		// Clear cache on theme switch.
		\add_action( 'switch_theme', [ self::class, 'clear_cache' ] );

		// Clear cache when a theme is activated (after switch_theme runs).
		\add_action( 'after_switch_theme', [ self::class, 'clear_cache' ] );
	}
}
