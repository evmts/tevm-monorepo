# Plugin configuration

### Add evmts to your build config

Currently EVMts only supports vite and rollup. See [NEXTjs](https://lol.nextjs.lol.webpack) for instructions on how to use EVMts in NextJS.

Add rollup plugin to vite config

```typescript{5}
import { rollupPluginFoundry } from '@evmts/plugins`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [rollupPluginFoundry({
    project: '.',
  })]
})
```

See [rollup-plugin-foundry reference](../plugin-reference/rollup-plugin-foundry.md) for configuration details.

See [hardhat-plugin](../plugin-reference/hardhat-plugin.md) for hardhat instructions.
