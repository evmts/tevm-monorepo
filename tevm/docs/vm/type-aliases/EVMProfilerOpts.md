[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / EVMProfilerOpts

# Type Alias: EVMProfilerOpts

> **EVMProfilerOpts**: `object`

Defined in: packages/vm/types/utils/EVMProfileOpts.d.ts:13

Configuration options for EVM code execution profiling.
Controls whether detailed execution metrics are collected.

## Type declaration

### enabled

> **enabled**: `boolean`

## Example

```typescript
import { EVMProfilerOpts } from '@tevm/vm'

const value: EVMProfilerOpts = {
  enabled: true // Enable EVM profiling to collect execution metrics
}
```
