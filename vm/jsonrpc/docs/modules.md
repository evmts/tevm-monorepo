[@tevm/jsonrpc](README.md) / Exports

# @tevm/jsonrpc

## Table of contents

### Classes

- [UnknownMethodError](classes/UnknownMethodError.md)

### Type Aliases

- [BackendReturnType](modules.md#backendreturntype)
- [JsonRpcClient](modules.md#jsonrpcclient)
- [NonVerboseTevmJsonRpcRequest](modules.md#nonverbosetevmjsonrpcrequest)
- [TevmCallRequest](modules.md#tevmcallrequest)
- [TevmCallResponse](modules.md#tevmcallresponse)
- [TevmContractCallRequest](modules.md#tevmcontractcallrequest)
- [TevmContractCallResponse](modules.md#tevmcontractcallresponse)
- [TevmJsonRpcRequest](modules.md#tevmjsonrpcrequest)
- [TevmPutAccountRequest](modules.md#tevmputaccountrequest)
- [TevmPutAccountResponse](modules.md#tevmputaccountresponse)
- [TevmPutContractCodeRequest](modules.md#tevmputcontractcoderequest)
- [TevmPutContractCodeResponse](modules.md#tevmputcontractcoderesponse)
- [TevmScriptRequest](modules.md#tevmscriptrequest)
- [TevmScriptResponse](modules.md#tevmscriptresponse)

### Functions

- [createHttpHandler](modules.md#createhttphandler)
- [createJsonRpcClient](modules.md#createjsonrpcclient)
- [tevmCall](modules.md#tevmcall)
- [tevmContractCall](modules.md#tevmcontractcall)
- [tevmPutAccount](modules.md#tevmputaccount)
- [tevmPutContractCode](modules.md#tevmputcontractcode)
- [tevmScript](modules.md#tevmscript)

## Type Aliases

### BackendReturnType

Ƭ **BackendReturnType**\<`T`\>: `T` extends \{ `method`: ``"tevm_call"``  } ? [`TevmCallResponse`](modules.md#tevmcallresponse) : `T` extends \{ `method`: ``"tevm_contractCall"``  } ? [`TevmContractCallResponse`](modules.md#tevmcontractcallresponse)\<`T`[``"params"``][``"abi"``], `T`[``"params"``][``"functionName"``] & `string`\> : `T` extends \{ `method`: ``"tevm_putAccount"``  } ? [`TevmPutAccountResponse`](modules.md#tevmputaccountresponse) : `T` extends \{ `method`: ``"tevm_putContractCode"``  } ? [`TevmPutContractCodeResponse`](modules.md#tevmputcontractcoderesponse) : `T` extends \{ `method`: ``"tevm_script"``  } ? [`TevmScriptResponse`](modules.md#tevmscriptresponse)\<`T`[``"params"``][``"abi"``], `T`[``"params"``][``"functionName"``] & `string`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`NonVerboseTevmJsonRpcRequest`](modules.md#nonverbosetevmjsonrpcrequest) |

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L29)

___

### JsonRpcClient

Ƭ **JsonRpcClient**: `ReturnType`\<typeof [`createJsonRpcClient`](modules.md#createjsonrpcclient)\>

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L93)

___

### NonVerboseTevmJsonRpcRequest

Ƭ **NonVerboseTevmJsonRpcRequest**: `Pick`\<[`TevmContractCallRequest`](modules.md#tevmcontractcallrequest), ``"method"`` \| ``"params"``\> \| `Pick`\<[`TevmPutAccountRequest`](modules.md#tevmputaccountrequest), ``"method"`` \| ``"params"``\> \| `Pick`\<[`TevmPutContractCodeRequest`](modules.md#tevmputcontractcoderequest), ``"method"`` \| ``"params"``\> \| `Pick`\<[`TevmCallRequest`](modules.md#tevmcallrequest), ``"method"`` \| ``"params"``\> \| `Pick`\<[`TevmScriptRequest`](modules.md#tevmscriptrequest), ``"method"`` \| ``"params"``\>

#### Defined in

[vm/jsonrpc/src/TevmJsonRpcRequest.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/TevmJsonRpcRequest.ts#L16)

___

### TevmCallRequest

Ƭ **TevmCallRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_call"`` |
| `params` | `RunCallAction` |

#### Defined in

[vm/jsonrpc/src/requests/TevmCallRequest.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/requests/TevmCallRequest.ts#L3)

___

### TevmCallResponse

Ƭ **TevmCallResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_call"`` |
| `result` | `RunCallResponse` |

#### Defined in

[vm/jsonrpc/src/responses/TevmCallResponse.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/responses/TevmCallResponse.ts#L3)

___

### TevmContractCallRequest

Ƭ **TevmContractCallRequest**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_contractCall"`` |
| `params` | `RunContractCallAction`\<`TAbi`, `TFunctionName`\> |

#### Defined in

[vm/jsonrpc/src/requests/TevmContractCallRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/requests/TevmContractCallRequest.ts#L4)

___

### TevmContractCallResponse

Ƭ **TevmContractCallResponse**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_contractCall"`` |
| `result` | `RunContractCallResponse`\<`TAbi`, `TFunctionName`\> |

#### Defined in

[vm/jsonrpc/src/responses/TevmContractCallResponse.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/responses/TevmContractCallResponse.ts#L4)

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`TevmContractCallRequest`](modules.md#tevmcontractcallrequest) \| [`TevmPutAccountRequest`](modules.md#tevmputaccountrequest) \| [`TevmPutContractCodeRequest`](modules.md#tevmputcontractcoderequest) \| [`TevmCallRequest`](modules.md#tevmcallrequest) \| [`TevmScriptRequest`](modules.md#tevmscriptrequest)

#### Defined in

[vm/jsonrpc/src/TevmJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/TevmJsonRpcRequest.ts#L9)

___

### TevmPutAccountRequest

Ƭ **TevmPutAccountRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_putAccount"`` |
| `params` | `PutAccountAction` |

#### Defined in

[vm/jsonrpc/src/requests/TevmPutAccountRequest.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/requests/TevmPutAccountRequest.ts#L3)

___

### TevmPutAccountResponse

Ƭ **TevmPutAccountResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_putAccount"`` |
| `result` | `PutAccountResponse` |

#### Defined in

[vm/jsonrpc/src/responses/TevmPutAccountResponse.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/responses/TevmPutAccountResponse.ts#L3)

___

### TevmPutContractCodeRequest

Ƭ **TevmPutContractCodeRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_putContractCode"`` |
| `params` | `PutContractCodeAction` |

#### Defined in

[vm/jsonrpc/src/requests/TevmPutContractCodeRequest.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/requests/TevmPutContractCodeRequest.ts#L3)

___

### TevmPutContractCodeResponse

Ƭ **TevmPutContractCodeResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_putContractCode"`` |
| `result` | `PutContractCodeResponse` |

#### Defined in

[vm/jsonrpc/src/responses/TevmPutContractCodeResponse.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/responses/TevmPutContractCodeResponse.ts#L3)

___

### TevmScriptRequest

Ƭ **TevmScriptRequest**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_script"`` |
| `params` | `RunScriptAction`\<`TAbi`, `TFunctionName`\> |

#### Defined in

[vm/jsonrpc/src/requests/TevmScriptRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/requests/TevmScriptRequest.ts#L4)

___

### TevmScriptResponse

Ƭ **TevmScriptResponse**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` \| `number` \| ``null`` |
| `jsonrpc` | ``"2.0"`` |
| `method` | ``"tevm_script"`` |
| `result` | `RunScriptResponse`\<`TAbi`, `TFunctionName`\> |

#### Defined in

[vm/jsonrpc/src/responses/TevmScriptResponse.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/responses/TevmScriptResponse.ts#L4)

## Functions

### createHttpHandler

▸ **createHttpHandler**(`«destructured»`): (`req`: `IncomingMessage`, `res`: `ServerResponse`\<`IncomingMessage`\>) => `Promise`\<`void`\>

Creates an http request handler for tevm requests

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `CreatehttpHandlerParameters` |

#### Returns

`fn`

▸ (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `IncomingMessage` |
| `res` | `ServerResponse`\<`IncomingMessage`\> |

##### Returns

`Promise`\<`void`\>

#### Defined in

[vm/jsonrpc/src/createHttpHandler.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createHttpHandler.ts#L17)

___

### createJsonRpcClient

▸ **createJsonRpcClient**(`evm`): \<TRequest\>(`request`: `TRequest`) => `Promise`\<[`BackendReturnType`](modules.md#backendreturntype)\<`TRequest`\>\>

Creates a vanillajs jsonrpc handler for tevm requests
Infers return type from request

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`fn`

▸ \<`TRequest`\>(`request`): `Promise`\<[`BackendReturnType`](modules.md#backendreturntype)\<`TRequest`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`TevmJsonRpcRequest`](modules.md#tevmjsonrpcrequest) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<[`BackendReturnType`](modules.md#backendreturntype)\<`TRequest`\>\>

**`Example`**

```typescript
const handler = createJsonrpcClient(tevm)
const res = await handler({
 jsonrpc: '2.0',
 id: '1',
 method: 'tevm_call',
 params: {
   to: '0x000000000'
 }
})
```

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L66)

___

### tevmCall

▸ **tevmCall**(`evm`, `request`): `Promise`\<[`TevmCallResponse`](modules.md#tevmcallresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `request` | [`TevmCallRequest`](modules.md#tevmcallrequest) |

#### Returns

`Promise`\<[`TevmCallResponse`](modules.md#tevmcallresponse)\>

#### Defined in

[vm/jsonrpc/src/handlers/tevmCall.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/handlers/tevmCall.js#L8)

___

### tevmContractCall

▸ **tevmContractCall**\<`TAbi`, `TFunctionName`\>(`evm`, `request`): `Promise`\<[`TevmContractCallResponse`](modules.md#tevmcontractcallresponse)\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `request` | [`TevmContractCallRequest`](modules.md#tevmcontractcallrequest)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`TevmContractCallResponse`](modules.md#tevmcontractcallresponse)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[vm/jsonrpc/src/handlers/TevmContractCallGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/handlers/TevmContractCallGeneric.ts#L6)

___

### tevmPutAccount

▸ **tevmPutAccount**(`evm`, `request`): `Promise`\<[`TevmPutAccountResponse`](modules.md#tevmputaccountresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `request` | [`TevmPutAccountRequest`](modules.md#tevmputaccountrequest) |

#### Returns

`Promise`\<[`TevmPutAccountResponse`](modules.md#tevmputaccountresponse)\>

#### Defined in

[vm/jsonrpc/src/handlers/tevmPutAccount.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/handlers/tevmPutAccount.js#L8)

___

### tevmPutContractCode

▸ **tevmPutContractCode**(`evm`, `request`): `Promise`\<[`TevmPutContractCodeResponse`](modules.md#tevmputcontractcoderesponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `request` | [`TevmPutContractCodeRequest`](modules.md#tevmputcontractcoderequest) |

#### Returns

`Promise`\<[`TevmPutContractCodeResponse`](modules.md#tevmputcontractcoderesponse)\>

#### Defined in

[vm/jsonrpc/src/handlers/tevmPutContractCode.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/handlers/tevmPutContractCode.js#L8)

___

### tevmScript

▸ **tevmScript**\<`TAbi`, `TFunctionName`\>(`evm`, `request`): `Promise`\<[`TevmScriptResponse`](modules.md#tevmscriptresponse)\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `request` | [`TevmScriptRequest`](modules.md#tevmscriptrequest)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`TevmScriptResponse`](modules.md#tevmscriptresponse)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[vm/jsonrpc/src/handlers/TevmScriptGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/handlers/TevmScriptGeneric.ts#L6)
