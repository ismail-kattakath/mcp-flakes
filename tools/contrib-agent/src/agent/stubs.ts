import type { FlakeManifest } from './schema.js';

/**
 * Minimal stub generators for the files compose-check.yml and
 * validate-flake.sh require alongside flake.yaml. These are intentionally
 * terse — they exist to make agent PRs pass CI gates. Humans flesh them out
 * during review.
 *
 * Required by compliance-check.yml:
 *   - ATTRIBUTION.md exists
 *   - README.md first 10 lines contain "originally|licensed|packaged" (case-insensitive)
 *   - Dockerfile has org.opencontainers.image.source label  (handled by renaming Dockerfile.generated)
 *   - flake.yaml has compliance block                       (already populated by agent)
 *
 * Required by validate-flake.sh:
 *   - Dockerfile, compose.yaml, README.md, ATTRIBUTION.md all exist
 */

function authorsString(m: FlakeManifest): string {
  return m.compliance.authors.join(', ');
}

export function composeYaml(m: FlakeManifest): string {
  const serviceName = `mcp-${m.name}`;
  const lines: string[] = [
    `services:`,
    `  ${serviceName}:`,
    `    # Prebuilt image (pulled first) - published by CI.`,
    `    image: ghcr.io/mcp-flakes/${m.name}:latest`,
    ``,
    `    # Source-build fallback - used when pull fails.`,
    `    build:`,
    `      context: .`,
    `      dockerfile: Dockerfile`,
    ``,
  ];
  if (m.transport === 'stdio') {
    lines.push(
      `    # stdio transport — no ports exposed.`,
      `    stdin_open: true`,
      `    tty: false`,
    );
  } else {
    // http / sse / websocket — leave ports as a comment for humans to set
    lines.push(
      `    # ${m.transport} transport — set ports as appropriate.`,
      `    # ports:`,
      `    #   - "8080:8080"`,
    );
  }
  return lines.join('\n') + '\n';
}

export function readmeMd(m: FlakeManifest, repoDescription?: string): string {
  // First 3 lines satisfy compliance-check.yml's "originally|licensed|packaged" regex.
  const lines: string[] = [
    `# ${m.name}`,
    ``,
    `> Originally created by ${authorsString(m)} · Licensed under ${m.upstream.license}  `,
    `> Packaged by [mcp-flakes](https://github.com/ismail-kattakath/mcp-flakes)`,
    ``,
  ];
  if (repoDescription) lines.push(`## About`, ``, repoDescription, ``);
  lines.push(
    `## Quick start`,
    ``,
    '```bash',
    `docker run -i --rm ghcr.io/mcp-flakes/${m.name}:latest`,
    '```',
    ``,
  );
  if (m.env && m.env.length) {
    lines.push(`## Environment variables`, ``);
    for (const e of m.env) {
      const flags: string[] = [];
      if (e.required) flags.push('required');
      if (e.secret) flags.push('secret');
      const flagStr = flags.length ? ` _(${flags.join(', ')})_` : '';
      const desc = e.description ?? '';
      lines.push(`- \`${e.name}\`${flagStr} — ${desc}`);
    }
    lines.push(``);
  }
  lines.push(
    `## Tools (${m.tools.length})`,
    ``,
    m.tools.map((t) => `- \`${t}\``).join('\n'),
    ``,
    `## Source & compliance`,
    ``,
    `- **Repository:** ${m.upstream.repo}`,
    `- **Commit:** \`${m.upstream.commit}\``,
    `- **License:** ${m.upstream.license}`,
    `- **Transport:** ${m.transport}`,
    ``,
    `<!-- agent-generated stub. Flesh out before merge. -->`,
  );
  return lines.join('\n') + '\n';
}

export function attributionMd(m: FlakeManifest): string {
  const lines: string[] = [
    `# Attribution`,
    ``,
    `This flake packages the \`${m.name}\` MCP server.`,
    ``,
    `## Original work`,
    `- **Repository:** ${m.upstream.repo}`,
    `- **Commit:** \`${m.upstream.commit}\``,
    `- **Authors:** ${authorsString(m)}`,
    `- **License:** ${m.upstream.license}`,
    `- **Copyright:** ${m.compliance.copyright}`,
    ``,
    `## License compliance`,
    `This flake redistributes the original software under its ${m.upstream.license} terms.`,
    ``,
    `Full license text: ${m.upstream.repo}/blob/${m.upstream.commit}/LICENSE`,
    ``,
    `## Modifications`,
    `This flake adds Docker containerization only. No modifications to the original server code.`,
    ``,
    `<!-- agent-generated stub. Verify accuracy before merge. -->`,
  ];
  return lines.join('\n') + '\n';
}
