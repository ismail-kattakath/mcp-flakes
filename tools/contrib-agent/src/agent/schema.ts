import { z } from 'zod';

// Mirrors schema/flake.schema.json. Keep in sync.
export const FlakeManifest = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/),
  upstream: z.object({
    repo: z.string().url(),
    commit: z.string().regex(/^[a-f0-9]{40}$/),
    license: z.enum([
      'MIT',
      'Apache-2.0',
      'BSD-2-Clause',
      'BSD-3-Clause',
      'ISC',
      'GPL-2.0',
      'GPL-3.0',
      'AGPL-3.0',
      'LGPL-2.1',
      'LGPL-3.0',
      'CC0-1.0',
      'Proprietary',
      'No license',
    ]),
    subpath: z.string().optional(),
    package: z.string().optional(),
    package_version: z.string().optional(),
  }),
  runner: z.enum(['node', 'python', 'node-python', 'playwright', 'go', 'rust']),
  build: z.object({
    type: z
      .enum([
        'monorepo',
        'single-ts',
        'single-js',
        'npm-package',
        'python-source',
        'python-pypi',
        'python-uv',
        'no-build',
      ])
      .optional(),
    install: z.string().nullable().optional(),
    build: z.string().nullable().optional(),
    entrypoint: z.array(z.string()).min(1),
    deterministic: z.boolean().optional(),
    lockfile: z
      .enum([
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        'requirements.txt',
        'uv.lock',
      ])
      .nullable()
      .optional(),
  }),
  transport: z.enum(['stdio', 'http', 'sse', 'websocket']),
  env: z
    .array(
      z.object({
        name: z.string().regex(/^[A-Z_][A-Z0-9_]*$/),
        required: z.boolean().optional(),
        secret: z.boolean().optional(),
        description: z.string().optional(),
        default: z.string().optional(),
      }),
    )
    .optional(),
  tools: z.array(z.string()).min(1),
  publish_image: z.boolean(),
  compliance: z.object({
    license_verified: z.boolean(),
    authors: z.array(z.string()).min(1),
    copyright: z.string().regex(/^©/),
    last_checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().optional(),
  }),
});

export type FlakeManifest = z.infer<typeof FlakeManifest>;
