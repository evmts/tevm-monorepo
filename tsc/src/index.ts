import { type EvmtsConfig, loadConfig } from '@evmts/config'
import type * as ts from 'typescript/lib/tsserverlibrary'
import { state } from './shared'

export type Hook = (program: _Program) => void

export type _Program = ts.Program & { __evmts: ProgramContext }

interface ProgramContext {
	projectVersion: number
	options: ts.CreateProgramOptions
	evmtsOptions: EvmtsConfig
}

const windowsPathReg = /\\/g

export function createProgram(options: ts.CreateProgramOptions) {
	if (!options.options.noEmit && !options.options.emitDeclarationOnly)
		throw toThrow('js emit is not supported')

	if (!options.options.noEmit && options.options.noEmitOnError)
		throw toThrow('noEmitOnError is not supported')

	if (options.options.extendedDiagnostics || options.options.generateTrace)
		throw toThrow(
			'--extendedDiagnostics / --generateTrace is not supported, Please open an issue if you would like this feature supported.',
		)

	if (!options.host) {
		throw toThrow('!options.host')
	}

	const ts =
		require('typescript') as typeof import('typescript/lib/tsserverlibrary')

	let program = options.oldProgram as _Program | undefined

	if (state.hook) {
		program = state.hook.program
		program.__evmts.options = options
	} else if (!program) {
		const ctx: ProgramContext = {
			projectVersion: 0,
			options,
			get evmtsOptions() {
				return compilerOptions
			},
		}
		const compilerOptions = getEvmtsCompilerOptions()
		const scripts = new Map<
			string,
			{
				projectVersion: number
				modifiedTime: number
				scriptSnapshot: ts.IScriptSnapshot
			}
		>()

		if (!ctx.options.host) {
			throw toThrow('No host on context')
		}

		const languageHost = {
			workspacePath: ctx.options.host
				.getCurrentDirectory()
				.replace(windowsPathReg, '/'),
			rootPath: ctx.options.host
				.getCurrentDirectory()
				.replace(windowsPathReg, '/'),
			getCompilationSettings: () => ctx.options.options,
			getScriptFileNames: () => {
				return ctx.options.rootNames as string[]
			},
			getScriptSnapshot,
			getProjectVersion: () => {
				return ctx.projectVersion.toString()
			},
			getProjectReferences: () => ctx.options.projectReferences,
			getCancellationToken: ctx.options.host.getCancellationToken
				? () => {
						if (!ctx.options.host?.getCancellationToken) {
							throw toThrow('No getCancellationToken on host')
						}
						ctx.options.host.getCancellationToken()
				  }
				: undefined,
		}
		const vueTsLs = ts.createLanguageService(
			languageHost,
			compilerOptions,
			ts as any,
		)

		program = vueTs.getProgram(
			ts as any,
			vueTsLs.__internal__.context,
			vueTsLs,
			ts.sys,
		) as ts.Program & { __evmts: ProgramContext }
		program.__evmts = ctx

		function getEvmtsCompilerOptions() {
			const tsConfig = ctx.options.options.configFilePath
			if (typeof tsConfig === 'string') {
				return loadConfig(tsConfig)
			}
			return {}
		}

		function getScriptSnapshot(fileName: string) {
			return getScript(fileName)?.scriptSnapshot
		}
		function getScript(fileName: string) {
			if (!ctx.options.host) {
				throw toThrow('No host on context')
			}
			const script = scripts.get(fileName)
			if (script?.projectVersion === ctx.projectVersion) {
				return script
			}

			const modifiedTime = ts.sys.getModifiedTime?.(fileName)?.valueOf() ?? 0
			if (script?.modifiedTime === modifiedTime) {
				return script
			}

			if (ctx.options.host.fileExists(fileName)) {
				const fileContent = ctx.options.host.readFile(fileName)
				if (fileContent !== undefined) {
					const script = {
						projectVersion: ctx.projectVersion,
						modifiedTime,
						scriptSnapshot: ts.ScriptSnapshot.fromString(fileContent),
						version: ctx.options.host.createHash?.(fileContent) ?? fileContent,
					}
					scripts.set(fileName, script)
					return script
				}
			}
		}
	} else {
		const ctx: ProgramContext = program.__evmts
		ctx.options = options
		ctx.projectVersion++
	}

	for (const rootName of options.rootNames) {
		// register file watchers
		options.host.getSourceFile(rootName, ts.ScriptTarget.ESNext)
	}

	return program
}

function toThrow(msg: string) {
	console.error(msg)
	return msg
}
