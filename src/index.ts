import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ReadWebsiteTool } from "./tool.js";

const server = new Server({
  name: "fetch2md-mcp",
  version: "0.1.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: ReadWebsiteTool.name,
    description: ReadWebsiteTool.description,
    inputSchema: {
      type: "object",
      properties: ReadWebsiteTool.paramSchema,
      required: ["url"]
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === ReadWebsiteTool.name) {
    return await ReadWebsiteTool.cb(request.params.arguments as { url: string });
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
