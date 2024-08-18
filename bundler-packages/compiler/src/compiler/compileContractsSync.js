import { moduleFactory } from '@tevm/resolutions'
import { solcCompile } from '@tevm/solc'
import { runSync } from 'effect/Effect'
import resolve from 'resolve'
import { invariant } from '../utils/invariant.js'

// TODO we need to update the syncronous version of this function. This is only if we hadn't completed the issue to make the lsp async yet
// TODO we made a breaking change to this function will need to update it's other call sites and update tests
// TODO since there can be more than one sol`` per file we will need to double check the tevm cache can handle that properly
// TODO since we are making this function now publically available in package index.ts we should refactor it to take an object bag rather than ordered args as is standard in all of tevm

/**
 * Compile the Solidity contract and return its ABI.
 *
 * @template TIncludeAsts
 * @template TIncludeBytecode
 * @param {string} source
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
export function compileContractSync(source, filePath, basedir, config, includeAst, includeBytecode, fao, logger, solc) {
	const moduleMap = runSync(
		moduleFactory(
			filePath,
			// TODO: (low priority) I don't want this ?? I'd rather just force the caller to do that themselves consistently
			// TODO do we actually need filePath as an argument? I think so but maybe worth double checking
			source ??
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
			stack.push(/** @type {import("../types.js").ModuleInfo} */ (moduleMap.get(dep)))
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
					...(includeAst ? { '': ['ast'] } : {}),
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
