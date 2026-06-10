import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { log } from '../lib/log.js';

const execFileP = promisify(execFile);

export type BuildPattern =
  | 'monorepo'
  | 'single-ts'
  | 'single-js'
  | 'npm-package'
  | 'python-source'
  | 'python-pypi'
  | 'python-uv'
  | 'no-build'
  | 'unknown';

export type Runner = 'node' | 'python' | 'node-python' | 'playwright' | 'go' | 'rust';

export type Transport = 'stdio' | 'http' | 'sse' | 'websocket';

export interface EnvVar {
  name: string;
  required?: boolean;
  secret?: boolean;
  description?: string;
  default?: string;
}

export interface AnalysisResult {
  workdir: string;
  commitSha: string;
  runner: Runner;
  buildPattern: BuildPattern;
  transport: Transport;
  license: string;
  authors: string[];
  copyright: string;
  tools: string[];
  envVars: EnvVar[];
  entrypoint: string[];
  installCommand: string | null;
  buildCommand: string | null;
  lockfile: string | null;
  packageName?: string;
  packageVersion?: string;
  publishImage: boolean;
  confidence: {
    tools: 'high' | 'low' | 'none';
    envVars: 'high' | 'low' | 'none';
    entrypoint: 'high' | 'low' | 'none';
  };
}

const SECRET_PATTERNS = /key|token|secret|password|credential|auth/i;

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readFileOr(p: string, fallback = ''): Promise<string> {
  try {
    return await fs.readFile(p, 'utf8');
  } catch {
    return fallback;
  }
}

async function exec(cmd: string, args: string[], cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileP(cmd, args, { cwd, timeout: 30_000 });
    return stdout.trim();
  } catch {
    return '';
  }
}

async function grepRecursive(dir: string, pattern: string, maxResults = 200): Promise<string[]> {
  try {
    const { stdout } = await execFileP(
      'grep',
      ['-rn', '--include=*.ts', '--include=*.js', '--include=*.py', '--include=*.go', '-E', pattern, '.'],
      { cwd: dir, timeout: 15_000, maxBuffer: 1024 * 1024 },
    );
    return stdout.split('\n').filter(Boolean).slice(0, maxResults);
  } catch {
    return [];
  }
}

export async function analyze(
  repo: string,
  subpath?: string,
): Promise<AnalysisResult> {
  const workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'analyze-'));
  try {
    await execFileP('git', ['clone', '--depth', '50', repo, workdir], { timeout: 60_000 });
  } catch (e) {
    throw new Error(`clone failed: ${(e as Error).message}`);
  }

  const root = subpath ? path.join(workdir, subpath) : workdir;

  const commitSha = await resolveCommitSha(workdir);
  const { runner, buildPattern, entrypoint, installCommand, buildCommand, lockfile, packageName, packageVersion } =
    await detectBuildInfo(root, workdir, subpath);
  const transport = await detectTransport(root);
  const { license, authors, copyright, publishImage } = await detectLicense(workdir);
  const tools = await detectTools(root);
  const envVars = await detectEnvVars(root);

  const toolConfidence = tools.length > 0 ? 'high' : 'none';
  const envConfidence = envVars.length > 0 ? 'high' : 'none';
  const entrypointConfidence = entrypoint.length > 0 ? 'high' : 'none';

  log.info('analyze.done', {
    runner,
    buildPattern,
    transport,
    license,
    toolCount: tools.length,
    envCount: envVars.length,
    toolConfidence,
    entrypointConfidence,
  });

  return {
    workdir,
    commitSha,
    runner,
    buildPattern,
    transport,
    license,
    authors,
    copyright,
    tools,
    envVars,
    entrypoint,
    installCommand,
    buildCommand,
    lockfile,
    packageName,
    packageVersion,
    publishImage,
    confidence: {
      tools: toolConfidence,
      envVars: envConfidence,
      entrypoint: entrypointConfidence,
    },
  };
}

