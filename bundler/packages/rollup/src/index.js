import { createUnplugin, evmtsUnplugin } from '@evmts/unplugin'

export const { rollup: rollupPluginEvmts } = createUnplugin(evmtsUnplugin)
