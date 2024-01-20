**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > CallHandler

# Type alias: CallHandler

> **CallHandler**: (`action`) => `Promise`\<[`CallResult`](../../index/type-aliases/CallResult.md)\>

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

▪ **action**: [`CallParams`](../../index/type-aliases/CallParams.md)

## Source

vm/api/types/handlers/CallHandler.d.ts:19

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
