---
editUrl: false
next: false
prev: false
title: "MineParams"
---

> **MineParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

Tevm params to mine one or more blocks.

## Example

```typescript
const mineParams: import('@tevm/actions').MineParams = {
  blockCount: 5,
}
```

## Param

Number of blocks to mine. Defaults to 1.

## Param

Interval between block timestamps in seconds. Defaults to 1.

## Type declaration

### blockCount?

> `readonly` `optional` **blockCount**: `number`

Number of blocks to mine. Defaults to 1.

### interval?

> `readonly` `optional` **interval**: `number`

Interval between block timestamps. Defaults to 1.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/Mine/MineParams.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineParams.ts#L15)
