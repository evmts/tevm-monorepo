#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const args = new Map(process.argv.slice(2).map((arg) => {
  const [k, ...rest] = arg.split('=')
  return [k, rest.join('=') || 'true']
}))

const hardforks = ['frontier', 'berlin', 'shanghai', 'cancun', 'prague', 'osaka']
const outFile = args.get('--out') ?? 'artifacts/conformance-target-groups/frontier-osaka.json'

const output = {
  generatedAt: new Date().toISOString(),
  status: 'skipped',
  coverage: 'none',
  synthetic: false,
  reason: 'No upstream conformance corpus is vendored and synthetic target groups are intentionally disabled.',
  hardforks,
  suites: {
    'general-state-tests': Object.fromEntries(hardforks.map((hf) => [hf, []])),
    'execution-spec-tests': Object.fromEntries(hardforks.map((hf) => [hf, []])),
  },
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(output, null, 2))
console.log(`wrote ${outFile}`)
