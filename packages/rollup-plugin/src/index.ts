// @ts-ignore - TODO figure out why these types don't work
import { FoundryConfig, HardhatConfig, foundryPlugin } from '@evmts/solts'
import type { Plugin } from 'rollup'

export const foundry = (options: FoundryConfig = {}): Plugin => {
  const plugin = foundryPlugin(options, console)
  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    load(id) {
      if (!id.endsWith('.sol')) {
        return
      }
      return plugin.resolveEsmModule(id)
    },
  }
}

export const hardhat = (options: HardhatConfig): Plugin => {
  console.log('options', options)
  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    load(id) {
      const hardhatPlugin = 'TODO' as any
      const plugin = hardhatPlugin(options, console)
      if (!id.endsWith('.sol')) {
        return
      }
      return plugin.resolveEsmModule(id)
    },
  }
}
