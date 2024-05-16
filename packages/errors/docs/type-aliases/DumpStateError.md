[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / DumpStateError

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

[packages/errors/src/actions/DumpStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/DumpStateError.ts#L14)
