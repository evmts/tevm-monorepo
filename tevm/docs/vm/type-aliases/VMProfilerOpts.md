[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMProfilerOpts

# Type Alias: VMProfilerOpts

> **VMProfilerOpts** = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="reportafterblock"></a> `reportAfterBlock?` | `boolean` |
| <a id="reportaftertx"></a> `reportAfterTx?` | `boolean` |
