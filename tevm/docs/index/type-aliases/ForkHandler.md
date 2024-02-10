**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ForkHandler

# Type alias: ForkHandler

> **ForkHandler**: (`params`) => `Promise`\<[`ForkResult`](ForkResult.md)\>

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

## Parameters

▪ **params**: [`ForkParams`](ForkParams.md)

## Source

packages/actions-types/types/handlers/ForkHandler.d.ts:17

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
