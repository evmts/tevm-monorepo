import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'

export const { webpack: webpackPluginTevm } = createUnplugin(tevmUnplugin)
