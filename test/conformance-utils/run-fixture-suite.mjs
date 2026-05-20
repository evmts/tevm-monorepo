#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { Rlp } from '@evmts/zevm/rlp'
import { Trie } from '@evmts/zevm/trie'
import {
	createAccessList2930Tx,
	createFeeMarket1559Tx,
	createLegacyTx,
	createTx,
	TransactionType,
} from '@evmts/zevm/tx'
import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { createCommon, mainnet } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { bytesToHex, hexToBytes, keccak256, numberToHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { compareTraceFiles } from '../eip3155/trace-tools.mjs'
import { isHardforkSelected, normalizeHardfork } from './hardforks.mjs'

const EMPTY_TRIE_ROOT = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
const EMPTY_CODE_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

const args = new Map(
	process.argv.slice(2).map((arg) => {
		const [k, ...rest] = arg.split('=')
		return [k, rest.join('=') || 'true']
	}),
)

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
const limit = args.has('--limit') ? Number(args.get('--limit')) : undefined

const mkdirForFile = (file) => mkdirSync(dirname(file), { recursive: true })

const writeJson = (file, value) => {
	mkdirForFile(file)
	writeFileSync(file, `${JSON.stringify(value, jsonReplacer, 2)}\n`)
}

const jsonReplacer = (_key, value) => (typeof value === 'bigint' ? numberToHex(value) : value)

const skippedSummary = (reason) => ({
	suite,
	status: 'skipped',
	coverage: 'none',
	synthetic: false,
	reason,
	requiredInput:
		'Provide real upstream ethereum/tests or execution-spec-tests JSON fixtures using TEVM_GENERAL_STATE_TESTS_FIXTURES or TEVM_EXECUTION_SPEC_TESTS_FIXTURES.',
	total: 0,
	passed: 0,
	failed: 0,
	skipped: 0,
	filters: { hardfork: hardfork ?? null, group: group ?? null, pattern: pattern ?? null, limit: limit ?? null },
	isolate: isolate ?? null,
	traceCompare,
	generatedAt: new Date().toISOString(),
	results: [],
})

const failedInputSummary = (reason) => ({
	...skippedSummary(reason),
	status: 'failed',
})

const normalizeHex = (value, fallback = '0x0') => {
	if (value === undefined || value === null || value === '') return fallback
	if (typeof value === 'bigint') return `0x${value.toString(16)}`
	if (typeof value === 'number') return `0x${BigInt(value).toString(16)}`
	if (typeof value === 'string') {
		const hex = value.startsWith('0x') ? value : `0x${value}`
		const normalized = hex.toLowerCase().replace(/^0x0+(?=[0-9a-f])/, '0x')
		return normalized === '0x' ? '0x0' : normalized
	}
	return fallback
}

const normalizeDataHex = (value, fallback = '0x') => {
	if (value === undefined || value === null || value === '') return fallback
	if (typeof value !== 'string') return fallback
	return value.startsWith('0x') ? value.toLowerCase() : `0x${value.toLowerCase()}`
}

const toBigInt = (value) => BigInt(normalizeHex(value))

const hexToMinimalBytes = (value) => {
	const bigint = toBigInt(value)
	if (bigint === 0n) return new Uint8Array()
	const hex = bigint.toString(16)
	return hexToBytes(`0x${hex.length % 2 === 0 ? hex : `0${hex}`}`)
}

const pad32 = (value) => {
	const hex = normalizeHex(value)
	return `0x${hex.slice(2).padStart(64, '0')}`
}

const padAddress = (value) => {
	const hex = normalizeDataHex(value)
	return `0x${hex.slice(2).padStart(40, '0')}`
}

const commonHardfork = (value) => {
	const key = String(value ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '')
	const aliases = {
		frontier: 'chainstart',
		chainstart: 'chainstart',
		homestead: 'homestead',
		dao: 'dao',
		eip150: 'tangerineWhistle',
		tangerinewhistle: 'tangerineWhistle',
		eip158: 'spuriousDragon',
		spuriousdragon: 'spuriousDragon',
		byzantium: 'byzantium',
		constantinople: 'constantinople',
		constantinoplefix: 'petersburg',
		petersburg: 'petersburg',
		istanbul: 'istanbul',
		muirglacier: 'muirGlacier',
		berlin: 'berlin',
		london: 'london',
		arrowglacier: 'arrowGlacier',
		grayglacier: 'grayGlacier',
		mergeforkidtransition: 'mergeNetsplitBlock',
		merge: 'paris',
		paris: 'paris',
		shanghai: 'shanghai',
		cancun: 'cancun',
		prague: 'prague',
		osaka: 'osaka',
	}
	return aliases[key] ?? normalizeHardfork(value)
}

const fixtureFiles = (path) => {
	const stat = statSync(path)
	if (stat.isFile()) return [path]
	const files = []
	for (const entry of readdirSync(path)) {
		const full = join(path, entry)
		const child = statSync(full)
		if (child.isDirectory()) files.push(...fixtureFiles(full))
		else if (entry.endsWith('.json')) files.push(full)
	}
	return files.sort()
}

const postVectors = (document, file, rootDir) => {
	const vectors = []
	for (const [name, test] of Object.entries(document)) {
		if (!test || typeof test !== 'object' || !test.pre || !test.transaction || !test.post) continue
		for (const [fixtureHardfork, posts] of Object.entries(test.post)) {
			if (!Array.isArray(posts)) continue
			for (const [postIndex, post] of posts.entries()) {
				const id = `${relative(rootDir, file)}:${name}:${fixtureHardfork}:${postIndex}`
				vectors.push({
					id,
					name,
					file,
					hardfork: fixtureHardfork,
					env: test.env ?? {},
					pre: test.pre,
					transaction: test.transaction,
					post,
					postIndex,
				})
			}
		}
	}
	return vectors
}

const loadVectors = (path) => {
	const rootDir = statSync(path).isDirectory() ? path : dirname(path)
	const vectors = []
	for (const file of fixtureFiles(path)) {
		const document = JSON.parse(readFileSync(file, 'utf8'))
		vectors.push(...postVectors(document, file, rootDir))
	}
	return vectors
}

const vectorMatches = (vector) => {
	const id = vector.id.toLowerCase()
	if (isolate && vector.id !== isolate && vector.name !== isolate && !id.includes(isolate.toLowerCase())) return false
	if (hardfork && !isHardforkSelected(vector.hardfork, hardfork)) return false
	if (pattern && !id.includes(pattern.toLowerCase())) return false
	if (group && !id.includes(group.toLowerCase())) return false
	return true
}

const accountToTevm = ([address, account]) => {
	const code = normalizeDataHex(account.code)
	const storage = Object.fromEntries(
		Object.entries(account.storage ?? {})
			.filter(([, value]) => toBigInt(value) !== 0n)
			.map(([key, value]) => [pad32(key), normalizeHex(value)]),
	)
	return [
		padAddress(address),
		{
			nonce: toBigInt(account.nonce ?? '0x0'),
			balance: toBigInt(account.balance ?? '0x0'),
			storageRoot: EMPTY_TRIE_ROOT,
			codeHash: code === '0x' ? EMPTY_CODE_HASH : keccak256(hexToBytes(code)),
			storage,
			...(code !== '0x' ? { deployedBytecode: code } : {}),
		},
	]
}

const makeState = (pre) => Object.fromEntries(Object.entries(pre).map(accountToTevm))

const makeCommon = (fork) =>
	createCommon({
		...mainnet,
		hardfork: commonHardfork(fork),
		loggingLevel: 'warn',
	})

const makeBlock = (env, common) => {
	const isPoS = common.ethjsCommon.gteHardfork('paris')
	return Block.fromBlockData(
		{
			header: {
				parentHash: normalizeDataHex(env.previousHash, `0x${'00'.repeat(32)}`),
				coinbase: padAddress(env.currentCoinbase ?? `0x${'00'.repeat(20)}`),
				difficulty: isPoS ? 0n : toBigInt(env.currentDifficulty ?? '0x0'),
				gasLimit: toBigInt(env.currentGasLimit ?? '0x1fffffffffffff'),
				number: toBigInt(env.currentNumber ?? '0x0'),
				timestamp: toBigInt(env.currentTimestamp ?? '0x0'),
				baseFeePerGas: toBigInt(env.currentBaseFee ?? '0x0'),
				mixHash: normalizeDataHex(env.currentRandom, `0x${'00'.repeat(32)}`),
			},
		},
		{ common },
	)
}

const indexed = (values, index, fallback) => {
	if (!Array.isArray(values)) return fallback
	const value = values[Number(index ?? 0)]
	return value === undefined ? fallback : value
}

const normalizeAccessList = (accessList) => {
	if (!Array.isArray(accessList)) return []
	return accessList.map((item) => {
		if (Array.isArray(item)) return [padAddress(item[0]), item[1]?.map(pad32) ?? []]
		return {
			address: padAddress(item.address),
			storageKeys: (item.storageKeys ?? []).map(pad32),
		}
	})
}

const makeTx = (transaction, post, common) => {
	const indexes = post.indexes ?? {}
	const data = normalizeDataHex(indexed(transaction.data, indexes.data, '0x'))
	const gasLimit = toBigInt(indexed(transaction.gasLimit, indexes.gas, '0x0'))
	const value = toBigInt(indexed(transaction.value, indexes.value, '0x0'))
	const to = transaction.to === '' ? undefined : padAddress(transaction.to)
	const base = {
		nonce: toBigInt(transaction.nonce ?? '0x0'),
		gasLimit,
		to,
		value,
		data,
	}
	const opts = { common: common.ethjsCommon }
	const privateKey = hexToBytes(normalizeDataHex(transaction.secretKey))
	if (transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined) {
		const tx = createFeeMarket1559Tx(
			{
				...base,
				type: TransactionType.FeeMarketEIP1559,
				maxFeePerGas: toBigInt(transaction.maxFeePerGas ?? transaction.gasPrice ?? '0x0'),
				maxPriorityFeePerGas: toBigInt(transaction.maxPriorityFeePerGas ?? transaction.gasPrice ?? '0x0'),
				accessList: normalizeAccessList(indexed(transaction.accessLists, indexes.accessList, [])),
			},
			opts,
		)
		return tx.sign(privateKey)
	}
	if (transaction.accessLists !== undefined) {
		const tx = createAccessList2930Tx(
			{
				...base,
				type: TransactionType.AccessListEIP2930,
				gasPrice: toBigInt(transaction.gasPrice ?? '0x0'),
				accessList: normalizeAccessList(indexed(transaction.accessLists, indexes.accessList, [])),
			},
			opts,
		)
		return tx.sign(privateKey)
	}
	const type = transaction.type === undefined ? undefined : Number(toBigInt(transaction.type))
	const txData = {
		...base,
		...(type !== undefined ? { type } : {}),
		gasPrice: toBigInt(transaction.gasPrice ?? '0x0'),
	}
	const tx = type === undefined ? createLegacyTx(txData, opts) : createTx(txData, opts)
	return tx.sign(privateKey)
}

const putTrie = async (trie, key, value) => {
	await trie.put(hexToBytes(keccak256(hexToBytes(key))), value)
}

const storageRoot = async (storage = {}) => {
	const trie = new Trie()
	for (const [key, value] of Object.entries(storage)) {
		const bytes = hexToMinimalBytes(value)
		if (bytes.length > 0) await putTrie(trie, pad32(key), Rlp.encode(bytes))
	}
	return bytesToHex(await trie.root())
}

const isEmptyAccount = (account, root, codeHash) =>
	BigInt(account.nonce ?? 0n) === 0n &&
	BigInt(account.balance ?? 0n) === 0n &&
	root === EMPTY_TRIE_ROOT &&
	codeHash === EMPTY_CODE_HASH

const stateRoot = async (state) => {
	const trie = new Trie()
	for (const [address, account] of Object.entries(state).sort(([a], [b]) => a.localeCompare(b))) {
		const root = await storageRoot(account.storage)
		const codeHash =
			account.deployedBytecode !== undefined ? keccak256(hexToBytes(account.deployedBytecode)) : account.codeHash
		if (isEmptyAccount(account, root, codeHash)) continue
		const encoded = Rlp.encode([
			hexToMinimalBytes(account.nonce),
			hexToMinimalBytes(account.balance),
			hexToBytes(root),
			hexToBytes(codeHash),
		])
		await putTrie(trie, address, encoded)
	}
	return bytesToHex(await trie.root())
}

const logsHash = (logs) => keccak256(Rlp.encode(logs.map((log) => [log[0], log[1], log[2]])))

const traceCollector = (vm) => {
	const trace = { structLogs: [], gas: 0n, returnValue: '0x', failed: false }
	const onStep = (step, next) => {
		trace.structLogs.push({
			pc: step.pc,
			op: step.opcode.name,
			gasCost: BigInt(step.opcode.fee) + (step.opcode.dynamicFee ?? 0n),
			gas: step.gasLeft,
			depth: step.depth,
			stack: step.stack.map((value) => numberToHex(value)),
		})
		next?.()
	}
	const onAfterMessage = (data, next) => {
		if (data.execResult.exceptionError && trace.structLogs.length > 0) {
			trace.structLogs[trace.structLogs.length - 1].error = String(data.execResult.exceptionError)
		}
		next?.()
	}
	vm.evm.events?.on('step', onStep)
	vm.evm.events?.on('afterMessage', onAfterMessage)
	return {
		trace,
		detach: () => {
			vm.evm.events?.off('step', onStep)
			vm.evm.events?.off('afterMessage', onAfterMessage)
		},
	}
}

const runVector = async (vector, shouldTrace) => {
	const common = makeCommon(vector.hardfork)
	const stateManager = createStateManager({ genesisState: makeState(vector.pre), loggingLevel: 'warn' })
	await stateManager.ready()
	const blockchain = await createChain({ common })
	const evm = await createEvm({ common, stateManager, blockchain })
	const vm = createVm({ common, evm, stateManager, blockchain, activatePrecompiles: false })
	const block = makeBlock(vector.env, common)
	const tx = makeTx(vector.transaction, vector.post, common)
	const collector = shouldTrace ? traceCollector(vm) : undefined
	try {
		const runTxResult = await vm.runTx({ tx, block })
		if (collector) {
			collector.trace.gas = runTxResult.execResult.executionGasUsed
			collector.trace.failed = runTxResult.execResult.exceptionError !== undefined
			collector.trace.returnValue = bytesToHex(runTxResult.execResult.returnValue)
		}
		const dumped = await vm.stateManager.dumpCanonicalGenesis()
		const actualStateRoot = await stateRoot(dumped)
		const actualLogsHash = logsHash(runTxResult.execResult.logs ?? [])
		const expectedStateRoot = normalizeDataHex(vector.post.hash)
		const expectedLogsHash = normalizeDataHex(vector.post.logs, actualLogsHash)
		const failures = []
		if (expectedStateRoot !== actualStateRoot) failures.push('stateRoot')
		if (expectedLogsHash !== actualLogsHash) failures.push('logs')
		return {
			id: vector.id,
			name: vector.name,
			hardfork: vector.hardfork,
			status: failures.length === 0 ? 'passed' : 'failed',
			failures,
			expected: { stateRoot: expectedStateRoot, logs: expectedLogsHash },
			actual: { stateRoot: actualStateRoot, logs: actualLogsHash },
			gasUsed: runTxResult.totalGasSpent,
			trace: collector?.trace,
		}
	} catch (error) {
		return {
			id: vector.id,
			name: vector.name,
			hardfork: vector.hardfork,
			status: 'failed',
			failures: ['exception'],
			error: error instanceof Error ? error.message : String(error),
			trace: collector?.trace,
		}
	} finally {
		collector?.detach()
		vm.evm.events?.removeAllListeners()
	}
}

const main = async () => {
	if (!fixturesPath || !existsSync(fixturesPath)) {
		const summary = failedInputSummary(
			fixturesPath
				? `Configured upstream fixture path does not exist: ${fixturesPath}`
				: 'No upstream fixture corpus configured.',
		)
		if (traceOutFile) writeJson(traceOutFile, { suite, status: summary.status, traces: [] })
		if (traceCompare) {
			summary.traceDiff = compareTraceFiles({
				actualFile: traceOutFile,
				referenceFile: traceReferenceFile,
				outFile: traceDiffOutFile,
			})
		}
		writeJson(outFile, summary)
		console.error(`${suite} failed: ${summary.reason}`)
		return 1
	}

	const vectors = loadVectors(fixturesPath).filter(vectorMatches)
	const selected = limit === undefined ? vectors : vectors.slice(0, limit)
	if (selected.length === 0) {
		const summary = skippedSummary('No executable upstream-format GeneralStateTest vectors matched the filters.')
		summary.status = 'unsupported'
		summary.coverage = 'none'
		writeJson(outFile, summary)
		console.error(`${suite} unsupported: ${summary.reason}`)
		return 1
	}

	const results = []
	const traces = []
	for (const vector of selected) {
		const result = await runVector(
			vector,
			Boolean(traceOutFile) && (!isolate || vector.id === isolate || vector.name === isolate),
		)
		if (result.trace) traces.push({ id: result.id, hardfork: result.hardfork, trace: result.trace })
		const { trace: _, ...withoutTrace } = result
		results.push(withoutTrace)
	}

	if (traceOutFile) writeJson(traceOutFile, { suite, status: 'completed', synthetic: false, traces })

	const failed = results.filter((result) => result.status === 'failed').length
	const summary = {
		suite,
		status: failed === 0 ? 'passed' : 'failed',
		coverage: 'upstream',
		synthetic: false,
		fixturesPath,
		total: results.length,
		passed: results.length - failed,
		failed,
		skipped: 0,
		filters: { hardfork: hardfork ?? null, group: group ?? null, pattern: pattern ?? null, limit: limit ?? null },
		isolate: isolate ?? null,
		traceCompare,
		generatedAt: new Date().toISOString(),
		results,
	}
	if (traceCompare) {
		summary.traceDiff = compareTraceFiles({
			actualFile: traceOutFile,
			referenceFile: traceReferenceFile,
			outFile: traceDiffOutFile,
		})
	}
	writeJson(outFile, summary)
	console.log(`${suite} ${summary.status}: ${summary.passed}/${summary.total} upstream vectors passed`)
	return failed === 0 ? 0 : 1
}

main()
	.then((code) => process.exit(code))
	.catch((error) => {
		const summary = skippedSummary('Unexpected conformance runner error.')
		summary.status = 'failed'
		summary.error = error instanceof Error ? error.stack || error.message : String(error)
		writeJson(outFile, summary)
		console.error(summary.error)
		process.exit(1)
	})
