import { handleEtherscan } from './handleEtherscan'
import { writeFileSync, mkdirSync } from 'fs'
import * as path from 'path'
import { generateRuntimeSync } from '@evmts/bundler'
import type { ResolvedConfig } from '@evmts/config'

export const generate = async (config: ResolvedConfig, logger: Pick<typeof console, 'log' | 'info' | 'error' | 'warn'>) => {
  const outPath = path.join(process.cwd(), config.externalContracts.out)
  // TODO types are  struggle atm
  const contracts = await handleEtherscan(config as any, logger)
  Object.values(contracts).forEach(contract => {

    const dts = generateRuntimeSync({
      [contract.name]: {
        abi: contract.abi,
        // TODO handle pulling down the bytecode
        bytecode: '0x0',
        contractName: contract.name,
      }
    }, config, 'dts', logger)
    const mjs = generateRuntimeSync({
      [contract.name]: {
        abi: contract.abi,
        // TODO handle pulling down the bytecode
        bytecode: '0x0',
        contractName: contract.name,
      }
    }, config, 'mjs', logger)
    mkdirSync(outPath, { recursive: true })
    writeFileSync(path.join(outPath, `${contract.name}.d.ts`), dts)
    writeFileSync(path.join(outPath, `${contract.name}.mjs`), mjs)
  })
  logger.log(`Installed ${config.externalContracts.contracts.length} contracts to ${outPath} successfully`)
}
