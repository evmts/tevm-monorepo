import { EVMtsConfig, ResolvedConfig, defaultConfig } from './EVMtsConfig'
import { defineConfig } from './defineConfig'
import { readFileSync } from 'fs'
import * as path from 'path'

type LoadConfig = (
	configFilePath: string,
	logger?: Pick<typeof console, 'error' | 'warn'>,
) => ResolvedConfig
export const loadConfigTs = async (configFilePath: string) => {
	const { bundleRequire } = await import('bundle-require')
	const configModule = await bundleRequire({
		filepath: path.join(configFilePath, 'evmts.config.ts'),
	})
	const config = configModule.mod.default?.default ?? configModule.mod.default
	if (!config) {
		return defaultConfig
	}
	if (config.configFn) {
		return config.configFn(configFilePath)
	}
	if (typeof config !== 'function') {
		return config
	}
	return config()
}

export const loadConfig: LoadConfig = (configFilePath, logger = console) => {
	/**
	 * evmts.config.ts currently doesn't work for ts-plugin because it is not syncronous
	 * for now load config will load from tsconfig instead until fixed
	 */
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	let configStr
	try {
		configStr = readFileSync(tsConfigPath, 'utf8')
	} catch (error) {
		throw new Error(
			`Failed to read the file at ${tsConfigPath}. Make sure the file exists and is accessible.`,
		)
	}
	let configJson: {
		compilerOptions: {
			plugins?: Array<{ name: '@evmts/ts-plugin' } & EVMtsConfig>
			baseUrl?: string
		}
	}
	try {
		configJson = JSON.parse(configStr)
	} catch (e) {
		logger.error(e)
		throw new Error(`tsconfig.json at ${tsConfigPath} is not valid json`)
	}

	let config: EVMtsConfig | undefined =
		configJson?.compilerOptions?.plugins?.find(
			(plugin) => plugin.name === '@evmts/ts-plugin',
		)
	if (config && configJson.compilerOptions.baseUrl) {
		config = {
			...config,
			compiler: {
				...config.compiler,
				libs: [
					...(config.compiler?.libs ?? []),
					path.join(configFilePath, configJson.compilerOptions.baseUrl),
				],
			},
		}
	}

	if (!config) {
		logger.warn(
			'No EVMts plugin found in tsconfig.json. Using the default config',
		)
		if (configJson.compilerOptions.baseUrl) {
			return {
				...defaultConfig,
				compiler: {
					...defaultConfig.compiler,
					libs: [
						...defaultConfig.compiler.libs,
						path.join(configFilePath, configJson.compilerOptions.baseUrl),
					],
				},
			}
		}
		return defaultConfig
	}

	return defineConfig(() => config ?? {}).configFn(configFilePath)
}
