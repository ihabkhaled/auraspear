import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const repositoryRoot = process.cwd()
const requiredRuntimeFiles = [
  '.ai/bootstrap/boot.md',
  '.ai/bootstrap/boot.json',
  '.ai/bootstrap/boot.toon',
  '.ai/bootstrap/boot.sjon',
  '.ai/executive-function/executive-function.json',
  '.ai/executive-function/state-machine.json',
  '.ai/executive-function/state.schema.json',
  '.ai/context/context-index.json',
  '.ai/memory/index.json',
  '.ai/telemetry/signals.schema.json',
  '.ai/telemetry/thresholds.json',
  '.ai/manifests/rules.json',
  '.ai/manifests/skills.json',
  '.ai/manifests/agents.json',
  '.ai/manifests/knowledge.json',
]

describe('AI executive-function framework', () => {
  it('installs the required machine-readable runtime', () => {
    for (const relativePath of requiredRuntimeFiles) {
      expect(existsSync(join(repositoryRoot, relativePath)), relativePath).toBe(true)
    }
  })

  it('keeps the always-loaded bootstrap compact', () => {
    const boot = readFileSync(join(repositoryRoot, '.ai/bootstrap/boot.toon'), 'utf8')

    expect(Buffer.byteLength(boot, 'utf8')).toBeLessThanOrEqual(4096)
  })

  it('provides thin active-agent routers into canonical policy', () => {
    for (const router of ['AGENTS.md', 'CLAUDE.md', 'CODEX.md', 'GPT.md', '.cursorrules']) {
      const content = readFileSync(join(repositoryRoot, router), 'utf8')

      expect(content).toContain('.ai/bootstrap/boot.toon')
      expect(content).toContain('.ai/rules/00-master-rules.md')
      expect(content).toContain('.ai/context/context-index.json')
      expect(content).toContain('.ai/rules/09-communication.md')
    }
  })

  it('keeps all JSON runtime artifacts parseable', () => {
    for (const relativePath of requiredRuntimeFiles.filter(path => path.endsWith('.json'))) {
      const content = readFileSync(join(repositoryRoot, relativePath), 'utf8')

      expect(() => JSON.parse(content), relativePath).not.toThrow()
    }
  })
})
