[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / MineParams

# Type alias: MineParams\<TThrowOnFail\>

> **MineParams**\<`TThrowOnFail`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

Tevm params to mine 1 or more blocks

## Example

```ts
const mineParams: import('@tevm/actions').MineParams = {
  blockCount: 5,
}
```

## Type declaration

### blockCount?

> `optional` `readonly` **blockCount**: `number`

Number of blocks to mine. Defaults to 1

### interval?

> `optional` `readonly` **interval**: `number`

Interval between block timestamps. Defaults to 1

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Mine/MineParams.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineParams.ts#L10)
