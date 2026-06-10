import type { Candidate, Source } from './index.js';
import { parseGithubRepo } from './index.js';

const README_URL =
  'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md';

const NAME = 'awesome-mcp';

// Repos that show up in awesome lists but are not MCP servers themselves.
const DENYLIST = new Set([
  'punkpeye/awesome-mcp-servers',
  'modelcontextprotocol/modelcontextprotocol',
  'modelcontextprotocol/specification',
]);

export const awesomeMcp: Source = {
  name: NAME,
  async fetch(): Promise<Candidate[]> {
    const res = await fetch(README_URL);
    if (!res.ok) {
      throw new Error(`fetch ${README_URL} failed: ${res.status}`);
    }
    const md = await res.text();
    const out = new Map<string, Candidate>();
    const re = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g;
    for (const match of md.matchAll(re)) {
      const url = match[0].replace(/[)\].,]+$/, '');
      const parsed = parseGithubRepo(url);
      if (!parsed) continue;
      if (DENYLIST.has(parsed.id)) continue;
      // Crude image/badge filter
      if (/\.(png|svg|jpg|gif)$/i.test(parsed.repo)) continue;
      out.set(parsed.id, { ...parsed, source: NAME });
    }
    return [...out.values()];
  },
};
