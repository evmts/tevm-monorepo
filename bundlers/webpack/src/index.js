import { evmtsUnplugin, createUnplugin } from '@evmts/unplugin'

export const { webpack: webpackPluginEvmts } = createUnplugin(evmtsUnplugin)

