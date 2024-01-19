---
editUrl: false
next: false
prev: false
title: "CallError"
---

> **CallError**: [`BaseCallError`](/generated/type-aliases/basecallerror/) \| [`InvalidSaltError`](/generated/type-aliases/invalidsalterror/) \| [`InvalidDataError`](/generated/type-aliases/invaliddataerror/) \| [`InvalidDeployedBytecodeError`](/generated/type-aliases/invaliddeployedbytecodeerror/)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

vm/api/dist/index.d.ts:946

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
