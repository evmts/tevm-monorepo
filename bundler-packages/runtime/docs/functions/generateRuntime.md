[**@tevm/runtime**](../README.md)

***

[@tevm/runtime](../globals.md) / generateRuntime

# Function: generateRuntime()

> **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`, `tevmPackage`): `Effect`\<`string`, `never`, `never`\>

Defined in: [generateRuntime.js:80](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/generateRuntime.js#L80)

Generates a complete runtime module from Solidity compilation artifacts.

This function combines the appropriate import statements with the generated
contract body code to create a complete module that exports the Tevm Contract
objects. It supports different output formats and can optionally include
bytecode for deployable contracts.

## Parameters

### artifacts

`Artifacts`

Compiled Solidity artifacts
  containing ABI, bytecode, and other contract information

### moduleType

[`ModuleType`](../type-aliases/ModuleType.md)

The target module format
  ('cjs', 'dts', 'ts', or 'mjs')

### includeBytecode

`boolean`

Whether to include bytecode in the output,
  true for script/deployable contracts, false for interface-only contracts

### tevmPackage

Package name to import
  the createContract function from

`"tevm/contract"` | `"@tevm/contract"`

## Returns

`Effect`\<`string`, `never`, `never`\>

- Effect that
  resolves to the generated module code as a string

## Throws

If no artifacts are provided or if an invalid module type is specified

## Example

```javascript
import { generateRuntime } from '@tevm/runtime'
import { runPromise } from 'effect/Effect'

// Generate TypeScript module from artifacts
const code = await runPromise(
  generateRuntime(
    artifacts,         // Solidity compilation results
    'ts',              // Generate TypeScript code
    true,              // Include bytecode
    '@tevm/contract'   // Import from this package
  )
)

console.log(code)
```
