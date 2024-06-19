---
editUrl: false
next: false
prev: false
title: "callHandler"
---

> **callHandler**(`client`, `options`?): [`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

Creates a code splitable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`= `true`

## Returns

[`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

## Throws

if throwOnFail is true returns TevmCallError as value

## Example

```typescript
import { createBaseClient } from 'tevm/base-client'
import { callHandler } from 'tevm/actions'

const client = createBaseClient()

const call = callHandler(client)

const res = await call({
  createTransaction: true,
  to: `0x${'69'.repeat(20)}`,
  value: 420n,
  skipBalance: true,
})
```

## Source

[packages/actions/src/Call/callHandler.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandler.js#L41)
