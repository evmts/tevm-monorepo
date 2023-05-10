import { createUnplugin } from "unplugin";
import {foundry} from '@evmts/rollup-plugin'

export const {webpack: foundryPlugin } = createUnplugin((options: any) => {
  const rollupPlugin = foundry(options)
  return {
    name: rollupPlugin.name,
    load: rollupPlugin.load as any,
  }
})

