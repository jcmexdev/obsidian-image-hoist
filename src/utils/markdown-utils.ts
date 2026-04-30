/**
 * Extracts the inner content of an image link (Wikilink or Markdown).
 * Example: ![[image.png|100]] -> image.png|100
 * Example: ![alt text](link) -> alt text
 */
export function extractOriginalLink(original: string): string {
	if (original.startsWith("![[")) {
		return original.substring(3, original.length - 2);
	} else if (original.startsWith("![")) {
		const closeBracketIndex = original.indexOf("]");
		if (closeBracketIndex !== -1) {
			return original.substring(2, closeBracketIndex);
		}
	}
	return "";
}

/**
 * Sanitizes a filename for safe URL usage.
 */
export function sanitizeFilename(fileName: string): string {
	return fileName.replace(/\s+/g, "_");
}
