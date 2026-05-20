#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const STATIC_OPCODES = {
	STOP: 0x00,
	ADD: 0x01,
	MUL: 0x02,
	SUB: 0x03,
	DIV: 0x04,
	SDIV: 0x05,
	MOD: 0x06,
	SMOD: 0x07,
	ADDMOD: 0x08,
	MULMOD: 0x09,
	EXP: 0x0a,
	SIGNEXTEND: 0x0b,
	LT: 0x10,
	GT: 0x11,
	SLT: 0x12,
	SGT: 0x13,
	EQ: 0x14,
	ISZERO: 0x15,
	AND: 0x16,
	OR: 0x17,
	XOR: 0x18,
	NOT: 0x19,
	BYTE: 0x1a,
	SHL: 0x1b,
	SHR: 0x1c,
	SAR: 0x1d,
	KECCAK256: 0x20,
	SHA3: 0x20,
	ADDRESS: 0x30,
	BALANCE: 0x31,
	ORIGIN: 0x32,
	CALLER: 0x33,
	CALLVALUE: 0x34,
	CALLDATALOAD: 0x35,
	CALLDATASIZE: 0x36,
	CALLDATACOPY: 0x37,
	CODESIZE: 0x38,
	CODECOPY: 0x39,
	GASPRICE: 0x3a,
	EXTCODESIZE: 0x3b,
	EXTCODECOPY: 0x3c,
	RETURNDATASIZE: 0x3d,
	RETURNDATACOPY: 0x3e,
	EXTCODEHASH: 0x3f,
	BLOCKHASH: 0x40,
	COINBASE: 0x41,
	TIMESTAMP: 0x42,
	NUMBER: 0x43,
	PREVRANDAO: 0x44,
	DIFFICULTY: 0x44,
	GASLIMIT: 0x45,
	CHAINID: 0x46,
	SELFBALANCE: 0x47,
	BASEFEE: 0x48,
	BLOBHASH: 0x49,
	BLOBBASEFEE: 0x4a,
	POP: 0x50,
	MLOAD: 0x51,
	MSTORE: 0x52,
	MSTORE8: 0x53,
	SLOAD: 0x54,
	SSTORE: 0x55,
	JUMP: 0x56,
	JUMPI: 0x57,
	PC: 0x58,
	MSIZE: 0x59,
	GAS: 0x5a,
	JUMPDEST: 0x5b,
	TLOAD: 0x5c,
	TSTORE: 0x5d,
	MCOPY: 0x5e,
	PUSH0: 0x5f,
	CREATE: 0xf0,
	CALL: 0xf1,
	CALLCODE: 0xf2,
	RETURN: 0xf3,
	DELEGATECALL: 0xf4,
	CREATE2: 0xf5,
	AUTH: 0xf6,
	AUTHCALL: 0xf7,
	STATICCALL: 0xfa,
	REVERT: 0xfd,
	INVALID: 0xfe,
	SELFDESTRUCT: 0xff,
}

const OPCODE_NAMES = new Map(Object.entries(STATIC_OPCODES).map(([name, code]) => [code, name]))
OPCODE_NAMES.set(0x20, 'KECCAK256')
OPCODE_NAMES.set(0x44, 'PREVRANDAO')

const parseArgs = (argv) => {
	const args = [...argv]
	const command = args[0]?.startsWith('--') ? 'convert' : (args.shift() ?? 'help')
	const flags = new Map()
	for (const arg of args) {
		if (!arg.startsWith('--')) continue
		const [key, ...rest] = arg.split('=')
		flags.set(key, rest.length === 0 ? 'true' : rest.join('='))
	}
	return { command, flags }
}

const mkdirForFile = (file) => {
	if (file) mkdirSync(dirname(file), { recursive: true })
}

const normalizeHexNumber = (value, fallback = '0x0') => {
	if (value === undefined || value === null) return fallback
	if (typeof value === 'bigint') return `0x${value.toString(16)}`
	if (typeof value === 'number') return `0x${BigInt(value).toString(16)}`
	if (typeof value === 'string') {
		if (value.startsWith('0x')) {
			const normalized = value.toLowerCase().replace(/^0x0+(?=[0-9a-f])/, '0x')
			return normalized === '0x' ? '0x0' : normalized
		}
		return `0x${BigInt(value).toString(16)}`
	}
	return fallback
}

const normalizeHexData = (value, fallback = '0x') => {
	if (value === undefined || value === null) return fallback
	if (Array.isArray(value)) return `0x${value.map((chunk) => normalizeHexData(chunk).slice(2)).join('')}`
	if (typeof value === 'string') return value.startsWith('0x') ? value.toLowerCase() : `0x${value.toLowerCase()}`
	return fallback
}

const byteLength = (hex) => (hex === '0x' ? 0 : (hex.length - 2) / 2)

