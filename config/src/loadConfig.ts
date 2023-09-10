import { type EvmtsConfig, type ResolvedConfig } from './Config'
import { defineConfig } from './defineConfig'
import { constants, existsSync, readFileSync } from 'fs'
import { readFile, access } from 'fs/promises'
import { parse } from 'jsonc-parser'
import * as path from 'path'

type LoadConfig = (
	configFilePath: string,
	logger?: Pick<typeof console, 'error' | 'warn'>,
) => ResolvedConfig

type LoadConfigAsync = (
	configFilePath: string,
	logger?: Pick<typeof console, 'error' | 'warn'>,
) => Promise<ResolvedConfig>

const fileExists = async (path: string) => {
	try {
		// TODO not the most robust check for existence here
		await access(path, constants.F_OK)
		return true
	} catch (e) {
		// should be inspecting the error here
		return false
	}
}

export const loadConfigAsync: LoadConfigAsync = async (
	configFilePath,
	logger = console,
) => {
	/**
	 * evmts.config.ts currently doesn't work for ts-plugin because it is not syncronous
	 * for now load config will load from tsconfig instead until fixed
	 */
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const jsConfigPath = path.join(configFilePath, 'jsconfig.json')
	let configStr
	try {
		configStr = await fileExists(jsConfigPath)
			? await readFile(jsConfigPath, 'utf8')
			: await readFile(tsConfigPath, 'utf8')
	} catch (error) {
		logger.error(error)
		throw new Error(
			`Failed to read the file at ${tsConfigPath}. Make sure the file exists and is accessible.`,
		)
	}
	let configJson: {
		compilerOptions: {
			plugins?: Array<{ name: '@evmts/ts-plugin' } & EvmtsConfig>
			baseUrl?: string
		}
	}
	try {
		configJson = parse(configStr)
		if (!configJson.compilerOptions) {
			throw new Error('No compilerOptions found failed to parse tsconfig.json')
		}
	} catch (e) {
		logger.error(e)
		throw new Error(`tsconfig.json at ${tsConfigPath} is not valid json`)
	}

	let config: EvmtsConfig | undefined =
		configJson?.compilerOptions?.plugins?.find(
			(plugin) => plugin.name === '@evmts/ts-plugin',
		)

	if (!config) {
		logger.warn(
			'No Evmts plugin found in tsconfig.json. Using the default config',
		)
		config = {}
	}

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

	return defineConfig(() => config ?? {}).configFn(configFilePath)
}

export const loadConfig: LoadConfig = (configFilePath, logger = console) => {
	/**
	 * evmts.config.ts currently doesn't work for ts-plugin because it is not syncronous
	 * for now load config will load from tsconfig instead until fixed
	 */
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const jsConfigPath = path.join(configFilePath, 'jsconfig.json')
	let configStr
	try {
		configStr = existsSync(jsConfigPath)
			? readFileSync(jsConfigPath, 'utf8')
			: readFileSync(tsConfigPath, 'utf8')
	} catch (error) {
		logger.error(error)
		throw new Error(
			`Failed to read the file at ${tsConfigPath}. Make sure the file exists and is accessible.`,
		)
	}
	let configJson: {
		compilerOptions: {
			plugins?: Array<{ name: '@evmts/ts-plugin' } & EvmtsConfig>
			baseUrl?: string
		}
	}
	try {
		configJson = parse(configStr)
		if (!configJson.compilerOptions) {
			throw new Error('No compilerOptions found failed to parse tsconfig.json')
		}
	} catch (e) {
		logger.error(e)
		throw new Error(`tsconfig.json at ${tsConfigPath} is not valid json`)
	}

	let config: EvmtsConfig | undefined =
		configJson?.compilerOptions?.plugins?.find(
			(plugin) => plugin.name === '@evmts/ts-plugin',
		)

	if (!config) {
		logger.warn(
			'No Evmts plugin found in tsconfig.json. Using the default config',
		)
		config = {}
	}

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

	return defineConfig(() => config ?? {}).configFn(configFilePath)
}
