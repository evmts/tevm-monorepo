[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash?`, `_reserved?`, `mineAllTx?`): `Promise`\<\{ `blockHashes?`: `undefined`; `errors?`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \} \| `undefined`\>

Defined in: tevm-monorepo/packages/actions/types/Call/handleAutomining.d.ts:1

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\>

### txHash?

`` `0x${string}` ``

### \_reserved?

`boolean`

### mineAllTx?

`boolean`

## Returns

`Promise`\<\{ `blockHashes?`: `undefined`; `errors?`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \} \| `undefined`\>
