#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = new Map(process.argv.slice(2).map((arg) => {
  const [k, ...rest] = arg.split('=')
  return [k, rest.join('=') || 'true']
}))

const groupFilter = args.get('--group')
const hardforkFilter = args.get('--hardfork')
const outFile = args.get('--out') ?? 'artifacts/verkle-conformance/latest.json'

const vectorsPath = resolve('test/hardfork-conformance/vectors/verkle/verkle-transition.vectors.json')
const vectors = JSON.parse(readFileSync(vectorsPath, 'utf8'))
const knownGaps = [
  {
    id: 'osaka-verkle-upstream-fixture-parity',
    hardfork: 'osaka',
    status: 'tracking',
    note: 'Upstream Osaka/Verkle transition fixtures are evolving; vectors currently validate witness-shape and expected failure modes.',
  },
]

const selected = vectors.filter((v) => {
  if (groupFilter && v.group !== groupFilter) return false
  if (hardforkFilter && v.hardfork !== hardforkFilter) return false
  return true
})

const isHex = (v) => typeof v === 'string' && /^0x[0-9a-fA-F]*$/.test(v)

const validateWitness = (witness) => {
  if (!witness || typeof witness !== 'object') return 'missing witness'
  if (!Array.isArray(witness.stateDiff)) return 'missing stateDiff'
  if (!witness.verkleProof) return 'missing verkleProof'
  for (const item of witness.stateDiff) {
    if (!item || typeof item !== 'object') return 'invalid stateDiff item'
    if (!isHex(item.stem) || item.stem.length !== 62) return 'invalid stem'
    if (!Array.isArray(item.suffixDiffs)) return 'invalid suffixDiffs'
  }
  return null
}

const results = selected.map((vector) => {
  const failure = validateWitness(vector.witness)
  const passed = vector.expects === 'pass' ? failure === null : failure !== null
  return {
    id: vector.id,
    group: vector.group,
    hardfork: vector.hardfork,
    eips: vector.eips ?? [],
    expected: vector.expects,
    passed,
    error: failure,
  }
})

const summary = {
  suite: 'verkle-transition-conformance',
  total: results.length,
  passed: results.filter((r) => r.passed).length,
  failed: results.filter((r) => !r.passed).length,
  filters: {
    group: groupFilter ?? null,
    hardfork: hardforkFilter ?? null,
  },
  knownGaps,
  generatedAt: new Date().toISOString(),
  results,
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(summary, null, 2))

if (summary.failed > 0) {
  console.error(`verkle conformance failed: ${summary.failed}/${summary.total}`)
  process.exit(1)
}

console.log(`verkle conformance passed: ${summary.passed}/${summary.total}`)
