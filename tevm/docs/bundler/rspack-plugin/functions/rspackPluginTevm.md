[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/rspack-plugin](../README.md) / rspackPluginTevm

# Function: rspackPluginTevm()

> **rspackPluginTevm**(`options`?): `RspackPluginInstance`

Defined in: bundler-packages/rspack/types/rspackPluginTevm.d.ts:73

Rspack plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rspack config and add the ts-plugin to your tsconfig.json

## Parameters

### options?

#### solc?

[`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

## Returns

`RspackPluginInstance`

## Examples

```typescript
import { defineConfig } from '@rsbuild/core';
import { rspackPluginTevm } from '@tevm/rspack';

export default defineConfig({
  plugins: [
    rspackPluginTevm()
  ],
});
```

For LSP so your editor recognizes the solidity imports correctly you must also configure tevm/ts-plugin in your tsconfig.json
The ts-plugin will provide type hints, code completion, and other features.

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

Once the rspack plugin and the ts-plugin are configured, you can import Solidity files in JavaScript. The compiler will
turn them into Tevm `Contract` instances.

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

Under the hood the rspack plugin is creating a virtual file for ERC20.sol called ERC20.sol.cjs that looks like this

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

[Tevm rspack solid.js example](https://todo.todo.todo)
