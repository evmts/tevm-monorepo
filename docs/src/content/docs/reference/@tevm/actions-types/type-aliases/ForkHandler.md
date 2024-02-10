---
editUrl: false
next: false
prev: false
title: "ForkHandler"
---

> **ForkHandler**: (`params`) => `Promise`\<[`ForkResult`](/reference/tevm/actions-types/type-aliases/forkresult/)\>

This is an unimplemented experimental feature
Triggers a fork against the given fork config. If no config is provided it will fork the current state
If the current state is not proxying to an RPC and is just a vanilla VM it will throw

Block tag is optional and defaults to 'latest'

## Throws

import('@tevm/errors').ForkError

## Example

```typescript
const {errors} = await tevm.fork({
  url: 'https://mainnet.infura.io/v3',
  blockTag: 'earliest',
})
```

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Parameters

▪ **params**: [`ForkParams`](/reference/tevm/actions-types/type-aliases/forkparams/)

## Source

[handlers/ForkHandler.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/ForkHandler.ts#L17)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
