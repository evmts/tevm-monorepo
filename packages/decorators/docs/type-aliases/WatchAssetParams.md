[**@tevm/decorators**](../README.md) • **Docs**

***

[@tevm/decorators](../globals.md) / WatchAssetParams

# Type alias: WatchAssetParams

> **WatchAssetParams**: `object`

Parameters for the `watchAsset` method.

## Type declaration

### options

> **options**: `object`

### options.address

> **address**: `string`

The address of the token contract

### options.decimals

> **decimals**: `number`

The number of token decimals

### options.image?

> `optional` **image**: `string`

A string url of the token logo

### options.symbol

> **symbol**: `string`

A ticker symbol or shorthand, up to 11 characters

### type

> **type**: `"ERC20"`

Token type.

## Source

[packages/decorators/src/eip1193/WatchAssetParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WatchAssetParams.ts#L11)
