---
editUrl: false
next: false
prev: false
title: "ScriptError"
---

> **ScriptError**: [`ContractError`](/generated/tevm/api/type-aliases/contracterror/) \| [`InvalidBytecodeError`](/generated/tevm/api/type-aliases/invalidbytecodeerror/) \| [`InvalidDeployedBytecodeError`](/generated/tevm/api/type-aliases/invaliddeployedbytecodeerror/)

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

[errors/ScriptError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ScriptError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
