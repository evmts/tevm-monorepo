[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MineParams

# Type Alias: MineParams\<TThrowOnFail\>

> **MineParams**\<`TThrowOnFail`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnFail`\> & [`MineEvents`](MineEvents.md) & `object`

Defined in: packages/actions/types/Mine/MineParams.d.ts:21

Tevm params to mine one or more blocks.

## Type Declaration

### blockCount?

> `readonly` `optional` **blockCount**: `number`

Number of blocks to mine. Defaults to 1.

### interval?

> `readonly` `optional` **interval**: `number`

Interval between block timestamps. Defaults to 1.

### tx?

> `readonly` `optional` **tx**: [`Hex`](Hex.md)

The txHash to mine if only mining one tx

## Type Parameters

### TThrowOnFail

`TThrowOnFail` *extends* `boolean` = `boolean`

## Example

```typescript
const mineParams: import('@tevm/actions').MineParams = {
  blockCount: 5,
  onBlock: (block, next) => {
    console.log(`Block mined: ${block.header.number}`)
    next()
  }
}
```
