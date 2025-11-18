import axios from "axios";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

export async function fetchAndConvert(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    },
    timeout: 10000
  });

  const contentType = response.headers['content-type'] || '';
  
  if (contentType.includes('text/plain') || contentType.includes('text/markdown')) {
    return response.data;
  }

  if (typeof response.data === 'string' && response.data.trim().match(/^#\s/m)) {
    return response.data;
  }

  const root = parse(response.data);
  
  const contentElement = root.querySelector("#main-col-body") ||
    root.querySelector("#main-content") ||
    root.querySelector("article") || 
    root.querySelector("main") || 
    root.querySelector(".article") || 
    root.querySelector(".post") || 
    root.querySelector(".content") || 
    root.querySelector("body");

  const html = contentElement?.innerHTML || "";
  
  if (!html.trim()) {
    return "";
  }
  
  const absoluteHtml = convertRelativeUrls(html, url);
  
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced"
  });

  return turndown.turndown(absoluteHtml);
}

function convertRelativeUrls(html: string, baseUrl: string): string {
  const root = parse(html);
  
  root.querySelectorAll('[src]').forEach(el => {
    const src = el.getAttribute('src');
    if (src && !src.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
      try {
        el.setAttribute('src', new URL(src, baseUrl).href);
      } catch {}
    }
  });

  root.querySelectorAll('[href]').forEach(el => {
    const href = el.getAttribute('href');
    if (href && !href.match(/^(https?:\/\/|\/\/|data:|mailto:|tel:|#)/i)) {
      try {
        el.setAttribute('href', new URL(href, baseUrl).href);
      } catch {}
    }
  });

  return root.innerHTML;
}