async function resolveCommitSha(workdir: string): Promise<string> {
  const sha = await exec('git', ['log', '-1', '--format=%H'], workdir);
  if (!/^[a-f0-9]{40}$/.test(sha)) {
    throw new Error(`failed to resolve commit SHA: ${sha}`);
  }
  return sha;
}

interface BuildInfo {
  runner: Runner;
  buildPattern: BuildPattern;
  entrypoint: string[];
  installCommand: string | null;
  buildCommand: string | null;
  lockfile: string | null;
  packageName?: string;
  packageVersion?: string;
}

async function detectBuildInfo(
  root: string,
  workdir: string,
  subpath?: string,
): Promise<BuildInfo> {
  const hasPkgJson = await fileExists(path.join(root, 'package.json'));
  const hasPyproject = await fileExists(path.join(root, 'pyproject.toml'));
  const hasGoMod = await fileExists(path.join(workdir, 'go.mod'));
  const hasCargoToml = await fileExists(path.join(workdir, 'Cargo.toml'));

  if (hasGoMod) return detectGoBuild(workdir);
  if (hasCargoToml) return detectRustBuild(workdir);
  if (hasPyproject) return detectPythonBuild(root);
  if (hasPkgJson) return detectNodeBuild(root, workdir, subpath);

  const hasReqTxt = await fileExists(path.join(root, 'requirements.txt'));
  if (hasReqTxt) return detectPythonRequirements(root);

  return {
    runner: 'node',
    buildPattern: 'unknown',
    entrypoint: [],
    installCommand: null,
    buildCommand: null,
    lockfile: null,
  };
}

async function detectNodeBuild(
  root: string,
  workdir: string,
  subpath?: string,
): Promise<BuildInfo> {
  const pkgText = await readFileOr(path.join(root, 'package.json'));
  let pkg: any;
  try {
    pkg = JSON.parse(pkgText);
  } catch {
    return {
      runner: 'node',
      buildPattern: 'unknown',
      entrypoint: [],
      installCommand: null,
      buildCommand: null,
      lockfile: null,
    };
  }

  const name = pkg.name ?? '';
  const version = pkg.version;
  const hasTs = await fileExists(path.join(root, 'tsconfig.json'));

  // Detect lockfile
  let lockfile: string | null = null;
  if (await fileExists(path.join(root, 'pnpm-lock.yaml'))) lockfile = 'pnpm-lock.yaml';
  else if (await fileExists(path.join(root, 'package-lock.json'))) lockfile = 'package-lock.json';
  else if (await fileExists(path.join(root, 'yarn.lock'))) lockfile = 'yarn.lock';
  // Check workspace root for lockfile too
  if (!lockfile && root !== workdir) {
    if (await fileExists(path.join(workdir, 'pnpm-lock.yaml'))) lockfile = 'pnpm-lock.yaml';
    else if (await fileExists(path.join(workdir, 'package-lock.json'))) lockfile = 'package-lock.json';
    else if (await fileExists(path.join(workdir, 'yarn.lock'))) lockfile = 'yarn.lock';
  }

  // Detect install command
  let installCommand: string | null = null;
  if (lockfile === 'pnpm-lock.yaml') installCommand = 'pnpm install --frozen-lockfile';
  else if (lockfile === 'package-lock.json') installCommand = 'npm ci';
  else if (lockfile === 'yarn.lock') installCommand = 'yarn install --frozen-lockfile';
  else installCommand = 'npm install';

  // Detect build command
  let buildCommand: string | null = null;
  if (pkg.scripts?.build) {
    const prefix = lockfile === 'pnpm-lock.yaml' ? 'pnpm' : 'npm';
    buildCommand = `${prefix} run build`;
  }

  // Detect entrypoint
  const entrypoint = detectNodeEntrypoint(pkg, root, hasTs);

  // Check if published on npm
  const isPublished = name && !name.startsWith('@') && version;
  const isScoped = name.startsWith('@');

  // Classify build pattern
  let buildPattern: BuildPattern;
  if (subpath) {
    buildPattern = 'monorepo';
  } else if (isPublished || isScoped) {
    buildPattern = 'npm-package';
  } else if (hasTs) {
    buildPattern = 'single-ts';
  } else if (entrypoint.length > 0) {
    buildPattern = entrypoint[0].endsWith('.ts') ? 'single-ts' : 'single-js';
  } else {
    buildPattern = 'no-build';
  }

  const runner: Runner = await detectPlaywright(root, pkg) ? 'playwright' : 'node';

  return {
    runner,
    buildPattern,
    entrypoint,
    installCommand,
    buildCommand,
    lockfile,
    packageName: name || undefined,
    packageVersion: version || undefined,
  };
}

