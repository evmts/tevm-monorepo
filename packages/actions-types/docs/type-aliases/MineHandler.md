[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / MineHandler

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

[handlers/MineHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/MineHandler.ts#L9)
