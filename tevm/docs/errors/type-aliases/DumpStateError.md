**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [errors](../README.md) / DumpStateError

# Type alias: DumpStateError

> **DumpStateError**: [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

Error Returned by dump state procedure

## Example

```ts
const {errors} = await tevm.dumpState()

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

packages/errors/types/actions/DumpStateError.d.ts:13