function detectNodeEntrypoint(pkg: any, root: string, hasTs: boolean): string[] {
  // Check package.json "bin"
  if (pkg.bin) {
    if (typeof pkg.bin === 'string') return ['node', pkg.bin];
    const bins = Object.values(pkg.bin) as string[];
    if (bins.length > 0) return ['node', bins[0]];
  }

  // Check scripts
  if (pkg.scripts?.start) {
    const start = pkg.scripts.start as string;
    // "node dist/index.js" → ["node", "dist/index.js"]
    const parts = start.split(/\s+/);
    if (parts[0] === 'node' || parts[0] === 'npx' || parts[0] === 'tsx') {
      return parts;
    }
    return ['node', start];
  }

  // Check main field
  if (pkg.main) return ['node', pkg.main];

  // Fallback: common patterns
  if (hasTs) return ['node', 'dist/index.js'];
  return ['node', 'index.js'];
}

async function detectPlaywright(root: string, pkg: any): Promise<boolean> {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  return 'playwright' in deps || 'playwright-core' in deps || '@playwright/test' in deps;
}

async function detectPythonBuild(root: string): Promise<BuildInfo> {
  const pyprojectText = await readFileOr(path.join(root, 'pyproject.toml'));

  const hasUvLock = await fileExists(path.join(root, 'uv.lock'));
  const hasReqTxt = await fileExists(path.join(root, 'requirements.txt'));

  // Detect package name from pyproject.toml
  const nameMatch = pyprojectText.match(/\[project\][\s\S]*?name\s*=\s*"([^"]+)"/);
  const packageName = nameMatch?.[1];

  // Detect entrypoint
  const scriptMatch = pyprojectText.match(/\[project\.scripts\][\s\S]*?(\w[\w-]*)\s*=\s*"([^"]+)"/);
  let entrypoint: string[] = [];
  if (scriptMatch) {
    entrypoint = [scriptMatch[1]];
  } else if (packageName) {
    entrypoint = ['python', '-m', packageName.replace(/-/g, '_')];
  }

  // Classify build pattern
  let buildPattern: BuildPattern;
  let installCommand: string | null;
  let lockfile: string | null = null;

  if (hasUvLock) {
    buildPattern = 'python-uv';
    installCommand = 'uv sync --frozen';
    lockfile = 'uv.lock';
  } else if (hasReqTxt) {
    buildPattern = 'python-source';
    installCommand = 'pip install -r requirements.txt';
    lockfile = 'requirements.txt';
  } else {
    buildPattern = 'python-pypi';
    installCommand = packageName ? `pip install ${packageName}` : 'pip install .';
  }

  return {
    runner: 'python',
    buildPattern,
    entrypoint,
    installCommand,
    buildCommand: null,
    lockfile,
    packageName,
  };
}

async function detectPythonRequirements(root: string): Promise<BuildInfo> {
  // Look for common Python MCP entrypoints
  const mainPy = await fileExists(path.join(root, 'main.py'));
  const serverPy = await fileExists(path.join(root, 'server.py'));
  const entrypoint = mainPy ? ['python', 'main.py'] : serverPy ? ['python', 'server.py'] : ['python', 'main.py'];

  return {
    runner: 'python',
    buildPattern: 'python-source',
    entrypoint,
    installCommand: 'pip install -r requirements.txt',
    buildCommand: null,
    lockfile: 'requirements.txt',
  };
}

async function detectGoBuild(workdir: string): Promise<BuildInfo> {
  return {
    runner: 'go' as Runner,
    buildPattern: 'unknown',
    entrypoint: ['./server'],
    installCommand: null,
    buildCommand: 'go build -o server .',
    lockfile: null,
  };
}

