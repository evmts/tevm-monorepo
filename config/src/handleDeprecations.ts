import type {
	CompilerConfig,
	EvmtsConfig,
	LocalContractsConfig,
} from './Config'

export interface DeprecatedConfig extends EvmtsConfig {
	deployments?: LocalContractsConfig['contracts']
	forge?: CompilerConfig['foundryProject']
	libs?: CompilerConfig['libs']
	solcVersion?: CompilerConfig['solcVersion']
}

export const handleDeprecations = (
	config?: DeprecatedConfig,
	logger: { warn: (message: string) => void } = console,
) => {
	if (!config) {
		return config
	}
	let newConfig = config
	if (config.deployments) {
		logger.warn(`deployments in EvmtsConfig is deprecated and
			has been renamed to 'localContracts.contracts'. It will be
removed in the Evmts beta release.
Please rename the property in your tsconfig.json.`)
		const { deployments, ...rest } = config as typeof config & {
			deployments: any
		}
		newConfig = {
			...rest,
			localContracts: {
				...rest.localContracts,
				contracts: rest?.localContracts?.contracts ?? deployments,
			},
		}
	}
	if (config.forge) {
		const { forge, ...rest } = config as typeof config & { forge: any }
		logger.warn(`forge in EvmtsConfig is deprecated and
			has been renamed to 'compiler.foundryProject'. It will be
removed in the Evmts beta release.
Please rename the property in your tsconfig.json.`)
		newConfig = {
			...rest,
			compiler: {
				...rest.compiler,
				foundryProject: rest?.compiler?.foundryProject ?? forge,
			},
		}
	}
	if (config.libs) {
		const { libs, ...rest } = config as typeof config & { libs: any }
		logger.warn(`libs in EvmtsConfig is deprecated
			and has been renamed to 'compiler.libs'. It will be
removed in the Evmts beta release.
Please rename the property in your tsconfig.json.`)
		newConfig = {
			...rest,
			compiler: {
				...rest.compiler,
				libs: [...(rest?.compiler?.libs ?? []), ...libs],
			},
		}
	}
	if (config.solcVersion) {
		const { solcVersion, ...rest } = config as typeof config & {
			solcVersion: any
		}
		logger.warn(`solcVersion in EvEvmConfig is deprecated and
			has been renamed to 'compiler.solcVersion'
Please rename the property in your tsconfig.json`)
		newConfig = {
			...rest,
			compiler: {
				...rest.compiler,
				solcVersion: rest?.compiler?.solcVersion ?? solcVersion,
			},
		}
	}
	return newConfig
}
