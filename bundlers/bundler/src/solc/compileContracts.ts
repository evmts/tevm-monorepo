import type { ResolvedConfig } from '@evmts/config'
import resolve from 'resolve'
import type { Node } from 'solidity-ast/node'
import type { FileAccessObject, ModuleInfo } from '../types'
import { invariant } from '../utils/invariant'
import { moduleFactory } from './moduleFactory'
import { type SolcInputDescription, type SolcOutput, solcCompile } from './solc'

// Compile the Solidity contract and return its ABI
export const compileContract = async <TIncludeAsts = boolean>(
	filePath: string,
	basedir: string,
	config: ResolvedConfig['compiler'],
	includeAst: TIncludeAsts,
	fao: FileAccessObject,
): Promise<{
	artifacts: SolcOutput['contracts'][string] | undefined
	modules: Record<'string', ModuleInfo>
	asts: TIncludeAsts extends true ? Record<string, Node> : undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}> => {
	const entryModule = await moduleFactory(
		filePath,
		await fao.readFile(
			await new Promise<string>((promiseResolve, promiseReject) =>
				resolve(filePath, {
					basedir,
					readFile: (file) => fao.readFile(file, 'utf8'),
					isFile: fao.existsSync
				}, (err, res) => {
					if (err) {
						promiseReject(err)
					} else {
						promiseResolve(res as string)
					}

				})),
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
	return {
		artifacts: output.contracts[entryModule.id],
		modules,
		asts: undefined as any,
		solcInput: input,
		solcOutput: output,
	}
}
