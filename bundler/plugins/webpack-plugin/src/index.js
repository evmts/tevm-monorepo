import { createUnplugin, evmtsUnplugin } from '@evmts/unplugin'

export const { webpack: webpackPluginEvmts } = createUnplugin(evmtsUnplugin)
