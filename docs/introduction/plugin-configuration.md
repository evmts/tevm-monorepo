# Plugin configuration

Two build tools are provided to give you an optimized dev experience working with Solidity contracts in TS

- @evmts/plugin-rollup allows you to import solidity files directly into typescript
- @evmts/plugin-ts gives you typescript inference and autocompletion for your your solidity contract imports

### Add @evmts to your tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "@evmts/plugin-ts"
    }],
    ...
  }
}
```

See [ts plugin](../guide/typescript.md) guide for more detailed information.

### Add @evmts/plugin-rollup to your vite/rollup config

Currently EVMts only supports vite and rollup. Watch release updates for NEXTjs suport or check out [using evmts without a plugin](../guide/using-evmts-without-plugins.md)

Add rollup plugin to vite config or rollup config

```typescript
import { foundry } from '@evmts/plugin-rollup`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [foundry({
    project: '.',
  })]
})
```

See [rollup-plugin-foundry reference](../plugin-reference/rollup-plugin-foundry.md) for configuration details.

See [hardhat-plugin](../plugin-reference/hardhat-plugin.md) for hardhat instructions.
