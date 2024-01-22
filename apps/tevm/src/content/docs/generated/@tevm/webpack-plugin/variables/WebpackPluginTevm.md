---
editUrl: false
next: false
prev: false
title: "WebpackPluginTevm"
---

> **`const`** **WebpackPluginTevm**: `TevmWebpackPluginConstructor`

Webpack plugin for tevm. Enables Solidity imports in JavaScript.

## Example

```typescript
import { WebpackPluginTevm } from '@tevm/webpack'

export default {
 plugins: [
   new WebpackPluginTevm()
 ]
```

For LSP support you must also configure tevm/ts-plugin in your tsconfig.json

## Example

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

Once the vite plugin and the ts-plugin are configured, you can import Solidity files in JavaScript. The compiler will
turn them into Tevm `Contract` instances.

## Example

```typescript
// Solidity imports are automaticlaly turned into Tevm Contract objects
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
import { createTevm } from 'tevm'

console.log(ERC20.abi)
console.log(ERC20.humanReadableAbi)
console.log(ERC20.bytecode)

tevm.contract(
  ERC20.withAddress(.read.balanceOf()
)
```

Under the hood the vite plugin is creating a virtual file for ERC20.sol called ERC20.sol.cjs that looks like this

## Example

```typescript
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
  bytecode: '0x...',
  deployedBytecode: '0x...',
})
```

For custom configuration add a [tevm.config.json](https://todo.todo.todo) file to your project root.

## Example

```json
{
  foundryProject?: boolean | string | undefined,
  libs: ['lib'],
  remappings: {'foo': 'vendored/foo'},
  debug: true,
  cacheDir: '.tevm'
}
```

## Source

[WebpackPluginTevm.js:78](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/webpack/src/WebpackPluginTevm.js#L78)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
