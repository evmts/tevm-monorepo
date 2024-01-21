---
editUrl: false
next: false
prev: false
title: "CallError"
---

> **CallError**: [`BaseCallError`](/generated/tevm/errors/type-aliases/basecallerror/) \| [`InvalidSaltError`](/generated/tevm/errors/type-aliases/invalidsalterror/) \| [`InvalidDataError`](/generated/tevm/errors/type-aliases/invaliddataerror/) \| [`InvalidDeployedBytecodeError`](/generated/tevm/errors/type-aliases/invaliddeployedbytecodeerror/)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

[packages/errors/src/CallError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/CallError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
