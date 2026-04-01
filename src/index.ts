// @ts-ignore
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import Exa from "exa-js";
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from "node:fs";
import { join } from "node:path";

const apiKeyPath = join(process.env.HOME || "", ".pi", "config", "exa-api-key");

function loadApiKey() {
  try {
    return readFileSync(apiKeyPath, "utf-8").trim();
  } catch {
    return undefined;
  }
}

function saveApiKey(key: string) {
  try {
    const configDir = join(process.env.HOME || "", ".pi", "config");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(apiKeyPath, key, "utf-8");
    chmodSync(apiKeyPath, 0o600);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save API key: ${message}`);
  }
}

export default function exaExtension(pi: ExtensionAPI) {
  let apiKey: string | undefined;
  let exaClient: Exa | undefined;

  function initializeClient(key?: string) {
    const keyToUse = key || apiKey;
    if (!keyToUse) {
      exaClient = undefined;
      return false;
    }
    apiKey = keyToUse;
    exaClient = new Exa(apiKey);
    return true;
  }

  pi.on("session_start", async () => {
    const key = loadApiKey();
    if (key) {
      initializeClient(key);
    }
  });

  pi.registerCommand("exa-config", {
    description: "Configure Exa API key",
    handler: async (_args: any, ctx: any) => {
      const key = await ctx.ui.input({
        title: "Exa API Key",
        prompt: "Enter your Exa API key:",
        password: true,
      });

      if (key) {
        try {
          saveApiKey(key);
          initializeClient(key);
          ctx.ui.notify("Exa API key saved to ~/.pi/config/exa-api-key", "success");
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          ctx.ui.notify(`Error: ${msg}`, "error");
        }
      } else {
        ctx.ui.notify("Cancelled", "info");
      }
    },
  });

  pi.registerTool({
    name: "exa_search",
    label: "Exa Search",
    description: "Search the web with optional content retrieval",
    parameters: Type.Object({
      query: Type.String({ description: "Search query" }),
      numResults: Type.Optional(Type.Number({ minimum: 1, maximum: 10 })),
      includeText: Type.Optional(Type.Boolean({ description: "Fetch full article text" })),
      highlights: Type.Optional(Type.Boolean()),
      maxCharacters: Type.Optional(Type.Number({ minimum: 100 })),
      includeDomains: Type.Optional(Type.Array(Type.String())),
      excludeDomains: Type.Optional(Type.Array(Type.String())),
      category: Type.Optional(
        Type.Enum({ company: "company", research_paper: "research paper", news: "news", pdf: "pdf" } as const)
      ),
      searchType: Type.Optional(Type.Enum({ auto: "auto", fast: "fast", deep: "deep" } as const)),
    }),

    async execute(_toolCallId: any, params: any) {
      if (!exaClient) {
        if (!initializeClient()) {
          throw new Error("Exa API key not configured. Use /exa-config command.");
        }
      }

      try {
        let result;
        if (params.includeText) {
          result = await exaClient!.searchAndContents(params.query, {
            numResults: params.numResults || 10,
            text: { maxCharacters: params.maxCharacters || 2000 },
            ...(params.highlights && { highlights: { query: params.query } }),
            includeDomains: params.includeDomains,
            excludeDomains: params.excludeDomains,
            category: params.category,
            type: (params.searchType as "auto" | "fast" | "deep" | undefined) || "auto",
          });
        } else {
          result = await exaClient!.search(params.query, {
            numResults: params.numResults || 10,
            includeDomains: params.includeDomains,
            excludeDomains: params.excludeDomains,
            category: params.category,
            type: (params.searchType as "auto" | "fast" | "deep" | undefined) || "auto",
          });
        }

        const resultsText = result.results
          .map((r: any, i: any) => {
            let text = `${i + 1}. **${r.title || "Untitled"}** - ${r.url}`;
            if (r.author) text += ` (${r.author})`;
            if (r.publishedDate) text += ` [${r.publishedDate}]`;
            if (params.includeText && r.text) {
              text += `\n   ${r.text.substring(0, 300)}...`;
            }
            return text;
          })
          .join("\n\n");

        return {
          content: [{ type: "text", text: resultsText }],
          details: {
            query: params.query,
            resultCount: result.results.length,
            results: result.results.map((r: any) => ({
              title: r.title,
              url: r.url,
              author: r.author,
              publishedDate: r.publishedDate,
              text: r.text,
            })),
          },
        };
      } catch (error) {
        throw new Error(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  pi.registerTool({
    name: "exa_fetch_content",
    label: "Exa Fetch Content",
    description: "Get full text content from specific URLs",
    parameters: Type.Object({
      urls: Type.Array(Type.String()),
      maxCharacters: Type.Optional(Type.Number({ minimum: 100 })),
    }),

    async execute(_toolCallId: any, params: any) {
      if (!exaClient) {
        if (!initializeClient()) {
          throw new Error("Exa API key not configured. Use /exa-config command.");
        }
      }

      try {
        const result = await exaClient!.getContents(params.urls, {
          text: { maxCharacters: params.maxCharacters || 3000 },
        });

        const resultsText = result.results
          .map((r: any, i: any) => {
            let text = `${i + 1}. **${r.title || "Untitled"}** - ${r.url}`;
            if (r.text) {
              text += `\n${r.text}`;
            }
            return text;
          })
          .join("\n\n");

        return {
          content: [{ type: "text", text: resultsText }],
          details: {
            resultCount: result.results.length,
            results: result.results.map((r: any) => ({
              title: r.title,
              url: r.url,
            })),
          },
        };
      } catch (error) {
        throw new Error(`Fetch failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  pi.registerTool({
    name: "exa_find_similar",
    label: "Exa Find Similar",
    description: "Find web pages similar to a given URL",
    parameters: Type.Object({
      url: Type.String(),
      numResults: Type.Optional(Type.Number({ minimum: 1, maximum: 10 })),
      excludeSourceDomain: Type.Optional(Type.Boolean()),
    }),

    async execute(_toolCallId: any, params: any) {
      if (!exaClient) {
        if (!initializeClient()) {
          throw new Error("Exa API key not configured. Use /exa-config command.");
        }
      }

      try {
        const result = await exaClient!.findSimilar(params.url, {
          numResults: params.numResults || 10,
          excludeSourceDomain: params.excludeSourceDomain,
        });

        const resultsText = result.results
          .map((r: any, i: any) => `${i + 1}. **${r.title || "Untitled"}** - ${r.url}`)
          .join("\n");

        return {
          content: [{ type: "text", text: resultsText }],
          details: {
            resultCount: result.results.length,
            results: result.results.map((r) => ({
              title: r.title,
              url: r.url,
            })),
          },
        };
      } catch (error) {
        throw new Error(`Find similar failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });
}
