[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DumpStateParams

# Type Alias: DumpStateParams\<TThrowOnFail\>

> **DumpStateParams**\<`TThrowOnFail`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & `object`

## Type Declaration

### blockTag?

> `readonly` `optional` **blockTag?**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Block tag to fetch account from
- bigint for block number
- hex string for block hash
- 'latest', 'earliest', 'pending', 'forked' etc. tags

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TThrowOnFail` *extends* `boolean` | `boolean` |
