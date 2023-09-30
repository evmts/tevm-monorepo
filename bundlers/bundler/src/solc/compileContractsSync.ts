import { readCache } from '../cache'
import type { Cache, FileAccessObject, Logger, ModuleInfo } from '../types'
import { invariant } from '../utils/invariant'
import { moduleFactorySync } from './moduleFactorySync'
import { type SolcInputDescription, type SolcOutput, solcCompile } from './solc'
import type { ResolvedCompilerConfig } from '@evmts/config'
import * as resolve from 'resolve'
import type { Node } from 'solidity-ast/node'

// Compile the Solidity contract and return its ABI
export const compileContractSync = <TIncludeAsts extends boolean = boolean>(
	filePath: string,
	basedir: string,
	config: ResolvedCompilerConfig,
	includeAst: TIncludeAsts,
	fao: FileAccessObject,
	logger: Logger,
	cache?: Cache<TIncludeAsts>,
): {
	artifacts: SolcOutput['contracts'][string] | undefined
	modules: Record<'string', ModuleInfo>
	asts: TIncludeAsts extends true ? Record<string, Node> : undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
} => {
	const entryModule = moduleFactorySync(
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
	)

	const modules: Record<string, ModuleInfo> = {}

	// Get modules by recursively resolving dependencies
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
			return [id, { content: module.code as string }]
		}),
	)

	const emptyString = ''
	const input: SolcInputDescription = {
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

	const cachedOutput = cache && readCache(cache, entryModule.id, sources)
	const output = cachedOutput ?? solcCompile(input)

	const warnings = output?.errors?.filter(({ type }) => type === 'Warning')
	const isErrors = (output?.errors?.length ?? 0) > (warnings?.length ?? 0)

	if (isErrors) {
		logger.error('Compilation errors:', output?.errors as any)
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		logger.warn('Compilation warnings:', output?.errors as any)
	}
	if (includeAst) {
		const asts = Object.fromEntries(
			Object.entries(output.sources).map(([id, source]) => {
				return [id, source.ast]
			}),
		)
		return {
			artifacts: output.contracts[entryModule.id],
			modules,
			asts: asts as any,
			solcInput: input,
			solcOutput: output,
		}
	}

	const out = {
		artifacts: output.contracts[entryModule.id],
		modules,
		asts: undefined as any,
		solcInput: input,
		solcOutput: output,
	}

	if (cache) {
		cache[entryModule.id] = out
	}

	return out
}
