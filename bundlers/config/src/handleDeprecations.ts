// Temporary for alpha breaking change nice to have
// these properties changed
// solcVersion?: string
// deployments?: Record<string, DeploymentConfig>
// forge?: ForgeConfig

import { EVMtsConfig } from "./EVMtsConfig"

let didWarn = false

// libs?: string[]
export const handleDeprecations = (config?: EVMtsConfig, logger: { warn: (message: string) => void } = console) => {
  if (didWarn) {
    logger = { warn: () => { } }
  }
  if (!config) {
    return config
  }
  let newConfig = config
  if ((config as any).deployments) {
    logger.warn(`deployments in EVMtsConfig is deprecated and
			has been renamed to 'localContracts.contracts'. It will be
removed in the EVMts beta release.
Please rename the property in your tsconfig.json.`)
    newConfig = {
      ...config,
      localContracts: {
        ...config.compiler,

        contracts: config?.localContracts?.contracts ?? (config as any)?.deployments,
      },
    }
  }
  if ((config as any).forge) {
    logger.warn(`forge in EVMtsConfig is deprecated and
			has been renamed to 'compiler.foundryProject'. It will be
removed in the EVMts beta release.
Please rename the property in your tsconfig.json.`)
    newConfig = {
      ...config,
      compiler: {
        ...config.compiler,
        foundryProject: config?.compiler?.foundryProject ?? (config as any)?.forge,
      },
    }
  }
  if ((config as any).libs) {
    logger.warn(`libs in EVMtsConfig is deprecated
			and has been renamed to 'compiler.libs'. It will be
removed in the EVMts beta release.
Please rename the property in your tsconfig.json.`)
    newConfig = {
      ...config,
      compiler: {
        ...config.compiler,
        libs: [
          ...(config?.compiler?.libs ?? []),
          ...(config as any)?.libs
        ],
      },
    }
  }
  if ((config as any).solcVersion) {
    logger.warn(`solcVersion in EVMtsConfig is deprecated and
			has been renamed to 'compiler.solcVersion'
Please rename the property in your tsconfig.json`)
    newConfig = {
      ...config,
      compiler: {
        ...config.compiler,
        solcVersion: config?.compiler?.solcVersion ?? (config as any)?.solcVersion,
      },
    }
  }
  return newConfig
}

