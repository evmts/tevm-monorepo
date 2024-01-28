---
editUrl: false
next: false
prev: false
title: "ForkHandler"
---

> **ForkHandler**: (`params`) => `Promise`\<[`ForkResult`](/reference/tevm/actions-types/type-aliases/forkresult/)\>

Forks the network with the given config.
If no config is provided it will fork the network that is currently connected.
If there is no config and no connected network, it will throw an error.

## Throws

import('@tevm/errors').ForkError

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

▪ **params**: [`ForkParams`](/reference/tevm/actions-types/type-aliases/forkparams/)

## Source

[handlers/ForkHandler.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/ForkHandler.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
