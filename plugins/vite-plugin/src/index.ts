import { FoundryConfig, HardhatConfig, foundryPlugin } from '@evmts/modules'
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
  const hardhatPlugin = 'TODO' as any
  const plugin = hardhatPlugin(options, console)
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
