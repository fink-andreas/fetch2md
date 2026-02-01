# fetch2md MCP Server

MCP server that fetches website content and converts it to clean markdown format.

## Installation

```bash
pnpm install
pnpm build
```

## Usage

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "fetch2md": {
      "command": "node",
      "args": ["/path/to/fetch2md/dist/index.js"]
    }
  }
}
```

## Running in Test Mode

The fetch2md MCP server can be run directly from the command line for testing and debugging purposes. This is useful when you want to verify the output without setting up a full MCP client.

### Basic Usage

First, build the project:

```bash
pnpm build
```

Then run the server with a URL and the `--cli` flag:

```bash
pnpm test
```

Or using node directly:

```bash
node dist/index.js <url> --cli
```

Example:

```bash
node dist/index.js https://example.com --cli
```

**Note:** The `--cli` flag is required to prevent interference with MCP stdio communication when the server is used as an MCP server.

### Debug Mode

Enable debug output by setting the `DEBUG` environment variable:

```bash
pnpm test:debug
```

Or with different debug levels:

```bash
# Level 1: Basic debug output
DEBUG=1 node dist/index.js https://example.com --cli

# Level 2: Verbose output (includes HTTP details, selector attempts)
DEBUG=2 node dist/index.js https://example.com --cli

# Level 3: All output (includes URL conversion details)
DEBUG=3 node dist/index.js https://example.com --cli
```

### Debug Output Examples

**Basic Debug (DEBUG=1):**

```
[DEBUG] Running in CLI test mode
[DEBUG] URL: https://example.com
[DEBUG] Content-Type: text/html; charset=UTF-8
[DEBUG] Detected as markdown: false
[DEBUG] Parsing HTML content...
[DEBUG] Trying selector: "#main-col-body" - not found
[DEBUG] Trying selector: "#main-content" - not found
[DEBUG] Trying selector: "article" - not found
[DEBUG] Trying selector: "main" - FOUND
[DEBUG] Markdown conversion complete: 1250 characters
```

**Verbose Debug (DEBUG=2):**

```
[DEBUG] Running in CLI test mode
[DEBUG] URL: https://example.com
[VERBOSE] Fetching URL: https://example.com
[VERBOSE] User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
[VERBOSE] Timeout: 10000ms
[VERBOSE] Response received from: https://example.com
[VERBOSE] Status: 200
[VERBOSE] Content-Type: text/html; charset=UTF-8
[VERBOSE] Content-Length: 5432 bytes
[DEBUG] Content-Type: text/html; charset=UTF-8
[DEBUG] Detected as markdown: false
[DEBUG] Parsing HTML content...
[VERBOSE] HTML parsed successfully
[VERBOSE] Trying selector: "#main-col-body" - not found
[VERBOSE] Trying selector: "#main-content" - not found
[VERBOSE] Trying selector: "article" - not found
[VERBOSE] Trying selector: "main" - FOUND
[VERBOSE] Extracted HTML: 3200 characters
[DEBUG] Markdown conversion complete: 1250 characters
[DEBUG] Conversion completed successfully
```

### Troubleshooting

If you encounter errors:

1. **Invalid URL**: Make sure the URL includes the protocol (e.g., `https://`)
   ```
   Error: Invalid URL provided
   Usage: node dist/index.js <url> --cli
   ```

2. **Network errors**: The server uses a 10-second timeout. Check your network connection and ensure the URL is accessible.

3. **Empty output**: Enable debug mode to see which content selectors are being tried and whether any are found on the target page.

4. **No output in CLI mode**: Make sure to include the `--cli` flag when running directly from the command line. Without it, the server will expect MCP stdio communication.

## Tool

### read_website

Fetches a website and converts its content to markdown. Returns only the page content without metadata.

**Parameters:**

- `url` (string): URL of the website to fetch

**Example:**

```json
{
  "url": "https://example.com/article"
}
```

## Next Steps

- [ ] Make more refined strategies for popular / useful websites
- [ ] Implement a Google Search API to retrieve relevant URLs based on a topic / query
