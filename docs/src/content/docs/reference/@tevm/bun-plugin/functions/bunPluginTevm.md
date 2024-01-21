---
editUrl: false
next: false
prev: false
title: "bunPluginTevm"
---

> **bunPluginTevm**(`SolcVersions`): `BunPlugin`

Bun plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

## Parameters

▪ **SolcVersions**: `object`

Which solc version to use

▪ **SolcVersions.solc?**: `SolcVersions`= `defaultSolc.version`

## Returns

- A bun plugin

To configure add this plugin to your Bun config and add the ts-plugin to your tsconfig.json

## Example

```ts plugin.ts
// Configure plugin in a plugin.ts file
import { tevmPluginBun } from '@tevm/bun-plugin'
import { plugin } from 'bun'

plugin(tevmPluginBun())
```

// Add the plugin.ts to your bunfig.toml
```ts bunfig.toml
preload = ["./plugins.ts"]
```

For LSP so your editor recognizes the solidity imports correctly you must also configure tevm/ts-plugin in your tsconfig.json
The ts-plugin will provide type hints, code completion, and other features.

## Example

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

Once the esbuild plugin and the ts-plugin are configured, you can import Solidity files in JavaScript. The compiler will
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

Under the hood the esbuild plugin is creating a virtual file for ERC20.sol called ERC20.sol.cjs that looks like this

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

For custom configuration of the Tevm compiler add a [tevm.config.json](https://todo.todo.todo) file to your project root.

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

## See

[Tevm esbuild example](https://todo.todo.todo)

## Source

[bunPluginTevm.js:86](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bun/src/bunPluginTevm.js#L86)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
