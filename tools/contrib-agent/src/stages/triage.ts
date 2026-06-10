export interface TriageResult {
  pass: boolean;
  reason?: string;
}

/**
 * v0 stub: always passes. When volume justifies the cost,
 * replace with a Haiku-tier SDK call that does a structural sniff
 * (package.json shape, language mix, presence of an MCP server entrypoint)
 * and rejects obviously-wrong candidates before paying for Sonnet on synthesis.
 */
export async function triage(_repo: string): Promise<TriageResult> {
  return { pass: true };
}
