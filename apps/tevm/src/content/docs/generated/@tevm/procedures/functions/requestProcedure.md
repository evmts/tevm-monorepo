---
editUrl: false
next: false
prev: false
title: "requestProcedure"
---

> **requestProcedure**(`vm`): `TevmJsonRpcRequestHandler`

Handles a single tevm json rpc request
Infers return type from request

## Parameters

▪ **vm**: `VM`

## Returns

## Example

```typescript
const res = await requestProcedure(evm)({
 jsonrpc: '2.0',
 id: '1',
 method: 'tevm_call',
 params: {
   to: '0x000000000'
 }
})
```

## Source

[vm/procedures/src/requestProcedure.js:32](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/requestProcedure.js#L32)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
