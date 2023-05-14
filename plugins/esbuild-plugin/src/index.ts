import { foundry } from '@evmts/rollup-plugin'
import { createUnplugin } from 'unplugin'

export const { esbuild: foundryPlugin } = createUnplugin((options: any) => {
  const rollupPlugin = foundry(options)
  return {
    name: rollupPlugin.name,
    load: rollupPlugin.load as any,
  }
})
