[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / MineHandler

# Type Alias: MineHandler()

> **MineHandler**: (`params`?) => `Promise`\<[`MineResult`](MineResult.md)\>

Mines a block including all transactions in the mempool

## Example

```ts
const res = tevmClient.mine({blocks: 2, interval: 2})
console.log(res.errors) // undefined
```

## Parameters

• **params?**: [`MineParams`](MineParams.md)

## Returns

`Promise`\<[`MineResult`](MineResult.md)\>

## Defined in

packages/actions/types/Mine/MineHandlerType.d.ts:9
