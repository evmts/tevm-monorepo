**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > MineParams

# Type alias: MineParams

> **MineParams**: `object`

Tevm params to mine 1 or more blocks

## Example

```ts
const mineParams: import('@tevm/actions-types').MineParams = {
  blockCount: 5,
}
```

## Type declaration

### blockCount

> **blockCount**?: `number`

Number of blocks to mine. Defaults to 1

### interval

> **interval**?: `number`

Interval between block timestamps. Defaults to 1

## Source

packages/actions-types/types/params/MineParams.d.ts:8

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
