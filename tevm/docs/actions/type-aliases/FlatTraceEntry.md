[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / FlatTraceEntry

# Type Alias: FlatTraceEntry

> **FlatTraceEntry** = `object`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:56

A single trace entry in the flat trace array

## Properties

### action

> **action**: [`FlatCallAction`](FlatCallAction.md) \| [`FlatCreateAction`](FlatCreateAction.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:58

Action details

***

### blockHash?

> `optional` **blockHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:60

Block hash where the transaction occurred

***

### blockNumber?

> `optional` **blockNumber**: `bigint`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:62

Block number where the transaction occurred

***

### error?

> `optional` **error**: `string`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:64

Error message if the call failed

***

### result

> **result**: [`FlatCallResult`](FlatCallResult.md) \| [`FlatCreateResult`](FlatCreateResult.md) \| `null`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:68

Result of the action (null if call failed)

***

### revertReason?

> `optional` **revertReason**: `string`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:66

Revert reason if the call reverted

***

### subtraces

> **subtraces**: `number`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:70

Number of child traces

***

### traceAddress

> **traceAddress**: `number`[]

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:72

Position in the trace tree as an array of indices

***

### transactionHash?

> `optional` **transactionHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:74

Transaction hash

***

### transactionPosition?

> `optional` **transactionPosition**: `number`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:76

Transaction index in the block

***

### type

> **type**: `"call"` \| `"create"` \| `"suicide"`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:78

Type of trace: "call" or "create"
