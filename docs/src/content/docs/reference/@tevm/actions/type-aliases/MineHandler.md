---
editUrl: false
next: false
prev: false
title: "MineHandler"
---

> **MineHandler**: (`params`?) => `Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

Mines a block including all transactions in the mempool.

## Parameters

• **params?**: [`MineParams`](/reference/tevm/actions/type-aliases/mineparams/)

The parameters for the mine action.

## Returns

`Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

- The result of the mine action.

## Example

```typescript
const res = await tevmClient.mine({ blocks: 2, interval: 2 })
console.log(res.errors) // undefined
```

## See

 - [MineParams](../../../../../../../../reference/tevm/actions/type-aliases/mineparams) for details on the parameters.
 - [MineResult](../../../../../../../../reference/tevm/actions/type-aliases/mineresult) for details on the result.

## Defined in

[packages/actions/src/Mine/MineHandlerType.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineHandlerType.ts#L19)
