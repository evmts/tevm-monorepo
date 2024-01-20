**tevm** ∙ [README](../../../README.md) ∙ [API](../../../API.md)

***

[API](../../../API.md) > [bundler/rspack-plugin](../README.md) > rspackPluginTevm

# Function: rspackPluginTevm()

> **rspackPluginTevm**(`options`?): `RspackPluginInstance`

Rspack plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rspack config and add the ts-plugin to your tsconfig.json

## Parameters

▪ **options?**: `object`

▪ **options.solc?**: `"0.8.23"` \| `"0.8.22"` \| `"0.8.21"` \| `"0.8.20"` \| `"0.8.19"` \| `"0.8.18"` \| `"0.8.17"` \| `"0.8.16"` \| `"0.8.15"` \| `"0.8.14"` \| `"0.8.13"` \| `"0.8.12"` \| `"0.8.11"` \| `"0.8.10"` \| `"0.8.9"` \| `"0.8.8"` \| `"0.8.7"` \| `"0.8.6"` \| `"0.8.5"` \| `"0.8.4"` \| `"0.8.3"` \| `"0.8.2"` \| `"0.8.1"` \| `"0.8.0"` \| `"0.7.6"` \| `"0.7.5"` \| `"0.7.4"` \| `"0.7.3"` \| `"0.7.2"` \| `"0.7.1"` \| `"0.7.0"` \| `"0.6.12"` \| `"0.6.11"` \| `"0.6.10"` \| `"0.6.9"` \| `"0.6.8"` \| `"0.6.7"` \| `"0.6.6"` \| `"0.6.5"` \| `"0.6.4"` \| `"0.6.3"` \| `"0.6.2"` \| `"0.6.1"` \| `"0.6.0"` \| `"0.5.17"` \| `"0.5.16"` \| `"0.5.15"` \| `"0.5.14"` \| `"0.5.13"` \| `"0.5.12"` \| `"0.5.11"` \| `"0.5.10"` \| `"0.5.9"` \| `"0.5.8"` \| `"0.5.7"` \| `"0.5.6"` \| `"0.5.5"` \| `"0.5.4"` \| `"0.5.3"` \| `"0.5.2"` \| `"0.5.1"` \| `"0.5.0"` \| `"0.4.26"` \| `"0.4.25"` \| `"0.4.24"` \| `"0.4.23"` \| `"0.4.22"` \| `"0.4.21"` \| `"0.4.20"` \| `"0.4.19"` \| `"0.4.18"` \| `"0.4.17"` \| `"0.4.16"` \| `"0.4.15"` \| `"0.4.14"` \| `"0.4.13"` \| `"0.4.12"` \| `"0.4.11"` \| `"0.4.10"` \| `"0.4.9"` \| `"0.4.8"` \| `"0.4.7"` \| `"0.4.6"` \| `"0.4.5"` \| `"0.4.4"` \| `"0.4.3"` \| `"0.4.2"` \| `"0.4.1"` \| `"0.4.0"` \| `"0.3.6"` \| `"0.3.5"` \| `"0.3.4"` \| `"0.3.3"` \| `"0.3.2"` \| `"0.3.1"` \| `"0.3.0"` \| `"0.2.2"` \| `"0.2.1"` \| `"0.2.0"` \| `"0.1.7"` \| `"0.1.6"` \| `"0.1.5"` \| `"0.1.4"` \| `"0.1.3"` \| `"0.1.2"` \| `"0.1.1"`

## Returns

## Example

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

## Example

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

Once the rspack plugin and the ts-plugin are configured, you can import Solidity files in JavaScript. The compiler will
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

Under the hood the rspack plugin is creating a virtual file for ERC20.sol called ERC20.sol.cjs that looks like this

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

[Tevm rspack solid.js example](https://todo.todo.todo)

## Source

bundler/rspack/dist/index.d.ts:73

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
