---
editUrl: false
next: false
prev: false
title: "callHandler"
---

> **callHandler**(`client`, `options`?): [`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

Creates a tree-shakable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action.
This function is designed for use with TevmNode and the internal instance of TEVM,
and it is distinct from the viem API `tevmCall`.

Note: This is the internal logic used by higher-level APIs such as `tevmCall`.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

The call handler function.

## Throws

If `throwOnFail` is true, returns `TevmCallError` as value.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { callHandler } from 'tevm/actions'

const client = createTevmNode()

const call = callHandler(client)

const res = await call({
  createTransaction: true,
  to: `0x${'69'.repeat(20)}`,
  value: 420n,
  skipBalance: true,
})
```

## Defined in

[packages/actions/src/Call/callHandler.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandler.js#L46)
