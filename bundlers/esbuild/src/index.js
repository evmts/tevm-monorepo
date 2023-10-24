import { evmtsUnplugin, createUnplugin } from '@evmts/unplugin'

export const { esbuild: esbuildPluginEvmts } = createUnplugin(evmtsUnplugin)

