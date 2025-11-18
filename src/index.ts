#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fetchAndConvert } from "./parser.js";

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
