**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CallHandler

# Type alias: CallHandler

> **CallHandler**: (`action`) => `Promise`\<[`CallResult`](CallResult.md)\>

Executes a call against the VM. It is similar to `eth_call` but has more
options for controlling the execution environment

See `contract` and `script` which executes calls specifically against deployed contracts
or undeployed scripts

## Example

```ts
const res = tevm.call({
to: '0x123...',
data: '0x123...',
from: '0x123...',
gas: 1000000,
gasPrice: 1n,
skipBalance: true,
}
```

## Parameters

▪ **action**: [`CallParams`](CallParams.md)

## Source

[handlers/CallHandler.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-types/src/handlers/CallHandler.ts#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
