---
editUrl: false
next: false
prev: false
title: "CallError"
---

> **CallError**: [`BaseCallError`](/generated/tevm/api/type-aliases/basecallerror/) \| [`InvalidSaltError`](/generated/tevm/api/type-aliases/invalidsalterror/) \| [`InvalidDataError`](/generated/tevm/api/type-aliases/invaliddataerror/) \| [`InvalidDeployedBytecodeError`](/generated/tevm/api/type-aliases/invaliddeployedbytecodeerror/)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

[errors/CallError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/CallError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
