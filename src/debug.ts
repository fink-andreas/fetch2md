/**
 * Debug utility module for fetch2md MCP server
 *
 * Enable debugging by setting DEBUG environment variable:
 * DEBUG=1 - Basic debug output
 * DEBUG=2 - Verbose debug output
 * DEBUG=3 - All debug output
 */

const DEBUG_LEVEL = parseInt(process.env.DEBUG || "0", 10);

export type DebugLevel = 1 | 2 | 3;

/**
 * Check if debug output is enabled for a given level
 */
export function isDebugEnabled(level: DebugLevel = 1): boolean {
  return DEBUG_LEVEL >= level;
}

/**
 * Output debug message if debug is enabled
 */
export function debug(message: string, level: DebugLevel = 1): void {
  if (isDebugEnabled(level)) {
    const timestamp = new Date().toISOString();
    const prefix = level === 1 ? "[DEBUG]" : level === 2 ? "[VERBOSE]" : "[TRACE]";
    console.error(`${timestamp} ${prefix} ${message}`);
  }
}

/**
 * Log HTTP request details
 */
export function debugRequest(url: string, level: DebugLevel = 2): void {
  if (isDebugEnabled(level)) {
    debug(`Fetching URL: ${url}`, level);
    debug(`User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36`, level);
    debug(`Timeout: 10000ms`, level);
  }
}

/**
 * Log HTTP response details
 */
export function debugResponse(
  url: string,
  status: number,
  contentType: string,
  contentLength: number,
  level: DebugLevel = 2
): void {
  if (isDebugEnabled(level)) {
    debug(`Response received from: ${url}`, level);
    debug(`Status: ${status}`, level);
    debug(`Content-Type: ${contentType}`, level);
    debug(`Content-Length: ${contentLength} bytes`, level);
  }
}

/**
 * Log content type detection
 */
export function debugContentType(contentType: string, isMarkdown: boolean, level: DebugLevel = 1): void {
  if (isDebugEnabled(level)) {
    debug(`Content-Type: ${contentType}`, level);
    debug(`Detected as markdown: ${isMarkdown}`, level);
  }
}

/**
 * Log HTML element selection
 */
export function debugElementSelection(selector: string, found: boolean, level: DebugLevel = 2): void {
  if (isDebugEnabled(level)) {
    debug(`Trying selector: "${selector}" - ${found ? "FOUND" : "not found"}`, level);
  }
}

/**
 * Log URL conversion
 */
export function debugUrlConversion(originalUrl: string, absoluteUrl: string, level: DebugLevel = 3): void {
  if (isDebugEnabled(level)) {
    debug(`URL conversion: "${originalUrl}" -> "${absoluteUrl}"`, level);
  }
}

/**
 * Log markdown conversion result
 */
export function debugMarkdownResult(length: number, level: DebugLevel = 1): void {
  if (isDebugEnabled(level)) {
    debug(`Markdown conversion complete: ${length} characters`, level);
  }
}

/**
 * Log error
 */
export function debugError(error: string, level: DebugLevel = 1): void {
  if (isDebugEnabled(level)) {
    debug(`ERROR: ${error}`, level);
  }
}
