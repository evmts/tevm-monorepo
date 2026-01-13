[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugDumpBlockAccountState

# Type Alias: DebugDumpBlockAccountState

> **DebugDumpBlockAccountState** = `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:97

Account state in debug_dumpBlock result

## Properties

### balance

> **balance**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:101

Account balance in hex

***

### code?

> `optional` **code**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:117

Contract code (if present)

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:109

Account code hash

***

### nonce

> **nonce**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:105

Account nonce in hex

***

### root

> **root**: [`Hex`](Hex.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:113

Account storage root

***

### storage?

> `optional` **storage**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: packages/actions/types/debug/DebugResult.d.ts:121

Account storage
