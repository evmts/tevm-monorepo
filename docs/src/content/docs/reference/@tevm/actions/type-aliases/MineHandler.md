---
editUrl: false
next: false
prev: false
title: "MineHandler"
---

> **MineHandler**: (`params`?) => `Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

Mines a block including all transactions in the mempool

## Example

```ts
const res = tevmClient.mine({blocks: 2, interval: 2})
console.log(res.errors) // undefined
```

## Parameters

• **params?**: [`MineParams`](/reference/tevm/actions/type-aliases/mineparams/)

## Returns

`Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

## Source

[packages/actions/src/Mine/MineHandlerType.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineHandlerType.ts#L10)
