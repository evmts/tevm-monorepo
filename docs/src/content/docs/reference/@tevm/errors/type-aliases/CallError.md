---
editUrl: false
next: false
prev: false
title: "CallError"
---

> **CallError**: [`BaseCallError`](/reference/tevm/errors/type-aliases/basecallerror/) \| [`InvalidSaltError`](/reference/tevm/errors/type-aliases/invalidsalterror/) \| [`InvalidDataError`](/reference/tevm/errors/type-aliases/invaliddataerror/) \| [`InvalidDeployedBytecodeError`](/reference/tevm/errors/type-aliases/invaliddeployedbytecodeerror/)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

[packages/errors/src/actions/CallError.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/CallError.ts#L12)
