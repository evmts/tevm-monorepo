**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [errors](../README.md) > MineError

# Type alias: MineError

> **MineError**: `Error`

Errors returned by tevm_mine method

## Example

```ts
const {errors} = await tevm.mine({})

if (errors?.length) {
  console.log(errors[0].message)
}
```

## Source

packages/errors/types/actions/MineError.d.ts:10

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
