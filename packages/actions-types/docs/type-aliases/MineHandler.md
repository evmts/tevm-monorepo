**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MineHandler

# Type alias: MineHandler

> **MineHandler**: (`params`) => `Promise`\<[`MineResult`](MineResult.md)\>

Mines a block including all transactions in the mempool

## Example

```ts
const res = tevmClient.mine({blocks: 2, interval: 2})
console.log(res.errors) // undefined
```

## Parameters

▪ **params**: [`MineParams`](MineParams.md)

## Source

handlers/MineHandler.ts:9

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
