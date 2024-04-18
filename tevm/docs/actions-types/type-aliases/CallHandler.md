**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / CallHandler

# Type alias: CallHandler()

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

• **action**: [`CallParams`](../../index/type-aliases/CallParams.md)

## Returns

`Promise`\<[`CallResult`](../../index/type-aliases/CallResult.md)\>

## Source

packages/actions-types/types/handlers/CallHandler.d.ts:19
