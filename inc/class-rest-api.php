<?php
/**
 * REST API functionality.
 *
 * @package WpDocsViewer
 */

namespace WpDocsViewer;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

if ( ! \defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Class REST_API
 *
 * Handles REST API endpoints.
 */
class REST_API {

	/**
	 * Namespace for the API.
	 */
	public const string NAMESPACE = 'wp/v2/docs-viewer';

	/**
	 * Initialize the REST API.
	 *
	 * @return void
	 */
	public static function init(): void {
		\add_action( 'rest_api_init', [ self::class, 'register_routes' ] );
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public static function register_routes(): void {
		\register_rest_route(
			self::NAMESPACE,
			'/files',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ self::class, 'get_files' ],
					'permission_callback' => [ self::class, 'check_permission' ],
					'args'                => [
						'refresh' => [
							'description' => 'Force refresh the cache.',
							'type'        => 'boolean',
							'default'     => false,
						],
					],
				],
			],
		);

		\register_rest_route(
			self::NAMESPACE,
			'/file',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ self::class, 'get_file_content' ],
					'permission_callback' => [ self::class, 'check_permission' ],
					'args'                => [
						'path' => [
							'description' => 'The file path.',
							'type'        => 'string',
							'required'    => true,
						],
					],
				],
			],
		);
	}

	/**
	 * Check permission for the request.
	 *
	 * @return bool True if permitted, false otherwise.
	 */
	public static function check_permission(): bool {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Get all documentation files.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public static function get_files( WP_REST_Request $request ): WP_REST_Response {
		$force_refresh = (bool) $request->get_param( 'refresh' );

		$finder = new Docs_Finder();
		$files  = $finder->get_files( $force_refresh );

		return new WP_REST_Response(
			[
				'files' => $files,
			],
			200,
		);
	}

	/**
	 * Get the content of a specific file.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response|WP_Error The response object or error.
	 */
	public static function get_file_content( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$path = $request->get_param( 'path' );

		if ( empty( $path ) ) {
			return new WP_Error(
				'missing_path',
				\__( 'File path is required.', 'wp-docs-viewer' ),
				[ 'status' => 400 ],
			);
		}

		$file_path = self::resolve_file_path( $path );

		if ( $file_path === null ) {
			return new WP_Error(
				'file_not_found',
				\__( 'File not found.', 'wp-docs-viewer' ),
				[ 'status' => 404 ],
			);
		}

		$parser = new Markdown_Parser();
		$html   = $parser->parse_from_path( $file_path );

		return new WP_REST_Response(
			[
				'path'    => $path,
				'content' => $html,
			],
			200,
		);
	}

	/**
	 * Resolve a file path from the API path.
	 *
	 * @param string $path The API path (e.g., "plugins/my-plugin/docs/file.md").
	 *
	 * @return string|null The full file path or null if not found.
	 */
	private static function resolve_file_path( string $path ): ?string {
		$parts = \explode( '/', $path, 3 );

		if ( \count( $parts ) < 3 ) {
			return null;
		}

		$type     = $parts[0];
		$slug     = $parts[1];
		$filename = $parts[2];

		switch ( $type ) {
			case 'plugins':
				$base_path = \WP_PLUGIN_DIR . '/' . $slug . '/docs';
				break;

			case 'themes':
				$theme = \wp_get_theme( $slug );
				if ( ! $theme->exists() ) {
					return null;
				}
				$base_path = $theme->get_stylesheet_directory() . '/docs';
				break;

			case 'wordpress':
				$base_path = \ABSPATH . 'docs';
				break;

			default:
				return null;
		}

		$file_path = \trailingslashit( $base_path ) . $filename;

		if ( ! \file_exists( $file_path ) ) {
			return null;
		}

		return $file_path;
	}
}
