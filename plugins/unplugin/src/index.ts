import { FoundryConfig, foundryPlugin } from '@evmts/solidity-resolver'
import { createUnplugin } from 'unplugin'

const foundryUnplugin = createUnplugin((options: FoundryConfig = {}) => {
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
})

// Hacks to make types portable
// we should manually type these at some point

export const viteFoundry = foundryUnplugin.vite as typeof rollupFoundry

export const rollupFoundry = foundryUnplugin.rollup

export const esbuildFoundry = foundryUnplugin.esbuild

export const webpackFoundry =
  foundryUnplugin.webpack as typeof rspackPluginFoundry

export const rspackPluginFoundry = foundryUnplugin.rspack
