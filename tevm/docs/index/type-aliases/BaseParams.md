[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / BaseParams

# Type Alias: BaseParams\<TThrowOnFail\>

> **BaseParams**\<`TThrowOnFail`\>: `object`

Defined in: packages/actions/types/common/BaseParams.d.ts:4

The base parameters shared across all actions

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Type declaration

### throwOnFail?

> `readonly` `optional` **throwOnFail**: `TThrowOnFail`

Whether to throw on errors or return errors as value on the 'errors' property
Defaults to `true`
