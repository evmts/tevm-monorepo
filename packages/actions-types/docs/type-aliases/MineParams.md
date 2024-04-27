**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MineParams

# Type alias: MineParams`<TThrowOnFail>`

> **MineParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

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

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/MineParams.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/MineParams.ts#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
