export type Plugin<TConfig> = (config: TConfig) =>  ({
  /**
    * The name of the plugin.
    */
  name: string
  /**
    * The configuration of the plugin.
    */
  config: TConfig
  include: string[]
  exclude: string[]
  resolveDts: (module: string) => string
  resolveModule: (module: string) => string
  resolveModulePath: (module: string) => string
})

