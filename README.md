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
