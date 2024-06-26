[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / MineHandler

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

[packages/actions/src/Mine/MineHandlerType.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineHandlerType.ts#L10)
