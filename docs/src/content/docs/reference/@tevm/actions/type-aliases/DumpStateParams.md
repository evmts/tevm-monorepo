---
editUrl: false
next: false
prev: false
title: "DumpStateParams"
---

> **DumpStateParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

## Type declaration

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](/reference/tevm/actions/type-aliases/blockparam/)

Block tag to fetch account from
- bigint for block number
- hex string for block hash
- 'latest', 'earliest', 'pending', 'forked' etc. tags

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/DumpState/DumpStateParams.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateParams.ts#L4)
