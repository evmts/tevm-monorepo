import { solidityModuleResolver } from '../utils/solidityModuleResolver'
import { createDecorator } from './createDecorator'

/**
 * Decorates the server host with `resolveModuleNameLiterals` proxy to return the correct module object for `.sol` files.
 */
export const resolveModuleNameLiteralsDecorator = createDecorator(
  (createInfo, ts, logger) => {
    return {
      resolveModuleNameLiterals: (moduleNames, containingFile, ...rest) => {
        const resolvedModules =
          createInfo.languageServiceHost.resolveModuleNameLiterals?.(
            moduleNames,
            containingFile,
            ...rest,
          )

        return moduleNames.map(({ text: moduleName }, index) => {
          if (!resolvedModules) {
            throw new Error('Expected "resolvedModules" to be defined.')
          }
          try {
            const resolvedModule = solidityModuleResolver(
              moduleName,
              ts,
              createInfo,
              containingFile,
            )
            if (resolvedModule) {
              return { resolvedModule }
            }
          } catch (e) {
            logger.error(e as string)
            return resolvedModules[index]
          }
          return resolvedModules[index]
        })
      },
    }
  },
)
