### DebugTraceCallHandler

Ƭ **DebugTraceCallHandler**: (`params`: [`DebugTraceCallParams`](modules.md#debugtracecallparams)) => `Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceCallParams`](modules.md#debugtracecallparams) |

##### Returns

`Promise`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>

#### Defined in

[handlers/DebugHandler.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DebugHandler.ts#L15)

___

### DebugTraceCallJsonRpcRequest

Ƭ **DebugTraceCallJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"debug_traceCall"``, `SerializeToJson`\<[`DebugTraceCallParams`](modules.md#debugtracecallparams)\>\>

JSON-RPC request for `debug_traceCall` method

#### Defined in

[requests/DebugJsonRpcRequest.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/DebugJsonRpcRequest.ts#L20)

___

### DebugTraceCallJsonRpcResponse

Ƭ **DebugTraceCallJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"debug_traceCall"``, `SerializeToJson`\<[`DebugTraceCallResult`](modules.md#debugtracecallresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceCall` procedure

#### Defined in

[responses/DebugJsonRpcResponse.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/DebugJsonRpcResponse.ts#L25)

___

### DebugTraceCallParams

Ƭ **DebugTraceCallParams**\<`TChain`\>: [`TraceParams`](modules.md#traceparams) & \{ `block?`: `BlockTag` \| `Hex` \| `BigInt` ; `transaction`: `CallParameters`\<`TChain`\>  }

Params taken by `debug_traceCall` handler

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TChain` | extends `Chain` \| `undefined` = `Chain` \| `undefined` |

#### Defined in

[params/DebugParams.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L55)

___

### DebugTraceCallProcedure

Ƭ **DebugTraceCallProcedure**: (`request`: [`DebugTraceCallJsonRpcRequest`](modules.md#debugtracecalljsonrpcrequest)) => `Promise`\<[`DebugTraceCallJsonRpcResponse`](modules.md#debugtracecalljsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceCallJsonRpcResponse`](modules.md#debugtracecalljsonrpcresponse)\>

JSON-RPC procedure for `debug_traceCall`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceCallJsonRpcRequest`](modules.md#debugtracecalljsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceCallJsonRpcResponse`](modules.md#debugtracecalljsonrpcresponse)\>

#### Defined in

[procedure/DebugProcedure.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/DebugProcedure.ts#L20)

___

### DebugTraceCallResult

Ƭ **DebugTraceCallResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failed` | `boolean` |
| `gas` | `bigint` |
| `returnValue` | `Hex` |
| `structLogs` | `ReadonlyArray`\<`StructLog`\> |

#### Defined in

[result/DebugResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DebugResult.ts#L16)

___

### DebugTraceTransactionHandler

Ƭ **DebugTraceTransactionHandler**: (`params`: [`DebugTraceTransactionParams`](modules.md#debugtracetransactionparams)) => `Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DebugTraceTransactionParams`](modules.md#debugtracetransactionparams) |

##### Returns

`Promise`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>

#### Defined in

[handlers/DebugHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DebugHandler.ts#L11)

___

### DebugTraceTransactionJsonRpcRequest

Ƭ **DebugTraceTransactionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"debug_traceTransaction"``, `SerializeToJson`\<[`DebugTraceTransactionParams`](modules.md#debugtracetransactionparams)\>\>

JSON-RPC request for `debug_traceTransaction` method

#### Defined in

[requests/DebugJsonRpcRequest.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/DebugJsonRpcRequest.ts#L12)

___

### DebugTraceTransactionJsonRpcResponse

Ƭ **DebugTraceTransactionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"debug_traceTransaction"``, `SerializeToJson`\<[`DebugTraceTransactionResult`](modules.md#debugtracetransactionresult)\>, `DebugError`\>

JSON-RPC response for `debug_traceTransaction` procedure

#### Defined in

[responses/DebugJsonRpcResponse.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/DebugJsonRpcResponse.ts#L16)

___

### DebugTraceTransactionParams

Ƭ **DebugTraceTransactionParams**: [`TraceParams`](modules.md#traceparams) & \{ `transactionHash`: `Hex`  }

Params taken by `debug_traceTransaction` handler

#### Defined in

[params/DebugParams.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L44)

___

### DebugTraceTransactionProcedure

Ƭ **DebugTraceTransactionProcedure**: (`request`: [`DebugTraceTransactionJsonRpcRequest`](modules.md#debugtracetransactionjsonrpcrequest)) => `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](modules.md#debugtracetransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`DebugTraceTransactionJsonRpcResponse`](modules.md#debugtracetransactionjsonrpcresponse)\>

JSON-RPC procedure for `debug_traceTransaction`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`DebugTraceTransactionJsonRpcRequest`](modules.md#debugtracetransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`DebugTraceTransactionJsonRpcResponse`](modules.md#debugtracetransactionjsonrpcresponse)\>

#### Defined in

[procedure/DebugProcedure.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/DebugProcedure.ts#L13)

___

### DebugTraceTransactionResult

Ƭ **DebugTraceTransactionResult**: [`TraceResult`](modules.md#traceresult)

#### Defined in

[result/DebugResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DebugResult.ts#L14)

___

### TraceCall

Ƭ **TraceCall**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](modules.md#tracecall)[] |
| `from` | `Address` |
| `gas?` | `bigint` |
| `gasUsed?` | `bigint` |
| `input` | `Hex` |
| `output` | `Hex` |
| `to` | `Address` |
| `type` | [`TraceType`](modules.md#tracetype) |
| `value?` | `bigint` |

#### Defined in

[common/TraceCall.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceCall.ts#L5)

___

### TraceParams

Ƭ **TraceParams**: `Object`

Config params for trace calls

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeout?` | `string` | A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms". **`Example`** ```ts "10s" ``` |
| `tracer` | ``"callTracer"`` \| ``"prestateTracer"`` | The type of tracer Currently only callTracer supported |
| `tracerConfig?` | {} | object to specify configurations for the tracer |

#### Defined in

[params/DebugParams.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/DebugParams.ts#L6)

___

### TraceResult

Ƭ **TraceResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](modules.md#tracecall)[] |
| `from` | `Address` |
| `gas` | `bigint` |
| `gasUsed` | `bigint` |
| `input` | `Hex` |
| `output` | `Hex` |
| `to` | `Address` |
| `type` | [`TraceType`](modules.md#tracetype) |
| `value` | `bigint` |

#### Defined in

[common/TraceResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceResult.ts#L6)

___

### TraceType

Ƭ **TraceType**: ``"CALL"`` \| ``"DELEGATECALL"`` \| ``"STATICCALL"`` \| ``"CREATE"`` \| ``"CREATE2"`` \| ``"SELFDESTRUCT"`` \| ``"REWARD"``

#### Defined in

[common/TraceType.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TraceType.ts#L1)

___

