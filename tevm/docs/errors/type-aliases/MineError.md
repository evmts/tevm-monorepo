[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / MineError

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
