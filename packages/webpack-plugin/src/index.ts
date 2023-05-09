const {
  Artifacts,
  FoundryOptions,
  buildContracts,
  createModule,
  forgeOptionsValidator,
  getArtifacts,
  getContractName,
  getFoundryConfig,
} = require('@evmts/plugin-internal')
const fs = require('fs-extra')
const { validate } = require('schema-utils')
const schema = require('./evmts-webpack-plugin.schema.js')

type TODO = any

export class EvmtsWebpackPlugin {
  private artifacts: TODO = {}

  constructor(private readonly options: TODO = {}) {
    validate(schema, options, {
      name: 'EvmtsWebpackPlugin',
      baseDataPath: 'options',
    })
  }

  apply(compiler: TODO) {
    compiler.hooks.beforeCompile.tapPromise('EvmtsWebpackPlugin', async () => {
      const foundryOptions = forgeOptionsValidator.parse(this.options)
      const foundryConfig = getFoundryConfig(foundryOptions)

      await buildContracts(foundryOptions)
      if (!(await fs.pathExists(foundryConfig.out))) {
        throw new Error('artifacts directory does not exist')
      }
      this.artifacts = await getArtifacts(foundryOptions)
    })

    compiler.hooks.normalModuleFactory.tap(
      'EvmtsWebpackPlugin',
      (factory: TODO) => {
        factory.hooks.beforeResolve.tap(
          'EvmtsWebpackPlugin',
          (resolveData: TODO) => {
            if (!resolveData.request.endsWith('.sol')) {
              return
            }
            const contract =
              this.artifacts[getContractName(resolveData.request)]
            if (!contract) {
              throw new Error(`contract ${resolveData.request} not found`)
            }
            resolveData.createData.resource = createModule(contract)
          },
        )
      },
    )
  }
}
