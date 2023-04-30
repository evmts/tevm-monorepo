import type typescript from 'typescript/lib/tsserverlibrary'

/**
 * The logger used internally within the package
 */
export type Logger = {
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
}

/**
 * Factory to create a logger
 * @see {@link Logger}
 */
export const createLogger = (
  pluginCreateInfo: typescript.server.PluginCreateInfo,
): Logger => {
  const info = (msg: string) =>
    pluginCreateInfo.project.projectService.logger.info(
      `[evmts-ts-plugin] ${msg}`,
    )
  const warn = (msg: string) =>
    pluginCreateInfo.project.projectService.logger.info(
      `[evmts-ts-plugin] warning: ${msg}`,
    )
  const error = (msg: string) =>
    pluginCreateInfo.project.projectService.logger.info(
      `[evmts-ts-plugin] error: ${msg}`,
    )
  return { info, warn, error }
}
