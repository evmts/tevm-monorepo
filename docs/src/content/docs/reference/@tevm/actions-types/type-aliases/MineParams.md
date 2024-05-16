---
editUrl: false
next: false
prev: false
title: "MineParams"
---

> **MineParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Tevm params to mine 1 or more blocks

## Example

```ts
const mineParams: import('@tevm/actions-types').MineParams = {
  blockCount: 5,
}
```

## Type declaration

### blockCount?

> `optional` **blockCount**: `number`

Number of blocks to mine. Defaults to 1

### interval?

> `optional` **interval**: `number`

Interval between block timestamps. Defaults to 1

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[params/MineParams.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/MineParams.ts#L10)
