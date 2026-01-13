[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugDumpBlockAccountState

# Type Alias: DebugDumpBlockAccountState

> **DebugDumpBlockAccountState** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L168)

Account state in debug_dumpBlock result

## Properties

### balance

> **balance**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L172)

Account balance in hex

***

### code?

> `optional` **code**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L188)

Contract code (if present)

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L180)

Account code hash

***

### nonce

> **nonce**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L176)

Account nonce in hex

***

### root

> **root**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L184)

Account storage root

***

### storage?

> `optional` **storage**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: [packages/actions/src/debug/DebugResult.ts:192](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L192)

Account storage
