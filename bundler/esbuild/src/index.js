import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'

export const { esbuild: esbuildPluginTevm } = createUnplugin(tevmUnplugin)