const opcodeNumber = (opName) => {
	if (typeof opName !== 'string') return undefined
	const upper = opName.toUpperCase()
	const push = /^PUSH([0-9]+)$/.exec(upper)
	if (push) return 0x5f + Number(push[1])
	const dup = /^DUP([0-9]+)$/.exec(upper)
	if (dup) return 0x7f + Number(dup[1])
	const swap = /^SWAP([0-9]+)$/.exec(upper)
	if (swap) return 0x8f + Number(swap[1])
	const log = /^LOG([0-4])$/.exec(upper)
	if (log) return 0xa0 + Number(log[1])
	return STATIC_OPCODES[upper]
}

const opcodeName = (op) => {
	if (typeof op === 'string' && Number.isFinite(Number(op))) return opcodeName(Number(op))
	if (typeof op !== 'number') return undefined
	if (op >= 0x60 && op <= 0x7f) return `PUSH${op - 0x5f}`
	if (op >= 0x80 && op <= 0x8f) return `DUP${op - 0x7f}`
	if (op >= 0x90 && op <= 0x9f) return `SWAP${op - 0x8f}`
	if (op >= 0xa0 && op <= 0xa4) return `LOG${op - 0xa0}`
	return OPCODE_NAMES.get(op)
}

const isNumericString = (value) => typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))

const readTraceDocument = (file) => {
	const text = readFileSync(file, 'utf8').trim()
	if (text.length === 0) return []
	try {
		return JSON.parse(text)
	} catch {
		return text
			.split(/\r?\n/)
			.filter(Boolean)
			.map((line) => JSON.parse(line))
	}
}

const extractTrace = (document) => {
	if (Array.isArray(document)) {
		const steps = document.filter((item) => item && typeof item === 'object' && 'pc' in item)
		const summary = document.findLast?.((item) => item && typeof item === 'object' && !('pc' in item)) ?? null
		return { steps, summary }
	}
	if (!document || typeof document !== 'object') return { steps: [], summary: null }
	if (document.status === 'skipped' || document.coverage === 'none') return { steps: [], summary: document }
	if (Array.isArray(document.traces)) {
		const steps = document.traces.flatMap((trace) => {
			if (trace && typeof trace === 'object' && 'pc' in trace) return [trace]
			if (trace?.trace?.structLogs) return trace.trace.structLogs
			if (trace?.structLogs) return trace.structLogs
			return []
		})
		return { steps, summary: document.summary ?? null }
	}
	if (Array.isArray(document.steps)) return { steps: document.steps, summary: document.summary ?? null }
	if (document.result?.structLogs) return { steps: document.result.structLogs, summary: document.result }
	if (document.trace?.structLogs) return { steps: document.trace.structLogs, summary: document.trace }
	if (document.structLogs) return { steps: document.structLogs, summary: document }
	if ('pc' in document) return { steps: [document], summary: null }
	return { steps: [], summary: document.summary ?? document }
}

export const normalizeTraceStep = (step) => {
	const opName = String(
		step.opName ?? (typeof step.op === 'string' && !isNumericString(step.op) ? step.op : opcodeName(step.op)) ?? '',
	).toUpperCase()
	const op = typeof step.op === 'number' || isNumericString(step.op) ? Number(step.op) : opcodeNumber(opName)
	if (op === undefined) throw new Error(`Unable to map opcode ${String(step.op ?? step.opName)}`)
	const canonicalOpName = opcodeName(op)
	const memory = step.memory === undefined ? undefined : normalizeHexData(step.memory)
	const output = {
		pc: Number(step.pc ?? 0),
		op,
		gas: normalizeHexNumber(step.gas),
		gasCost: normalizeHexNumber(step.gasCost),
		memSize: Number(step.memSize ?? step.memorySize ?? (memory === undefined ? 0 : byteLength(memory))),
		stack: Array.isArray(step.stack) ? step.stack.map((value) => normalizeHexNumber(value)) : [],
		returnData: normalizeHexData(step.returnData),
		depth: Number(step.depth ?? 0),
		refund: Number(step.refund ?? 0),
		error: step.error === undefined ? null : step.error,
		opName: canonicalOpName ?? opName,
	}
	if (memory !== undefined) output.memory = memory
	if (step.storage !== undefined) output.storage = step.storage
	return output
}

export const normalizeTraceDocument = (document) => {
	const { steps, summary } = extractTrace(document)
	const normalizedSteps = steps.map(normalizeTraceStep)
	const normalizedSummary = {}
	if (summary && typeof summary === 'object') {
		if (summary.stateRoot !== undefined) normalizedSummary.stateRoot = normalizeHexData(summary.stateRoot)
		if (summary.output !== undefined || summary.returnValue !== undefined) {
			normalizedSummary.output = normalizeHexData(summary.output ?? summary.returnValue)
		}
		if (summary.gasUsed !== undefined || summary.gas !== undefined) {
			normalizedSummary.gasUsed = normalizeHexNumber(summary.gasUsed ?? summary.gas)
		}
		if (summary.pass !== undefined || summary.failed !== undefined) {
			normalizedSummary.pass = summary.pass ?? !summary.failed
		}
		if (summary.fork !== undefined) normalizedSummary.fork = String(summary.fork)
	}
	return { steps: normalizedSteps, summary: normalizedSummary }
}

