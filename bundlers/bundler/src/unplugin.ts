import * as packageJson from '../package.json'
import { bundler } from './bundler'
import { type ResolvedConfig, loadConfig } from '@evmts/config'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { type UnpluginFactory, createUnplugin } from 'unplugin'
import { z } from 'zod'
import { join } from 'path'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.optional()
	.default('solc')
	.describe('compiler to use.  Defaults to solc')
const tsConfigOptionValidator = z
	.string()
	.optional()
	.default('./tsconfig.json')
	.describe('Relative path to tsconfig.json.  Defaults to ./tsconfig.json')

const configValidator = z.strictObject({
	compiler: compilerOptionValidator,
	tsconfig: tsConfigOptionValidator,
}).optional().default({})

export type Config = Partial<z.infer<typeof configValidator>>

const bundlers = {
	solc: bundler,
}

// make a function with this signature
export const unpluginFn: UnpluginFactory<
	Config | undefined,
	false
> = (options = {}) => {
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

	const parsedTsConfigOption = tsConfigOptionValidator.safeParse(
		options.tsconfig,
	)
	if (!parsedTsConfigOption.success) {
		throw new Error(
			`Invalid tsconfig option: ${options.tsconfig}.  Valid options are a relative path to a tsconfig.json file`,
		)
	}
	const tsconfigOption = parsedTsConfigOption.data

	if (compilerOption === 'foundry') {
		throw new Error(
			'We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time.',
		)
	}
	const bundler = bundlers[compilerOption]
	let moduleResolver: ReturnType<typeof bundler>

	let evmtsConfig: ResolvedConfig
	return {
		name: '@evmts/rollup-plugin',
		version: packageJson.version,
		async buildStart() {
			evmtsConfig = loadConfig(join(process.cwd(), tsconfigOption))
			moduleResolver = bundler(evmtsConfig, console)
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
