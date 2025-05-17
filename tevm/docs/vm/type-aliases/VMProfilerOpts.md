[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMProfilerOpts

# Type Alias: VMProfilerOpts

> **VMProfilerOpts** = `object`

Defined in: packages/vm/types/utils/VMProfileOpts.d.ts:14

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

Defined in: packages/vm/types/utils/VMProfileOpts.d.ts:16

***

### reportAfterTx?

> `optional` **reportAfterTx**: `boolean`

Defined in: packages/vm/types/utils/VMProfileOpts.d.ts:15
