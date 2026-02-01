#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fetchAndConvert } from "./parser.js";
import { debug, debugError } from "./debug.js";

const server = new McpServer({
  name: "fetch2md-mcp",
  version: "0.1.0",
});

server.registerTool(
  "read_website",
  {
    title: "Read Website",
    description:
      "Fetch a website and convert its content to markdown format with metadata",
    inputSchema: {
      url: z.string().url().describe("URL of the website to fetch and read"),
    },
    outputSchema: {
      markdown: z.string().describe("Main website content in markdown format"),
    },
  },
  async ({ url }) => {
    const markdown = await fetchAndConvert(url);
    const output = { markdown };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  }
);

// Start server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport);

/**
 * CLI Test Mode
 * Usage: node dist/index.js <url> --cli
 *
 * This allows running the fetch2md converter directly from command line
 * for testing purposes.
 *
 * Note: CLI mode requires explicit --cli flag to prevent interference
 * with MCP stdio communication.
 */
const args = process.argv.slice(2).filter(arg => arg !== "--");
const cliIndex = args.indexOf("--cli");
if (cliIndex !== -1 && args.length > 1) {
  // Remove --cli from args and get the URL
  args.splice(cliIndex, 1);
  const url = args[0];

  // Validate URL
  try {
    new URL(url);
  } catch {
    console.error("Error: Invalid URL provided");
    console.error(`Usage: node dist/index.js <url> --cli`);
    console.error(`Example: node dist/index.js https://example.com --cli`);
    process.exit(1);
  }

  debug(`Running in CLI test mode`);
  debug(`URL: ${url}`);

  fetchAndConvert(url)
    .then((markdown) => {
      console.log(markdown);
      debug(`Conversion completed successfully`);
    })
    .catch((error) => {
      debugError(error.message);
      console.error(`Error fetching URL: ${error.message}`);
      process.exit(1);
    });
}
