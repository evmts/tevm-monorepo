[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / MineHandler

# Type alias: MineHandler()

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

## Source

packages/actions-types/types/handlers/MineHandler.d.ts:8
