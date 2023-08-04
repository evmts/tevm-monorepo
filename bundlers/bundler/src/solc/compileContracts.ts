import type { ModuleInfo } from '../types'
import { invariant } from '../utils/invariant'
import { moduleFactory } from './moduleFactory'
import type { ResolvedConfig } from '@evmts/config'
import { readFileSync } from 'fs'
import * as resolve from 'resolve'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

// Compile the Solidity contract and return its ABI and bytecode
export const compileContractSync = (
	filePath: string,
	basedir: string,
	config: ResolvedConfig['compiler'],
): {
	artifacts: solc.CompiledContract | undefined
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
			return [id, { content: module.code }]
		}),
	)

	const input: solc.InputDescription = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
		},
	}

	const output: solc.OutputDescription = JSON.parse(
		solc.compile(JSON.stringify(input)),
	)

	const warnings = output?.errors?.filter(
		({ type }: { type: 'Warning' | 'Error' }) => type === 'Warning',
	)
	const isErrors = output?.errors?.length > warnings?.length

	if (isErrors) {
		console.error('Compilation errors:', output?.errors)
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		console.warn('Compilation warnings:', output?.errors)
	}

	return { artifacts: output.contracts[entryModule.id], modules: allModules }
}
