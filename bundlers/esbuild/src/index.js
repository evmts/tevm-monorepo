import { createUnplugin, evmtsUnplugin } from '@evmts/unplugin'

export const { esbuild: esbuildPluginEvmts } = createUnplugin(evmtsUnplugin)
