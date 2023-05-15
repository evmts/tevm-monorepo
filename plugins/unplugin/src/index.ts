import {
  FoundryConfig,
  HardhatConfig,
  foundryPlugin,
} from '@evmts/solidity-resolver'
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

const hardhatUnplugin = createUnplugin((options?: HardhatConfig) => {
  const hardhatPlugin = 'TODO' as any
  const plugin = hardhatPlugin(options, console)
  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    load(id: string) {
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
export const viteHardhat = hardhatUnplugin.vite as typeof rollupHardhat

export const rollupFoundry = foundryUnplugin.rollup
export const rollupHardhat = hardhatUnplugin.rollup

export const esbuildFoundry = foundryUnplugin.esbuild
export const esbuildHardhat = hardhatUnplugin.esbuild

export const webpackFoundry = foundryUnplugin.webpack as typeof rspackPluginFoundry
export const webpackHardhat = hardhatUnplugin.webpack as typeof rspackPluginHardhat

export const rspackPluginFoundry = foundryUnplugin.rspack
export const rspackPluginHardhat = hardhatUnplugin.rspack

