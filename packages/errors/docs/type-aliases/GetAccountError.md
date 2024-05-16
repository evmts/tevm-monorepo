[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / GetAccountError

# Type alias: GetAccountError

> **GetAccountError**: [`AccountNotFoundError`](AccountNotFoundError.md) \| [`InvalidAddressError`](InvalidAddressError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

Errors returned by tevm_getAccount procedure

## Example

```ts
const {errors} = await tevm.getAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[packages/errors/src/actions/GetAccountError.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/GetAccountError.ts#L15)
