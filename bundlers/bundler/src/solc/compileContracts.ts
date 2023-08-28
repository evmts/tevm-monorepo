import { readFileSync } from 'fs'
import type { ResolvedConfig } from '@evmts/config'
import * as resolve from 'resolve'
import { findAll } from 'solidity-ast/utils'
import type { ModuleInfo } from '../types'
import { invariant } from '../utils/invariant'
import { moduleFactory } from './moduleFactory'
import {
	type SolcInputDescription,
	type SolcOutput,
	solcCompile,
} from './solc'

// Compile the Solidity contract and return its ABI
export const compileContractSync = (
	filePath: string,
	basedir: string,
	config: ResolvedConfig['compiler'],
	includeAst: boolean,
): {
	artifacts: SolcOutput['contracts'][string] | undefined
	modules: Record<'string', ModuleInfo>
} => {
	const source: string = readFileSync(
		resolve.sync(filePath, {
			basedir,
		}),
		'utf8',
	)

	const entryModule = moduleFactory(
		filePath,
		source,
		config.remappings,
		config.libs,
	)

	const getAllModulesRecursively = (
		entryModule: ModuleInfo,
	): Record<string, ModuleInfo> => {
		const modules: Record<string, ModuleInfo> = {}
		const stack = [entryModule]

		while (stack.length !== 0) {
			const m = stack.pop()
			// This is always existing because we check the length but need to make TS happy
			invariant(m, 'Module should exist')

			// Continue the loop if this module has already been visited.
			if (m.id in modules) {
				continue
			}

			modules[m.id] = m

			for (const dep of m.resolutions) {
				stack.push(dep)
			}
		}

		return modules
	}
	const allModules = getAllModulesRecursively(entryModule)

	const sources = Object.fromEntries(
		Object.entries(allModules).map(([id, module]) => {
			return [id, { content: module.code as string }]
		}),
	)

	const input: SolcInputDescription = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['abi', 'userdoc'],
					...(includeAst ? { "": ["ast"] } : {}),
				},
			},
		},
	}

	const output = solcCompile(input)

	const warnings = output?.errors?.filter(({ type }) => type === 'Warning')
	const isErrors = (output?.errors?.length ?? 0) > (warnings?.length ?? 0)

	if (isErrors) {
		console.error('Compilation errors:', output?.errors)
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		console.warn('Compilation warnings:', output?.errors)
	}

	const ast =
		output?.sources?.[
			'/Users/willcory/evmts-monorepo/examples/vite/src/contracts/WagmiMintExample.sol'
		]?.ast

	if (ast) {
		for (const functionDef of findAll('FunctionDefinition', ast)) {
			console.log('findAll functionDef', functionDef)
		}
	}

	return { artifacts: output.contracts[entryModule.id], modules: allModules }
}
