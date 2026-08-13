import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pathOf = relativePath => resolve(root, relativePath)
const read = relativePath => readFileSync(pathOf(relativePath), 'utf8')
const parse = relativePath => JSON.parse(read(relativePath))
const errors = []
const report = {}
const manifests = ['rules', 'skills', 'agents', 'knowledge']
const requiredRouterReferences = [
  '.ai/bootstrap/boot.toon',
  '.ai/rules/00-master-rules.md',
  '.ai/context/context-index.json',
  '.ai/rules/09-communication.md',
]

const fail = message => errors.push(message)

for (const name of manifests) {
  const manifestPath = `.ai/manifests/${name}.json`
  const manifest = parse(manifestPath)
  const ids = new Set()
  for (const entry of manifest.entries) {
    if (ids.has(entry.id)) fail(`duplicate ${name} id: ${entry.id}`)
    ids.add(entry.id)
    if (!existsSync(pathOf(entry.path))) fail(`broken ${name} reference: ${entry.path}`)
    for (const field of ['id', 'path', 'purpose', 'priority', 'scope', 'loadCondition', 'version']) {
      if (entry[field] === undefined) fail(`${name}/${entry.id} missing ${field}`)
    }
  }
  report[name] = manifest.entries.length
}

const agents = parse('.ai/manifests/agents.json')
for (const agent of agents.entries) {
  const content = read(agent.path)
  for (const reference of requiredRouterReferences) {
    if (!content.includes(reference)) fail(`${agent.path} missing ${reference}`)
  }
}

const thresholds = parse('.ai/telemetry/thresholds.json')
const bootBytes = Buffer.byteLength(read('.ai/bootstrap/boot.toon'), 'utf8')
report.bootBytes = bootBytes
if (bootBytes > thresholds.maxBootBytes) fail(`boot is ${bootBytes} bytes; maximum ${thresholds.maxBootBytes}`)

const machineJson = [
  '.ai/bootstrap/boot.json',
  '.ai/executive-function/executive-function.json',
  '.ai/executive-function/state-machine.json',
  '.ai/executive-function/state.schema.json',
  '.ai/context/context-index.json',
  '.ai/context/current-task.json',
  '.ai/memory/index.json',
  '.ai/state/active-task.json',
  '.ai/state/progress.json',
  '.ai/state/recovery.json',
  '.ai/telemetry/signals.schema.json',
  '.ai/telemetry/thresholds.json',
]
for (const jsonPath of machineJson) parse(jsonPath)
report.machineJson = machineJson.length + manifests.length

const stateMachine = parse('.ai/executive-function/state-machine.json')
const states = new Set([...Object.keys(stateMachine.transitions), ...stateMachine.terminal])
for (const [source, targets] of Object.entries(stateMachine.transitions)) {
  for (const target of targets) if (!states.has(target)) fail(`unknown state transition: ${source} -> ${target}`)
}

const scenarios = read('.ai/tests/executive-function-cases.md').toLowerCase()
for (const scenario of ['attention drift', 'scope drift', 'recursive decomposition', 'retry loop', 'verification loop', 'critic loop', 'context loop', 'livelock', 'deadlock', 'hallucinated knowledge', 'premature completion', 'completion avoidance']) {
  if (!scenarios.includes(scenario)) fail(`missing framework scenario: ${scenario}`)
}

report.contextRoutes = parse('.ai/context/context-index.json').routes.length
report.brokenReferences = errors.filter(error => error.includes('reference')).length
report.duplicates = errors.filter(error => error.includes('duplicate')).length
report.errors = errors.length

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (errors.length > 0) {
  process.stderr.write(`${errors.join('\n')}\n`)
  process.exitCode = 1
}
