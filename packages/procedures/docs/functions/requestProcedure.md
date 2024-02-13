**@tevm/procedures** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > requestProcedure

# Function: requestProcedure()

> **requestProcedure**(`vm`, `forkUrl`?): `TevmJsonRpcRequestHandler`

Request handler for JSON-RPC requests.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

Most users will want to use `Tevm.request` instead of
this method but this method may be desired if hyper optimizing
bundle size.

## Parameters

▪ **vm**: `TevmVm`

▪ **forkUrl?**: `string`

## Returns

## Example

```typescript
const blockNumberResponse = await tevm.request({
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
})
const accountResponse = await tevm.request({
 method: 'tevm_getAccount',
 params: [{address: '0x123...'}]
 id: 1
 jsonrpc: '2.0'
})
```

## Source

[procedures/src/requestProcedure.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestProcedure.js#L50)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
