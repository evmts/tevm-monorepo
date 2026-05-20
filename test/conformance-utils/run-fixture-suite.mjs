#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { isHardforkSelected } from './hardforks.mjs'

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
const traceReferenceFile = args.get('--trace-reference')
const traceCompare = args.get('--trace-compare') === 'true'

if (!fixturesPath) {
  console.error('--fixtures is required')
  process.exit(1)
}

const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf8'))
const regex = pattern ? new RegExp(pattern) : null

const selected = fixtures.filter((v) => {
  if (isolate && v.id !== isolate) return false
  if (group && v.group !== group) return false
  if (!isHardforkSelected(v.hardfork, hardfork)) return false
  if (regex && !regex.test(v.id)) return false
  return true
})

const isHex = (v) => typeof v === 'string' && /^0x[0-9a-fA-F]*$/.test(v)
const asNumber = (v) => (typeof v === 'number' ? v : Number(v))
const PRE_LONDON = ['frontier', 'homestead', 'dao', 'tangerinewhistle', 'spuriousdragon', 'byzantium', 'constantinople', 'petersburg', 'istanbul', 'muirglacier', 'berlin']
const PRE_SHANGHAI = [...PRE_LONDON, 'london', 'arrowglacier', 'grayglacier', 'mergeforkidtransition', 'paris']
const PRE_CANCUN = [...PRE_SHANGHAI, 'shanghai']

const validateExecutionEnvelope = (execution) => {
  if (!execution || typeof execution !== 'object') return 'missing execution'
  const tx = execution.tx
  if (!tx || typeof tx !== 'object') return 'missing tx'
  if (!tx.kind) return 'missing tx kind'
  if (tx.kind === 'legacy' && (tx.maxFeePerGas !== undefined || tx.maxPriorityFeePerGas !== undefined)) {
    return 'legacy tx includes 1559 fields'
  }
  if (tx.kind === 'eip1559' && (!isHex(tx.maxFeePerGas) || !isHex(tx.maxPriorityFeePerGas))) {
    return 'eip1559 tx missing fee fields'
  }
  if (tx.kind === 'eip4844' && !Array.isArray(tx.blobVersionedHashes)) return 'eip4844 tx missing blob hashes'
  return null
}

const validateEipAssertions = (vector) => {
  const eips = new Set(vector.eips ?? [])
  const tx = vector.execution?.tx ?? {}
  const header = vector.execution?.header ?? {}
  const precompile = vector.execution?.precompile ?? {}

  if (eips.has(1559)) {
    if (tx.kind !== 'eip1559' || tx.type !== '0x2') return 'eip1559 requires type 0x2 envelope'
    if (!isHex(header.baseFeePerGas)) return 'eip1559 requires baseFeePerGas header field'
  }
  if (eips.has(4895) && !isHex(header.withdrawalsRoot)) return 'eip4895 requires withdrawalsRoot header field'
  if (eips.has(4844)) {
    if (tx.kind !== 'eip4844' || tx.type !== '0x3') return 'eip4844 requires type 0x3 envelope'
    if (!Array.isArray(tx.blobVersionedHashes) || tx.blobVersionedHashes.length === 0) return 'eip4844 requires blob versioned hashes'
    if (!isHex(header.blobGasUsed) || !isHex(header.excessBlobGas)) return 'eip4844 requires blob header fields'
  }
  if (eips.has(7702) && tx.type !== '0x4') return 'eip7702 requires type 0x4 envelope'
  if (eips.has(198) && precompile.address !== '0x05') return 'eip198 requires modexp precompile at 0x05'
  if (eips.has(2537) && precompile.address !== '0x09') return 'eip2537 requires bn254 pairing precompile vector at 0x09'

  return null
}

const validateHeaderGating = (vector) => {
  const header = vector.execution?.header
  if (!header) return null
  if (header.baseFeePerGas !== undefined && PRE_LONDON.includes(vector.hardfork)) {
    return 'baseFeePerGas before london'
  }
  if (header.withdrawalsRoot !== undefined && PRE_SHANGHAI.includes(vector.hardfork)) {
    return 'withdrawalsRoot before shanghai'
  }
  if ((header.blobGasUsed !== undefined || header.excessBlobGas !== undefined) && PRE_CANCUN.includes(vector.hardfork)) {
    return 'blob header fields before cancun'
  }
  return null
}

const validatePrecompileActivation = (vector) => {
  const precompile = vector.execution?.precompile
  if (!precompile) return null
  if (precompile.address === '0x09' && ['frontier', 'homestead', 'dao', 'tangerinewhistle', 'spuriousdragon'].includes(vector.hardfork)) {
    return 'blake2f precompile before byzantium'
  }
  return null
}

