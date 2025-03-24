[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / EVMProfilerOpts

# Type Alias: EVMProfilerOpts

> **EVMProfilerOpts** = `object`

Defined in: [packages/vm/src/utils/EVMProfileOpts.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EVMProfileOpts.ts#L13)

Configuration options for EVM code execution profiling.
Controls whether detailed execution metrics are collected.

## Example

```typescript
import { EVMProfilerOpts } from '@tevm/vm'

const value: EVMProfilerOpts = {
  enabled: true // Enable EVM profiling to collect execution metrics
}
```

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [packages/vm/src/utils/EVMProfileOpts.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EVMProfileOpts.ts#L14)
