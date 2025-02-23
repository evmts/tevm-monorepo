[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / MineHandler

# Type Alias: MineHandler()

> **MineHandler**: (`params`?) => `Promise`\<[`MineResult`](MineResult.md)\>

Mines a block including all transactions in the mempool.

## Parameters

• **params?**: [`MineParams`](MineParams.md)

The parameters for the mine action.

## Returns

`Promise`\<[`MineResult`](MineResult.md)\>

- The result of the mine action.

## Example

```typescript
const res = await tevmClient.mine({ blocks: 2, interval: 2 })
console.log(res.errors) // undefined
```

## See

 - [MineParams](MineParams.md) for details on the parameters.
 - [MineResult](MineResult.md) for details on the result.

## Defined in

packages/actions/types/Mine/MineHandlerType.d.ts:18
