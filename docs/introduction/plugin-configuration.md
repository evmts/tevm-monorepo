# Plugin configuration

Two build tools are provided to give you an optimized dev experience working with Solidity contracts in TS

- @evmts/rollup-plugin allows you to import solidity files directly into typescript
- @evmts/ts-plugin gives you typescript inference and autocompletion for your your solidity contract imports

### Add @evmts to your tsconfig.json

- Add @evmts/ts-plugin to your `plugins` array in `compilerOptions`
- if `foundry.toml` or `hardhat` config is not in the same directory as the ts-config pass in a relative path to the the project root

```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "@evmts/ts-plugin",
      "project": "../"
    }],
    ...
  }
}
```

See [ts plugin](../guide/typescript.md) guide for more detailed information.

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
