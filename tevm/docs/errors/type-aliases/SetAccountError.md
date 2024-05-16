[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / SetAccountError

# Type alias: SetAccountError

> **SetAccountError**: [`InvalidAddressError`](InvalidAddressError.md) \| [`InvalidBalanceError`](InvalidBalanceError.md) \| [`InvalidNonceError`](InvalidNonceError.md) \| [`InvalidStorageRootError`](InvalidStorageRootError.md) \| [`InvalidBytecodeError`](InvalidBytecodeError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

Errors returned by tevm_setAccount method

## Example

```ts
const {errors} = await tevm.setAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

packages/errors/types/actions/SetAccountError.d.ts:13
