### Add @evmts/rollup-plugin to your vite/rollup config

Currently EVMts only supports vite and rollup. Watch release updates for NEXTjs suport or check out [using evmts without a plugin](../guide/using-evmts-without-plugins.md)

Add rollup plugin to vite config or rollup config

```typescript
import { foundry } from '@evmts/rollup-plugin`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [foundry({
    project: '.',
  })]
})
```

See [rollup-plugin-foundry reference](../plugin-reference/rollup-plugin-foundry.md) for configuration details.

See [hardhat-plugin](../plugin-reference/hardhat-plugin.md) for hardhat instructions.

