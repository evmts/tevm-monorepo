**@tevm/errors** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/errors](../README.md) / ScriptError

# Type alias: ScriptError

> **ScriptError**: [`ContractError`](ContractError.md) \| [`InvalidBytecodeError`](InvalidBytecodeError.md) \| [`InvalidDeployedBytecodeError`](InvalidDeployedBytecodeError.md)

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
