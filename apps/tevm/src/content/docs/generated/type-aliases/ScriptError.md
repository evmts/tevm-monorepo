---
editUrl: false
next: false
prev: false
title: "ScriptError"
---

> **ScriptError**: [`ContractError`](/generated/type-aliases/contracterror/) \| [`InvalidBytecodeError`](/generated/type-aliases/invalidbytecodeerror/) \| [`InvalidDeployedBytecodeError`](/generated/type-aliases/invaliddeployedbytecodeerror/)

Error type of errors thrown by the tevm_script procedure

## Example

```ts
const {errors} = await tevm.script({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidBytecodeError
 console.log(errors[0].message) // Invalid bytecode should be a hex string: 1234
}
```

## Source

vm/api/dist/index.d.ts:907

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
