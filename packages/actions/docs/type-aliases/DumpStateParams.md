[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DumpStateParams

# Type Alias: DumpStateParams\<TThrowOnFail\>

> **DumpStateParams**\<`TThrowOnFail`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

## Type declaration

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Block tag to fetch account from
- bigint for block number
- hex string for block hash
- 'latest', 'earliest', 'pending', 'forked' etc. tags

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/DumpState/DumpStateParams.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateParams.ts#L4)
