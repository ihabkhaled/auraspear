import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('lint resource limits', () => {
  it('caps frontend ESLint and lint-staged concurrency at five', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }
    const lintStagedConfig = readFileSync(join(process.cwd(), '.lintstagedrc.cjs'), 'utf8')

    expect(packageJson.scripts['lint']).toContain('--concurrency=5')
    expect(packageJson.scripts['lint:strict']).toContain('--concurrency=5')
    expect(packageJson.scripts['lint:fix']).toContain('--concurrency=5')
    expect(packageJson.scripts['lint-staged']).toContain('--concurrent 5')
    expect(lintStagedConfig).toContain('--concurrency=5')
  })
})
