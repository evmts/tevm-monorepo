[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / VMProfilerOpts

# Type Alias: VMProfilerOpts

> **VMProfilerOpts** = `object`

Defined in: [packages/vm/src/utils/VMProfileOpts.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMProfileOpts.ts#L14)

Configuration options for VM profiling and performance reporting.
Controls when and how profiling data is reported during VM execution.

## Example

```typescript
import { VMProfilerOpts } from '@tevm/vm'

const value: VMProfilerOpts = {
  reportAfterTx: true,    // Generate reports after each transaction
  reportAfterBlock: false // Don't generate reports after each block
}
```

## Properties

### reportAfterBlock?

> `optional` **reportAfterBlock**: `boolean`

Defined in: [packages/vm/src/utils/VMProfileOpts.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMProfileOpts.ts#L17)

***

### reportAfterTx?

> `optional` **reportAfterTx**: `boolean`

Defined in: [packages/vm/src/utils/VMProfileOpts.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMProfileOpts.ts#L16)
