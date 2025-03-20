[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockJsonRpcProcedure

# Function: debugTraceBlockJsonRpcProcedure()

> **debugTraceBlockJsonRpcProcedure**(`provider`): `DebugTraceBlockProcedure`

Defined in: packages/actions/src/debug/traceBlockJsonRpcProcedure.js:28

Request handler for debug_traceBlock JSON-RPC requests

Returns a full stack trace of all invoked opcodes of all transactions that were included in a block.

## Parameters

### provider

The EIP1193 provider

#### request

`EIP1193RequestFn`\<`undefined`, `false`\>

## Returns

`DebugTraceBlockProcedure`

## Example

```js
import { debugTraceBlockJsonRpcProcedure } from '@tevm/actions'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'

const handler = debugTraceBlockJsonRpcProcedure(provider)
const response = await handler({
  jsonrpc: '2.0',
  id: 1,
  method: 'debug_traceBlock',
  params: [
    '0x...', // RLP encoded block
    { tracer: 'callTracer', tracerConfig: { onlyTopCall: true } }
  ]
})
```

## See

https://docs.quicknode.com/api/ethereum/debug_traceblock
