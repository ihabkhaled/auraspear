import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const boot = readFileSync('.ai/bootstrap/boot.toon', 'utf8')
const requiredRuntimeContents = [
  readFileSync('.ai/bootstrap/boot.md', 'utf8'),
  boot,
  readFileSync('.ai/bootstrap/boot.sjon', 'utf8'),
]
const jsonRuntimeContents = [
  readFileSync('.ai/bootstrap/boot.json', 'utf8'),
  readFileSync('.ai/executive-function/executive-function.json', 'utf8'),
  readFileSync('.ai/executive-function/state-machine.json', 'utf8'),
  readFileSync('.ai/executive-function/state.schema.json', 'utf8'),
  readFileSync('.ai/context/context-index.json', 'utf8'),
  readFileSync('.ai/memory/index.json', 'utf8'),
  readFileSync('.ai/telemetry/signals.schema.json', 'utf8'),
  readFileSync('.ai/telemetry/thresholds.json', 'utf8'),
  readFileSync('.ai/manifests/rules.json', 'utf8'),
  readFileSync('.ai/manifests/skills.json', 'utf8'),
  readFileSync('.ai/manifests/agents.json', 'utf8'),
  readFileSync('.ai/manifests/knowledge.json', 'utf8'),
]
const routerContents = [
  readFileSync('AGENTS.md', 'utf8'),
  readFileSync('CLAUDE.md', 'utf8'),
  readFileSync('CODEX.md', 'utf8'),
  readFileSync('GPT.md', 'utf8'),
  readFileSync('.cursorrules', 'utf8'),
]

describe('AI executive-function framework', () => {
  it('installs the required machine-readable runtime', () => {
    expect(requiredRuntimeContents.every(content => content.length > 0)).toBe(true)
    expect(jsonRuntimeContents.every(content => content.length > 0)).toBe(true)
  })

  it('keeps the always-loaded bootstrap compact', () => {
    expect(Buffer.byteLength(boot, 'utf8')).toBeLessThanOrEqual(4096)
  })

  it('provides thin active-agent routers into canonical policy', () => {
    for (const content of routerContents) {
      expect(content).toContain('.ai/bootstrap/boot.toon')
      expect(content).toContain('.ai/rules/00-master-rules.md')
      expect(content).toContain('.ai/context/context-index.json')
      expect(content).toContain('.ai/rules/09-communication.md')
    }
  })

  it('keeps all JSON runtime artifacts parseable', () => {
    for (const content of jsonRuntimeContents) {
      expect(() => JSON.parse(content)).not.toThrow()
    }
  })
})
