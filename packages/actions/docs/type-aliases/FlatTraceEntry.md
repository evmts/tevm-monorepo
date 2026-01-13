[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FlatTraceEntry

# Type Alias: FlatTraceEntry

> **FlatTraceEntry** = `object`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L61)

A single trace entry in the flat trace array

## Properties

### action

> **action**: [`FlatCallAction`](FlatCallAction.md) \| [`FlatCreateAction`](FlatCreateAction.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L63)

Action details

***

### blockHash?

> `optional` **blockHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L65)

Block hash where the transaction occurred

***

### blockNumber?

> `optional` **blockNumber**: `bigint`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L67)

Block number where the transaction occurred

***

### error?

> `optional` **error**: `string`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L69)

Error message if the call failed

***

### result

> **result**: [`FlatCallResult`](FlatCallResult.md) \| [`FlatCreateResult`](FlatCreateResult.md) \| `null`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L73)

Result of the action (null if call failed)

***

### revertReason?

> `optional` **revertReason**: `string`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L71)

Revert reason if the call reverted

***

### subtraces

> **subtraces**: `number`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L75)

Number of child traces

***

### traceAddress

> **traceAddress**: `number`[]

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L77)

Position in the trace tree as an array of indices

***

### transactionHash?

> `optional` **transactionHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L79)

Transaction hash

***

### transactionPosition?

> `optional` **transactionPosition**: `number`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L81)

Transaction index in the block

***

### type

> **type**: `"call"` \| `"create"` \| `"suicide"`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L83)

Type of trace: "call" or "create"
