import { invariant } from '../utils/invariant'
import { resolveEffect } from '../utils/resolvePromise'
import { moduleFactory } from './moduleFactory'
import { solcCompile } from './solc'
import { Effect } from 'effect'

/**
 * Compile the Solidity contract and return its ABI.
 * 
 * @template TIncludeAsts
 * @param {string} filePath
 * @param {string} basedir
 * @param {import('@evmts/config').ResolvedCompilerConfig} config
 * @param {TIncludeAsts} includeAst
 * @param {import('../types').FileAccessObject} fao
 * @param {import('../types').Logger} logger
 * @param {import('../createCache').Cache} [cache]
 * @returns {Promise<import('../types').CompiledContracts<TIncludeAsts>>}
 * @example
 * const { artifacts, modules } = await compileContract(
 *   './contracts/MyContract.sol',
 *   __dirname,
 *   config,
 *   true,
 *   await import('fs'),
 *   logger,
 *   cache,
 * )
 */
export const compileContract = async (
	filePath,
	basedir,
	config,
	includeAst,
	fao,
	logger,
	cache,
) => {
	const entryModule = await moduleFactory(
		filePath,
		await fao
			.readFile(
				await Effect.runPromise(resolveEffect(filePath, basedir, fao, logger)),
				'utf8',
			)
			.then((code) => {
				return code
			}),
		config.remappings,
		config.libs,
		fao,
	)

	/** 
 * @type {Object.<string, import('../types').ModuleInfo>}
 */
	const modules = {};

	const stack = [entryModule]
	while (stack.length !== 0) {
		const m = stack.pop()
		invariant(m, 'Module should exist')
		if (m.id in modules) {
			continue
		}
		modules[m.id] = m
		for (const dep of m.resolutions) {
			stack.push(dep)
		}
	}

	const sources = Object.fromEntries(
		Object.entries(modules).map(([id, module]) => {
			return [id, {
				content:
					/** @type {string} */
					(module.code)
			}];
		}),
	)

	const emptyString = ''
	/**
	 * @type {import('./solc').SolcInputDescription}
	 */
	const input = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['abi', 'userdoc'],
					...(includeAst ? { [emptyString]: ['ast'] } : {}),
				},
			},
		},
	}

	const output = cache?.isCached(entryModule.id, sources)
		? cache.read(entryModule.id)
		: solcCompile(input)

	cache?.write(entryModule.id, output)

	const warnings = output?.errors?.filter(({ type }) => type === 'Warning')
	const isErrors = (output?.errors?.length ?? 0) > (warnings?.length ?? 0)

	if (isErrors) {
		logger.error('Compilation errors:')
		logger.error(/** @type {any} */(output?.errors))
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		logger.warn(/** @type {any} */(warnings))
		logger.warn('Compilation warnings:')
	}

	if (includeAst) {
		const asts = Object.fromEntries(
			Object.entries(output.sources).map(([id, source]) => {
				return [id, source.ast]
			}),
		)
		return {
			artifacts: output.contracts[entryModule.id],
			modules:/** @type {any} */(modules),
			asts: /** @type {any} */(asts),
			solcInput: input,
			solcOutput: output,
		}
	}
	return {
		artifacts: output.contracts[entryModule.id],
		modules: /** @type {any} */(modules),
		asts: /** @type {any} */(undefined),
		solcInput: input,
		solcOutput: output,
	}
}