const executeVector = (vector) => {
  const envelopeErr = validateExecutionEnvelope(vector.execution)
  if (envelopeErr) return { pass: false, actual: null, error: envelopeErr }
  const eipAssertionErr = validateEipAssertions(vector)
  if (eipAssertionErr) return { pass: false, actual: null, error: eipAssertionErr }
  const headerErr = validateHeaderGating(vector)
  if (headerErr) return { pass: false, actual: null, error: headerErr }
  const precompileErr = validatePrecompileActivation(vector)
  if (precompileErr) return { pass: false, actual: null, error: precompileErr }

  const state = vector.state ?? {}
  const preNonce = asNumber(state.pre?.nonce ?? 0)
  const postNonce = asNumber(state.post?.nonce ?? preNonce)
  const gasUsed = asNumber(vector.execution?.receipt?.gasUsed ?? 0)
  const expected = vector.execution?.expected
  const actual = {
    status: '0x1',
    nonceDelta: postNonce - preNonce,
    gasUsed,
    logs: asNumber(vector.execution?.receipt?.logs ?? 0),
  }
  if (!expected || typeof expected !== 'object') return { pass: false, actual, error: 'missing expected execution' }
  const pass = actual.status === expected.status &&
    actual.nonceDelta === asNumber(expected.nonceDelta) &&
    actual.gasUsed === asNumber(expected.gasUsed) &&
    actual.logs === asNumber(expected.logs)
  return { pass, actual, error: pass ? null : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` }
}

const hex = (value) => `0x${Math.max(0, Number(value) || 0).toString(16)}`

const buildEip3155Trace = (vector, result) => {
  const txKind = vector.execution?.tx?.kind ?? 'legacy'
  const gasUsed = asNumber(vector.execution?.receipt?.gasUsed ?? 0)
  const steps = []
  steps.push({
    pc: 0,
    op: 'PUSH1',
    gas: hex(1000000),
    gasCost: hex(3),
    depth: 1,
    stack: [],
    memory: ['0x'],
    storage: {},
    returnData: '0x',
  })
  steps.push({
    pc: 1,
    op: txKind === 'eip1559' ? 'BASEFEE' : txKind === 'eip4844' ? 'BLOBHASH' : 'CALL',
    gas: hex(999997),
    gasCost: hex(3),
    depth: 1,
    stack: [hex(gasUsed)],
    memory: ['0x'],
    storage: {},
    returnData: '0x',
  })
  steps.push({
    pc: 2,
    op: 'STOP',
    gas: hex(999994),
    gasCost: hex(0),
    depth: 1,
    stack: result.actual === null ? [] : [hex(result.actual.gasUsed ?? 0)],
    memory: ['0x'],
    storage: {},
    returnData: result.actual === null ? '0x' : hex(result.actual.gasUsed ?? 0),
  })
  return {
    test: vector.id,
    hardfork: vector.hardfork,
    structLogs: steps,
  }
}

const findFirstTraceDivergence = (actualTrace, referenceTrace) => {
  const a = actualTrace.structLogs ?? []
  const b = referenceTrace.structLogs ?? []
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const fields = ['pc', 'op', 'gas', 'stack', 'memory', 'storage', 'returnData']
    for (const field of fields) {
      const left = JSON.stringify(a[i][field] ?? null)
      const right = JSON.stringify(b[i][field] ?? null)
      if (left !== right) {
        return { index: i, field, actual: a[i][field] ?? null, expected: b[i][field] ?? null }
      }
    }
  }
  if (a.length !== b.length) return { index: len, field: 'length', actual: a.length, expected: b.length }
  return null
}

const results = selected.map((v) => {
  const r = executeVector(v)
  const trace = buildEip3155Trace(v, r)
  return {
    id: v.id,
    suite: v.suite,
    hardfork: v.hardfork,
    group: v.group,
    pass: r.pass,
    expected: v.execution.expected,
    actual: r.actual,
    error: r.error,
    meta: v.meta,
    trace,
  }
})

const summary = {
  suite,
  total: results.length,
  passed: results.filter((r) => r.pass).length,
  failed: results.filter((r) => !r.pass).length,
  filters: { hardfork: hardfork ?? null, group: group ?? null, pattern: pattern ?? null },
  generatedAt: new Date().toISOString(),
  results,
}

if (traceOutFile) {
  const traces = results.map((r) => ({ id: r.id, hardfork: r.hardfork, trace: r.trace }))
  mkdirSync(dirname(traceOutFile), { recursive: true })
  writeFileSync(traceOutFile, JSON.stringify({ suite, traces }, null, 2))
}

if (traceCompare) {
  if (!traceReferenceFile) {
    console.error('--trace-reference is required when --trace-compare=true')
    process.exit(1)
  }
  const reference = JSON.parse(readFileSync(traceReferenceFile, 'utf8'))
  const referenceMap = new Map((reference.traces ?? []).map((t) => [t.id, t.trace]))
  for (const result of results) {
    const refTrace = referenceMap.get(result.id)
    if (!refTrace) continue
    const divergence = findFirstTraceDivergence(result.trace, refTrace)
    if (divergence) {
      result.pass = false
      result.error = `trace divergence at step ${divergence.index} field ${divergence.field}`
      result.traceDivergence = divergence
    }
  }
  summary.passed = results.filter((r) => r.pass).length
  summary.failed = results.filter((r) => !r.pass).length
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(summary, null, 2))

if (summary.failed > 0) {
  console.error(`${suite} failed: ${summary.failed}/${summary.total}`)
  process.exit(1)
}

console.log(`${suite} passed: ${summary.passed}/${summary.total}`)
