**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MineError

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

[packages/errors/src/actions/MineError.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/MineError.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
