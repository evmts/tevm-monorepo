#!/usr/bin/env node
import { cac } from 'cac'
import { handleEtherscan } from './etherscan'
import { loadConfig } from '@evmts/config'

const cli = cac('evmts')

cli
  .command('install', 'Install external contracts from etherscan')
  .example((name) => `${name} install`)
  .action(async () => {
    const config = loadConfig(process.cwd())
    await handleEtherscan(config)
  })

cli.help()
cli.version('alpha')

void (async () => {
  try {
    cli.parse(process.argv, { run: false })
    if (!cli.matchedCommand) {
      if (cli.args.length === 0) cli.outputHelp()
      else throw new Error(`Unknown command: ${cli.args.join(' ')}`)
    }
    await cli.runMatchedCommand()
  } catch (error) {
    console.error(`\n${(error as Error).message}`)
    process.exit(1)
  }
})()