async function detectRustBuild(workdir: string): Promise<BuildInfo> {
  return {
    runner: 'rust' as Runner,
    buildPattern: 'unknown',
    entrypoint: ['./target/release/server'],
    installCommand: null,
    buildCommand: 'cargo build --release',
    lockfile: null,
  };
}

async function detectTransport(root: string): Promise<Transport> {
  // Grep for transport indicators
  const lines = await grepRecursive(root, 'StdioServerTransport|stdio_server|SSEServerTransport|StreamableHTTPServer|sse_server|http_server');

  for (const line of lines) {
    if (/SSEServerTransport|sse_server/i.test(line)) return 'sse';
    if (/StreamableHTTPServer|http_server/i.test(line)) return 'http';
  }

  // Default to stdio (most common for MCP)
  return 'stdio';
}

interface LicenseInfo {
  license: string;
  authors: string[];
  copyright: string;
  publishImage: boolean;
}

const SPDX_PATTERNS: [RegExp, string][] = [
  [/MIT License/i, 'MIT'],
  [/Apache License.*2\.0/i, 'Apache-2.0'],
  [/BSD 2-Clause/i, 'BSD-2-Clause'],
  [/BSD 3-Clause/i, 'BSD-3-Clause'],
  [/ISC License/i, 'ISC'],
  [/GNU General Public License.*v3/i, 'GPL-3.0'],
  [/GNU General Public License.*v2/i, 'GPL-2.0'],
  [/GNU Affero General Public License/i, 'AGPL-3.0'],
  [/GNU Lesser General Public License.*v2\.1/i, 'LGPL-2.1'],
  [/GNU Lesser General Public License.*v3/i, 'LGPL-3.0'],
  [/Creative Commons Zero|CC0/i, 'CC0-1.0'],
];

