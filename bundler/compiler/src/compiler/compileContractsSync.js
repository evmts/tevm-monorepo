import { invariant } from '../utils/invariant.js'
import { moduleFactory } from '@tevm/resolutions'
import { solcCompile } from '@tevm/solc'
import { runSync } from 'effect/Effect'
import resolve from 'resolve'

/**
 * Compile the Solidity contract and return its ABI.
 *
 * @template TIncludeAsts
 * @template TIncludeBytecode
 * @param {string} filePath
 * @param {string} basedir
 * @param {import('@tevm/config').ResolvedCompilerConfig} config
 * @param {TIncludeAsts} includeAst
 * @param {TIncludeBytecode} includeBytecode
 * @param {import('../types.js').FileAccessObject} fao
 * @param {import('../types.js').Logger} logger
 * @param {any} solc
 * @returns {import('../types.js').CompiledContracts}
 * @example
 * const { artifacts, modules } = compileContractSync(
 *  './contracts/MyContract.sol',
 *  __dirname,
 *  config,
 *  true,
 *  await import('fs'),
 *  logger,
 *  )
 */
export function compileContractSync(
	filePath,
	basedir,
	config,
	includeAst,
	includeBytecode,
	fao,
	logger,
	solc,
) {
	const moduleMap = runSync(
		moduleFactory(
			filePath,
			fao.readFileSync(
				resolve.sync(filePath, {
					basedir,
					readFileSync: (file) => fao.readFileSync(file, 'utf8'),
					isFile: fao.existsSync,
				}),
				'utf8',
			),
			config.remappings,
			config.libs,
			fao,
			true,
		),
	)
	const entryModule = moduleMap.get(filePath)
	invariant(entryModule, 'Entry module should exist')

	/** @type {Record<string, import('../types.js').ModuleInfo>} */
	const modules = {}

	const stack = [entryModule]
	while (stack.length !== 0) {
		const m = stack.pop()
		invariant(m, 'Module should exist')
		if (m.id in modules) {
			continue
		}
		modules[m.id] = m
		for (const dep of m.importedIds) {
			stack.push(
				/** @type {import("../types.js").ModuleInfo} */ (moduleMap.get(dep)),
			)
		}
	}

	const sources = Object.fromEntries(
		Object.entries(modules).map(([id, module]) => {
			const code =
				/** @type {string} */
				(module.code)
			return [id, { content: code }]
		}),
	)

	/**
	 * @type {['evm.bytecode.object', 'evm.deployedBytecode.object']}
	 */
	const evmBytecode = ['evm.bytecode.object', 'evm.deployedBytecode.object']
	/**
	 * @type {import('@tevm/solc').SolcInputDescription}
	 */
	const solcInput = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['abi', 'userdoc', ...(includeBytecode ? evmBytecode : [])],
					...(includeAst ? { ['']: ['ast'] } : {}),
				},
			},
		},
	}
	/**
	 * @type {import('@tevm/solc').SolcOutput}
	 */
	const solcOutput = solcCompile(solc, solcInput)

	const warnings = solcOutput?.errors?.filter(({ type }) => type === 'Warning')
	const isErrors = (solcOutput?.errors?.length ?? 0) > (warnings?.length ?? 0)

	if (isErrors) {
		logger.error('Compilation errors:', /** @type {any}*/ (solcOutput?.errors))
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		logger.warn('Compilation warnings:', /** @type {any}*/ (solcOutput?.errors))
	}

	if (includeAst) {
		const asts = Object.fromEntries(
			Object.entries(solcOutput.sources).map(([id, source]) => {
				return [id, source.ast]
			}),
		)
		return {
			artifacts: solcOutput.contracts[entryModule.id],
			modules,
			asts,
			solcInput,
			solcOutput: solcOutput,
		}
	}
	return {
		artifacts: solcOutput.contracts[entryModule.id],
		modules,
		asts: undefined,
		solcInput: solcInput,
		solcOutput: solcOutput,
	}
}
