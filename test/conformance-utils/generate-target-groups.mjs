#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = new Map(process.argv.slice(2).map((arg) => {
  const [k, ...rest] = arg.split('=')
  return [k, rest.join('=') || 'true']
}))

const fixtures = [
  { name: 'general-state-tests', path: resolve('test/ethereum-state-tests/fixtures/general-state-tests/sample-fixtures.json') },
  { name: 'execution-spec-tests', path: resolve('test/execution-spec-tests/fixtures/scoped/sample-fixtures.json') },
]

const hardforks = ['frontier', 'berlin', 'shanghai', 'cancun', 'prague', 'osaka']
const outFile = args.get('--out') ?? 'artifacts/conformance-target-groups/frontier-osaka.json'

const output = {
  generatedAt: new Date().toISOString(),
  hardforks,
  suites: {},
}

for (const fixture of fixtures) {
  const vectors = JSON.parse(readFileSync(fixture.path, 'utf8'))
  const byHardfork = Object.fromEntries(hardforks.map((hf) => [hf, []]))

  for (const vector of vectors) {
    if (!hardforks.includes(vector.hardfork)) continue
    byHardfork[vector.hardfork].push({
      id: vector.id,
      group: vector.group,
      eips: vector.eips ?? [],
      upstreamRef: vector.meta?.upstreamRef ?? null,
    })
  }

  output.suites[fixture.name] = byHardfork
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(output, null, 2))
console.log(`wrote ${outFile}`)
