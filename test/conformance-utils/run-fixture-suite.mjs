#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { compareTraceFiles } from '../eip3155/trace-tools.mjs'

const args = new Map(process.argv.slice(2).map((arg) => {
  const [k, ...rest] = arg.split('=')
  return [k, rest.join('=') || 'true']
}))

const suite = args.get('--suite') ?? 'unknown'
const fixturesPath = args.get('--fixtures')
const hardfork = args.get('--hardfork')
const group = args.get('--group')
const pattern = args.get('--pattern')
const outFile = args.get('--out') ?? `artifacts/${suite}/latest.json`
const isolate = args.get('--isolate')
const traceOutFile = args.get('--trace-out')
const traceCompare = args.get('--trace-compare') === 'true'
const traceReferenceFile = args.get('--trace-reference')
const traceDiffOutFile = args.get('--trace-diff-out') ?? 'artifacts/eip3155/trace-diff.json'

const summary = {
  suite,
  status: 'skipped',
  coverage: 'none',
  synthetic: false,
  reason: fixturesPath
    ? `No Tevm upstream conformance runner is wired for fixture path: ${fixturesPath}`
    : 'No upstream fixture corpus configured.',
  requiredInput: 'Provide real upstream ethereum/tests or execution-spec-tests inputs after implementing a Tevm runner for that format.',
  total: 0,
  passed: 0,
  failed: 0,
  filters: { hardfork: hardfork ?? null, group: group ?? null, pattern: pattern ?? null },
  isolate: isolate ?? null,
  traceCompare,
  generatedAt: new Date().toISOString(),
  results: [],
}

if (fixturesPath && existsSync(fixturesPath)) {
  summary.status = 'unsupported'
  summary.reason = 'Refusing to treat local fixture metadata as execution conformance coverage.'
  summary.requiredInput =
    'Implement a runner that executes the real upstream fixture format through Tevm VM/node APIs before enabling this suite.'
}

if (traceOutFile) {
  mkdirSync(dirname(traceOutFile), { recursive: true })
  writeFileSync(traceOutFile, JSON.stringify({ suite, status: summary.status, traces: [] }, null, 2))
}

if (traceCompare) {
  summary.traceDiff = compareTraceFiles({
    actualFile: traceOutFile,
    referenceFile: traceReferenceFile,
    outFile: traceDiffOutFile,
  })
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(summary, null, 2))

if (summary.status === 'unsupported') {
  console.error(`${suite} unsupported: ${summary.reason}`)
  process.exit(1)
}

console.log(`${suite} skipped: ${summary.reason}`)
