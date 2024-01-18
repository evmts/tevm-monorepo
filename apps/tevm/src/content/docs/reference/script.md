### ScriptError

Ƭ **ScriptError**: [`ContractError`](modules.md#contracterror) \| [`InvalidBytecodeError`](modules.md#invalidbytecodeerror) \| [`InvalidDeployedBytecodeError`](modules.md#invaliddeployedbytecodeerror)

Error type of errors thrown by the script procedure

**`Example`**

```ts
const {errors} = await tevm.script({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidBytecodeError
 console.log(errors[0].message) // Invalid bytecode should be a hex string: 1234
}
```

#### Defined in

[errors/ScriptError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ScriptError.ts#L14)

___

### ScriptHandler

Ƭ **ScriptHandler**: \<TAbi, TFunctionName\>(`params`: [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\>) => `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Type declaration

▸ \<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

Handler for script tevm procedure

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ScriptParams`](modules.md#scriptparams)\<`TAbi`, `TFunctionName`\> |

##### Returns

`Promise`\<[`ScriptResult`](modules.md#scriptresult)\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[handlers/ScriptHandler.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ScriptHandler.ts#L8)

___

### ScriptJsonRpcProcedure

Ƭ **ScriptJsonRpcProcedure**: (`request`: [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest)) => `Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

Procedure for handling script JSON-RPC requests

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest) |

##### Returns

`Promise`\<[`ScriptJsonRpcResponse`](modules.md#scriptjsonrpcresponse)\>

#### Defined in

[procedure/ScriptJsonRpcProcedure.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ScriptJsonRpcProcedure.ts#L6)

___

### ScriptJsonRpcRequest

Ƭ **ScriptJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"tevm_script"``, `SerializedParams`\>

The JSON-RPC request for the `tevm_script` method

#### Defined in

[requests/ScriptJsonRpcRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/ScriptJsonRpcRequest.ts#L26)

___

### ScriptJsonRpcResponse

Ƭ **ScriptJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"tevm_script"``, `SerializeToJson`\<[`CallResult`](modules.md#callresult)\>, [`ScriptError`](modules.md#scripterror)[``"_tag"``]\>

JSON-RPC response for `tevm_script` procedure

#### Defined in

[responses/ScriptJsonRpcResponse.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/ScriptJsonRpcResponse.ts#L8)

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](modules.md#basecallparams) & \{ `deployedBytecode`: `Hex`  }

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

#### Defined in

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/ScriptParams.ts#L12)

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](modules.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](modules.md#scripterror) |

#### Defined in

[result/ScriptResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ScriptResult.ts#L6)

___

