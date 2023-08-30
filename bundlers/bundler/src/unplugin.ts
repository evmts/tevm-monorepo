import * as packageJson from '../package.json'
import { bundler } from './bundler'
import { type ResolvedConfig, loadConfig } from '@evmts/config'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { type UnpluginFactory, createUnplugin } from 'unplugin'
import { z } from 'zod'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.default('solc')
	.describe('compiler to use.  Defaults to solc')

export type CompilerOption = z.infer<typeof compilerOptionValidator>

const bundlers = {
	solc: bundler,
}

// make a function with this signature
export const unpluginFn: UnpluginFactory<
	{ compiler?: CompilerOption } | undefined,
	false
> = (options = {}) => {
	let config: ResolvedConfig

	// for current release we will hardcode this to solc
	const parsedCompilerOption = compilerOptionValidator.safeParse(
		options.compiler,
	)
	if (!parsedCompilerOption.success) {
		throw new Error(
			`Invalid compiler option: ${options.compiler}.  Valid options are 'solc' and 'foundry'`,
		)
	}
	const compilerOption = parsedCompilerOption.data

	if (compilerOption === 'foundry') {
		throw new Error(
			'We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time.',
		)
	}
	const bundler = bundlers[compilerOption]
	let moduleResolver: ReturnType<typeof bundler>

	return {
		name: '@evmts/rollup-plugin',
		version: packageJson.version,
		async buildStart() {
			config = loadConfig(process.cwd())
			moduleResolver = bundler(config, console)
			this.addWatchFile('./tsconfig.json')
		},
		async resolveId(id, importer, options) {
			// to handle the case where the import is coming from a node_module or a different workspace
			// we need to always point @evmts/core to the local version
			if (
				id.startsWith('@evmts/core') &&
				!importer?.startsWith(process.cwd()) &&
				!importer?.includes('node_modules')
			) {
				console.log({ id, importer, options })
				return createRequire(`${process.cwd()}/`).resolve('@evmts/core')
			}
			return null
		},
		async load(id: string) {
			if (!id.endsWith('.sol')) {
				return
			}
			if (existsSync(`${id}.ts`)) {
				return
			}
			if (existsSync(`${id}.d.ts`)) {
				return
			}
			const { code, modules } = await moduleResolver.resolveEsmModule(
				id,
				process.cwd(),
				false,
			)
			Object.values(modules).forEach((module) => {
				if (module.id.includes('node_modules')) {
					return
				}
				this.addWatchFile(module.id)
			})
			return code
		},
	} as const
}

const evmtsUnplugin = createUnplugin(unpluginFn)

// Hacks to make types portable
// we should manually type these at some point

export const vitePluginEvmts = evmtsUnplugin.vite as typeof evmtsUnplugin.rollup
export const rollupPluginEvmts = evmtsUnplugin.rollup
export const esbuildPluginEvmts = evmtsUnplugin.esbuild
export const webpackPluginEvmts =
	evmtsUnplugin.webpack as typeof evmtsUnplugin.rspack

export const rspackPluginEvmts = evmtsUnplugin.rspack
