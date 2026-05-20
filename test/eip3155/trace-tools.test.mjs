import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { compareNormalizedTraces, compareTraceFiles, normalizeTraceDocument } from './trace-tools.mjs'

test('normalizes Tevm structLogs to EIP-3155 fields', () => {
	const trace = normalizeTraceDocument({
		gas: '0x3',
		failed: false,
		returnValue: '0x40',
		structLogs: [
			{
				pc: 0,
				op: 'PUSH1',
				gas: 10n,
				gasCost: 3n,
				stack: [],
				depth: 1,
			},
		],
	})

	assert.deepEqual(trace.steps[0], {
		pc: 0,
		op: 96,
		gas: '0xa',
		gasCost: '0x3',
		memSize: 0,
		stack: [],
		returnData: '0x',
		depth: 1,
		refund: 0,
		error: null,
		opName: 'PUSH1',
	})
	assert.deepEqual(trace.summary, {
		output: '0x40',
		gasUsed: '0x3',
		pass: true,
	})
})

test('reports first EIP-3155 divergence', () => {
	const actual = normalizeTraceDocument([{ pc: 0, opName: 'PUSH1', gas: '0x2', gasCost: '0x3' }])
	const reference = normalizeTraceDocument([{ pc: 0, opName: 'PUSH1', gas: '0x1', gasCost: '0x3' }])
	const result = compareNormalizedTraces({ actual, reference })

	assert.equal(result.status, 'failed')
	assert.deepEqual(result.firstDivergence, {
		index: 0,
		field: 'gas',
		actual: '0x2',
		reference: '0x1',
	})
})

test('normalizes nested trace artifacts without treating metadata as opcodes', () => {
	const trace = normalizeTraceDocument({
		suite: 'general-state-tests',
		traces: [
			{
				id: 'upstream-vector',
				trace: {
					structLogs: [{ pc: 1, op: 'ADD', gas: '0x4', gasCost: '0x3', depth: 1, stack: ['0x1', '0x2'] }],
				},
			},
		],
	})

	assert.equal(trace.steps.length, 1)
	assert.equal(trace.steps[0].opName, 'ADD')
})

test('compares JSONL trace files', () => {
	const dir = mkdtempSync(join(tmpdir(), 'tevm-eip3155-'))
	const actual = join(dir, 'actual.jsonl')
	const reference = join(dir, 'reference.jsonl')
	const out = join(dir, 'diff.json')
	const line = '{"pc":0,"op":96,"gas":"0x1","gasCost":"0x3","memSize":0,"stack":[],"returnData":"0x","depth":1,"refund":0,"opName":"PUSH1"}\n'
	writeFileSync(actual, line)
	writeFileSync(reference, line)

	const result = compareTraceFiles({ actualFile: actual, referenceFile: reference, outFile: out })

	assert.equal(result.status, 'passed')
	assert.equal(JSON.parse(readFileSync(out, 'utf8')).status, 'passed')
})

test('missing reference writes skipped/no-coverage result', () => {
	const dir = mkdtempSync(join(tmpdir(), 'tevm-eip3155-'))
	const out = join(dir, 'diff.json')
	const result = compareTraceFiles({
		actualFile: join(dir, 'actual.jsonl'),
		referenceFile: join(dir, 'reference.jsonl'),
		outFile: out,
	})

	assert.equal(result.status, 'skipped')
	assert.equal(result.coverage, 'none')
	assert.equal(result.synthetic, false)
	assert.equal(JSON.parse(readFileSync(out, 'utf8')).status, 'skipped')
})
