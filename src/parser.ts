import axios from "axios";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import https from "https";
import {
  debug,
  debugRequest,
  debugResponse,
  debugContentType,
  debugElementSelection,
  debugUrlConversion,
  debugMarkdownResult,
  debugError,
  isDebugEnabled,
} from "./debug.js";

export async function fetchAndConvert(url: string): Promise<string> {
  debugRequest(url);

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      timeout: 10000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const contentType = response.headers["content-type"] || "";
    const contentLength = typeof response.data === "string" ? response.data.length : 0;

    debugResponse(url, response.status, contentType, contentLength);

    // Check if content is already plain text or markdown
    if (
      contentType.includes("text/plain") ||
      contentType.includes("text/markdown")
    ) {
      debugContentType(contentType, true);
      debugMarkdownResult(response.data.length);
      return response.data;
    }

    // Check if content looks like markdown
    if (
      typeof response.data === "string" &&
      response.data.trim().match(/^#\s/m)
    ) {
      debug("Content detected as markdown (starts with #)", 1);
      debugMarkdownResult(response.data.length);
      return response.data;
    }

    debug("Parsing HTML content...", 1);

  const root = parse(response.data);
  debug("HTML parsed successfully", 2);

  // Try different selectors to find the main content
  const selectors = [
    "#main-col-body",
    "#main-content",
    "article",
    "main",
    ".article",
    ".post",
    ".content",
    "body",
  ];

  let contentElement = null;
  for (const selector of selectors) {
    contentElement = root.querySelector(selector);
    debugElementSelection(selector, contentElement !== null);
    if (contentElement) {
      break;
    }
  }

  const html = contentElement?.innerHTML || "";

  if (!html.trim()) {
    debug("No HTML content found", 1);
    return "";
  }

  debug(`Extracted HTML: ${html.length} characters`, 2);

  const absoluteHtml = convertRelativeUrls(html, url);

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  const markdown = turndown.turndown(absoluteHtml);
  debugMarkdownResult(markdown.length);

  return markdown;
  } catch (error: any) {
    debugError(error.message || String(error));
    throw error;
  }
}

function convertRelativeUrls(html: string, baseUrl: string): string {
  if (!isDebugEnabled(3)) {
    // Quick path without debug output
    const root = parse(html);

    root.querySelectorAll("[src]").forEach((el) => {
      const src = el.getAttribute("src");
      if (src && !src.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
        try {
          el.setAttribute("src", new URL(src, baseUrl).href);
        } catch {}
      }
    });

    root.querySelectorAll("[href]").forEach((el) => {
      const href = el.getAttribute("href");
      if (href && !href.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
        try {
          el.setAttribute("href", new URL(href, baseUrl).href);
        } catch {}
      }
    });

    return root.innerHTML;
  }

  // With debug output
  const root = parse(html);

  let srcCount = 0;
  root.querySelectorAll("[src]").forEach((el) => {
    const src = el.getAttribute("src");
    if (src && !src.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
      try {
        const absoluteUrl = new URL(src, baseUrl).href;
        debugUrlConversion(src, absoluteUrl, 3);
        el.setAttribute("src", absoluteUrl);
        srcCount++;
      } catch (err) {
        debugError(`Failed to convert src URL: ${src}`);
      }
    }
  });

  let hrefCount = 0;
  root.querySelectorAll("[href]").forEach((el) => {
    const href = el.getAttribute("href");
    if (href && !href.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        debugUrlConversion(href, absoluteUrl, 3);
        el.setAttribute("href", absoluteUrl);
        hrefCount++;
      } catch (err) {
        debugError(`Failed to convert href URL: ${href}`);
      }
    }
  });

  if (srcCount > 0 || hrefCount > 0) {
    debug(`Converted ${srcCount} src URLs and ${hrefCount} href URLs`, 2);
  }

  return root.innerHTML;
}
