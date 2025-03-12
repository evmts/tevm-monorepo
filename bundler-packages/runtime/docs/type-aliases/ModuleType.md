[**@tevm/runtime**](../README.md)

***

[@tevm/runtime](../globals.md) / ModuleType

# Type Alias: ModuleType

> **ModuleType**: `"cjs"` \| `"dts"` \| `"ts"` \| `"mjs"`

Defined in: [types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/types.ts#L20)

Represents the different output module types supported by the Tevm runtime.

The runtime can generate code in various formats to support different bundlers
and environments:

- `cjs`: CommonJS format, used in Node.js environments
- `dts`: TypeScript declaration files (*.d.ts) for type information
- `ts`: TypeScript source files, used for direct TypeScript imports
- `mjs`: ES Modules format, used in modern JavaScript environments

## Example

```typescript
import type { ModuleType } from '@tevm/runtime'

// Specify the desired output format
const format: ModuleType = 'ts'
```
