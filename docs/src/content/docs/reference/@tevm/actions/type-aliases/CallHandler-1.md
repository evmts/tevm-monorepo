---
editUrl: false
next: false
prev: false
title: "CallHandler"
---

> **CallHandler**: (`action`) => `Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/)\>

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

• **action**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams-1/)

## Returns

`Promise`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/)\>

## Source

[packages/actions/src/Call/CallHandlerType.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallHandlerType.ts#L21)