export const readNormalizedTrace = (file) => normalizeTraceDocument(readTraceDocument(file))

const writeTrace = ({ trace, outFile, format }) => {
	const lines = trace.summary && Object.keys(trace.summary).length > 0 ? [...trace.steps, trace.summary] : trace.steps
	mkdirForFile(outFile)
	if (format === 'json') {
		writeFileSync(outFile, JSON.stringify({ format: 'eip3155', traces: trace.steps, summary: trace.summary }, null, 2))
		return
	}
	writeFileSync(outFile, `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`)
}

const firstDivergence = (actual, reference) => {
	const count = Math.max(actual.steps.length, reference.steps.length)
	for (let index = 0; index < count; index++) {
		const actualStep = actual.steps[index]
		const referenceStep = reference.steps[index]
		if (actualStep === undefined || referenceStep === undefined) {
			return { index, field: 'length', actual: actualStep ?? null, reference: referenceStep ?? null }
		}
		for (const field of new Set([...Object.keys(actualStep), ...Object.keys(referenceStep)])) {
			if (JSON.stringify(actualStep[field]) !== JSON.stringify(referenceStep[field])) {
				return { index, field, actual: actualStep[field] ?? null, reference: referenceStep[field] ?? null }
			}
		}
	}
	const actualSummary = actual.summary ?? {}
	const referenceSummary = reference.summary ?? {}
	for (const field of new Set([...Object.keys(actualSummary), ...Object.keys(referenceSummary)])) {
		if (JSON.stringify(actualSummary[field]) !== JSON.stringify(referenceSummary[field])) {
			return { index: 'summary', field, actual: actualSummary[field] ?? null, reference: referenceSummary[field] ?? null }
		}
	}
	return null
}

const hasSummary = (trace) => Object.keys(trace.summary ?? {}).length > 0

export const compareNormalizedTraces = ({ actual, reference }) => {
	const divergence = firstDivergence(actual, reference)
	return {
		format: 'eip3155',
		status: divergence === null ? 'passed' : 'failed',
		comparedSteps: Math.min(actual.steps.length, reference.steps.length),
		actualSteps: actual.steps.length,
		referenceSteps: reference.steps.length,
		firstDivergence: divergence,
	}
}

export const compareTraceFiles = ({ actualFile, referenceFile, outFile, allowMissing = true }) => {
	if (!actualFile || !referenceFile || !existsSync(actualFile) || !existsSync(referenceFile)) {
		const result = {
			format: 'eip3155',
			status: 'skipped',
			coverage: 'none',
			synthetic: false,
			reason: 'Actual or reference EIP-3155 trace file is missing.',
			actualFile: actualFile ?? null,
			referenceFile: referenceFile ?? null,
		}
		if (outFile) {
			mkdirForFile(outFile)
			writeFileSync(outFile, JSON.stringify(result, null, 2))
		}
		if (!allowMissing) throw new Error(result.reason)
		return result
	}
	const actual = readNormalizedTrace(actualFile)
	const reference = readNormalizedTrace(referenceFile)
	if (actual.steps.length === 0 && reference.steps.length === 0 && !hasSummary(actual) && !hasSummary(reference)) {
		const result = {
			format: 'eip3155',
			status: 'skipped',
			coverage: 'none',
			synthetic: false,
			reason: 'Actual or reference trace did not contain EIP-3155 opcode steps.',
			actualFile,
			referenceFile,
			actualSteps: actual.steps.length,
			referenceSteps: reference.steps.length,
		}
		if (outFile) {
			mkdirForFile(outFile)
			writeFileSync(outFile, JSON.stringify(result, null, 2))
		}
		return result
	}
	const result = compareNormalizedTraces({ actual, reference })
	if (outFile) {
		mkdirForFile(outFile)
		writeFileSync(outFile, JSON.stringify(result, null, 2))
	}
	return result
}

export const runCli = (argv = process.argv.slice(2)) => {
	const { command, flags } = parseArgs(argv)
	if (command === 'convert') {
		const input = flags.get('--input')
		const outFile = flags.get('--out')
		const format = flags.get('--format') ?? 'jsonl'
		if (!input || !outFile) throw new Error('convert requires --input and --out')
		writeTrace({ trace: readNormalizedTrace(input), outFile, format })
		console.log(`wrote ${outFile}`)
		return 0
	}
	if (command === 'compare') {
		const result = compareTraceFiles({
			actualFile: flags.get('--actual'),
			referenceFile: flags.get('--reference'),
			outFile: flags.get('--out'),
			allowMissing: flags.get('--require-files') !== 'true',
		})
		if (flags.get('--out')) console.log(`wrote ${flags.get('--out')}`)
		return result.status === 'failed' ? 1 : 0
	}
	console.log('Usage: trace-tools.mjs convert --input=<trace.json> --out=<trace.jsonl> [--format=jsonl|json]')
	console.log('       trace-tools.mjs compare --actual=<trace.jsonl> --reference=<trace.jsonl> --out=<diff.json>')
	return command === 'help' ? 0 : 1
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	try {
		process.exit(runCli())
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error))
		process.exit(1)
	}
}
