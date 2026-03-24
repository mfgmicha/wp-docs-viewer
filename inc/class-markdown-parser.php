<?php
/**
 * Markdown parser class.
 *
 * @package WpDocsViewer
 */

namespace WpDocsViewer;

if ( ! \defined( 'ABSPATH' ) ) {
	exit();
}

use Parsedown;

/**
 * Class Markdown_Parser
 *
 * Parses markdown files to HTML.
 */
class Markdown_Parser {

	/**
	 * Parsedown instance.
	 *
	 * @var Parsedown
	 */
	private Parsedown $parsedown;

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->parsedown = new Parsedown();
	}

	/**
	 * Parse a markdown file to HTML.
	 *
	 * @param string $file_path The file path.
	 * @param string $file_name The file name.
	 *
	 * @return string The HTML output.
	 */
	public function parse_to_html( string $file_path, string $file_name ): string {
		$full_path = \trailingslashit( $file_path ) . $file_name;

		if ( ! \file_exists( $full_path ) ) {
			return '<p>File not found: ' . \esc_html( $full_path ) . '</p>';
		}

		$content = \file_get_contents( $full_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		if ( false === $content ) {
			return '<p>Could not read file: ' . \esc_html( $full_path ) . '</p>';
		}

		return $this->parsedown->text( $content );
	}
}
