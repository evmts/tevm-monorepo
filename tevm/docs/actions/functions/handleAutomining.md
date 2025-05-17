[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash?`, `isGasMining?`, `mineAllTx?`): `Promise`\<`undefined` \| \{ `blockHashes?`: `undefined`; `errors?`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

Defined in: packages/actions/types/Call/handleAutomining.d.ts:1

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\>

### txHash?

`` `0x${string}` ``

### isGasMining?

`boolean`

### mineAllTx?

`boolean`

## Returns

`Promise`\<`undefined` \| \{ `blockHashes?`: `undefined`; `errors?`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>
