**@tevm/errors** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/errors](../README.md) / CallError

# Type alias: CallError

> **CallError**: [`BaseCallError`](BaseCallError.md) \| [`InvalidSaltError`](InvalidSaltError.md) \| [`InvalidDataError`](InvalidDataError.md) \| [`InvalidDeployedBytecodeError`](InvalidDeployedBytecodeError.md)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

[packages/errors/src/actions/CallError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/CallError.ts#L16)
