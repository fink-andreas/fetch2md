import { fetchAndConvert } from "./parser.js";

export const ReadWebsiteTool = {
  name: "read_website",
  description:
    "Fetch a website and convert its content to markdown format with metadata",
  paramSchema: {
    url: {
      type: "string",
      description: "URL of the website to fetch and convert to markdown",
    },
  },
  cb: async (args: { url: string }) => {
    try {
      const markdown = await fetchAndConvert(args.url);
      return {
        content: [{ type: "text", text: markdown }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
