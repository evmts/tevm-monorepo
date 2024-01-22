---
editUrl: false
next: false
prev: false
title: "ScriptError"
---

> **ScriptError**: [`ContractError`](/reference/tevm/errors/type-aliases/contracterror/) \| [`InvalidBytecodeError`](/reference/tevm/errors/type-aliases/invalidbytecodeerror/) \| [`InvalidDeployedBytecodeError`](/reference/tevm/errors/type-aliases/invaliddeployedbytecodeerror/)

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

[packages/errors/src/actions/ScriptError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ScriptError.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