const GPL_FAMILY = new Set(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0']);

async function detectLicense(workdir: string): Promise<LicenseInfo> {
  const licenseFile = await readFileOr(path.join(workdir, 'LICENSE'));
  if (!licenseFile) {
    const licenseFileMd = await readFileOr(path.join(workdir, 'LICENSE.md'));
    if (!licenseFileMd) {
      return {
        license: 'No license',
        authors: ['Unknown'],
        copyright: '© Unknown',
        publishImage: false,
      };
    }
    return parseLicenseText(licenseFileMd);
  }
  return parseLicenseText(licenseFile);
}

function parseLicenseText(text: string): LicenseInfo {
  let license = 'No license';
  for (const [pattern, spdx] of SPDX_PATTERNS) {
    if (pattern.test(text)) {
      license = spdx;
      break;
    }
  }

  // Extract copyright line
  const copyrightMatch = text.match(/Copyright\s*(?:\(c\)\s*)?(\d{4}(?:\s*-\s*\d{4})?)\s+(.+?)(?:\.|$)/im);
  let copyright = '© Unknown';
  const authors: string[] = [];
  if (copyrightMatch) {
    const year = copyrightMatch[1].replace(/\s/g, '');
    const holder = copyrightMatch[2].trim();
    copyright = `© ${year} ${holder}`;
    authors.push(holder);
  }

  const publishImage = license !== 'No license' && license !== 'Proprietary' && !GPL_FAMILY.has(license);

  return { license, authors: authors.length > 0 ? authors : ['Unknown'], copyright, publishImage };
}

async function detectTools(root: string): Promise<string[]> {
  const tools = new Set<string>();

  // TypeScript/JavaScript: look for tool registrations
  const tsToolLines = await grepRecursive(
    root,
    'server\\.tool\\(|addTool\\(|ListToolsRequestSchema|registerTool\\(|\\.setRequestHandler\\(ListTools',
  );
  for (const line of tsToolLines) {
    // server.tool("name", ...) or addTool({name: "foo"})
    const nameMatch = line.match(/(?:server\.tool|addTool)\s*\(\s*["']([^"']+)["']/);
    if (nameMatch) tools.add(nameMatch[1]);
    const objMatch = line.match(/(?:addTool|registerTool)\s*\(\s*\{\s*name:\s*["']([^"']+)["']/);
    if (objMatch) tools.add(objMatch[1]);
  }

  // Look for tool definitions in tool arrays/objects
  const toolDefLines = await grepRecursive(root, 'name:\\s*["\'][a-z_][a-z0-9_-]*["\']');
  for (const line of toolDefLines) {
    // Only match lines that look like tool definitions (near tool-related context)
    if (/tool|Tool|handler|Handler|request|schema/i.test(line)) {
      const match = line.match(/name:\s*["']([a-z_][a-z0-9_-]*)["']/);
      if (match && match[1].length > 2 && match[1].length < 64) {
        tools.add(match[1]);
      }
    }
  }

  // Python: look for @server.list_tools() and tool decorators
  const pyToolLines = await grepRecursive(root, '@(mcp\\.tool|server\\.call_tool|server\\.list_tools|tool)');
  for (const line of pyToolLines) {
    const nameMatch = line.match(/@(?:mcp\.tool|tool)\s*\(\s*(?:name\s*=\s*)?["']([^"']+)["']/);
    if (nameMatch) tools.add(nameMatch[1]);
  }

  // Also look for Python function-based tool defs
  const pyFuncTools = await grepRecursive(root, 'def\\s+\\w+.*->.*Tool|Tool\\(name=');
  for (const line of pyFuncTools) {
    const match = line.match(/Tool\(name=["']([^"']+)["']/);
    if (match) tools.add(match[1]);
  }

  return [...tools].sort();
}

async function detectEnvVars(root: string): Promise<EnvVar[]> {
  const vars = new Map<string, EnvVar>();

  // JavaScript/TypeScript: process.env.VAR_NAME
  const jsLines = await grepRecursive(root, 'process\\.env\\.[A-Z_][A-Z0-9_]*');
  for (const line of jsLines) {
    const matches = line.matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g);
    for (const m of matches) {
      const name = m[1];
      if (!vars.has(name)) {
        vars.set(name, {
          name,
          required: false,
          secret: SECRET_PATTERNS.test(name),
        });
      }
    }
  }

  // Python: os.environ / os.getenv
  const pyLines = await grepRecursive(root, 'os\\.environ\\[|os\\.getenv\\(|environ\\.get\\(');
  for (const line of pyLines) {
    const envMatch = line.match(/os\.environ\[["']([A-Z_][A-Z0-9_]*)["']\]/);
    if (envMatch && !vars.has(envMatch[1])) {
      vars.set(envMatch[1], { name: envMatch[1], required: true, secret: SECRET_PATTERNS.test(envMatch[1]) });
    }
    const getMatch = line.match(/(?:os\.getenv|environ\.get)\(["']([A-Z_][A-Z0-9_]*)["']/);
    if (getMatch && !vars.has(getMatch[1])) {
      vars.set(getMatch[1], { name: getMatch[1], required: false, secret: SECRET_PATTERNS.test(getMatch[1]) });
    }
  }

  // Also check .env.example
  const envExample = await readFileOr(path.join(root, '.env.example'));
  if (envExample) {
    for (const line of envExample.split('\n')) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
      if (match && !vars.has(match[1])) {
        const val = line.slice(match[0].length).trim();
        vars.set(match[1], {
          name: match[1],
          required: false,
          secret: SECRET_PATTERNS.test(match[1]),
          default: val || undefined,
        });
      }
    }
  }

  // Filter out common non-MCP env vars
  const IGNORE = new Set(['NODE_ENV', 'PATH', 'HOME', 'PWD', 'SHELL', 'USER', 'LANG', 'TERM', 'CI', 'DEBUG', 'VERBOSE']);
  return [...vars.values()].filter((v) => !IGNORE.has(v.name)).sort((a, b) => a.name.localeCompare(b.name));
}

export function needsFallback(result: AnalysisResult): boolean {
  return (
    result.confidence.tools === 'none' ||
    result.confidence.entrypoint === 'none' ||
    result.buildPattern === 'unknown'
  );
}
