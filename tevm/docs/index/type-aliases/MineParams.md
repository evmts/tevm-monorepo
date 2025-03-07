[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / MineParams

# Type Alias: MineParams\<TThrowOnFail\>

> **MineParams**\<`TThrowOnFail`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: packages/actions/types/Mine/MineParams.d.ts:14

Tevm params to mine one or more blocks.

## Type declaration

### blockCount?

> `readonly` `optional` **blockCount**: `number`

Number of blocks to mine. Defaults to 1.

### interval?

> `readonly` `optional` **interval**: `number`

Interval between block timestamps. Defaults to 1.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

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
