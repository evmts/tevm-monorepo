[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / DumpStateParams

# Type Alias: DumpStateParams\<TThrowOnFail\>

> **DumpStateParams**\<`TThrowOnFail`\>: [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & `object`

## Type declaration

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Block tag to fetch account from
- bigint for block number
- hex string for block hash
- 'latest', 'earliest', 'pending', 'forked' etc. tags

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

packages/actions/types/DumpState/DumpStateParams.d.ts:3
