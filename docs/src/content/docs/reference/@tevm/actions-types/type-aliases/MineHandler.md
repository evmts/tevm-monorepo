---
editUrl: false
next: false
prev: false
title: "MineHandler"
---

> **MineHandler**: (`params`?) => `Promise`\<[`MineResult`](/reference/tevm/actions-types/type-aliases/mineresult/)\>

Mines a block including all transactions in the mempool

## Example

```ts
const res = tevmClient.mine({blocks: 2, interval: 2})
console.log(res.errors) // undefined
```

## Parameters

• **params?**: [`MineParams`](/reference/tevm/actions-types/type-aliases/mineparams/)

## Returns

`Promise`\<[`MineResult`](/reference/tevm/actions-types/type-aliases/mineresult/)\>

## Source

[handlers/MineHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/MineHandler.ts#L9)
