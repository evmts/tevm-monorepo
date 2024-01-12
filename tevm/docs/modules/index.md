[tevm](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### Type Aliases

- [Abi](index.md#abi)
- [AccountParams](index.md#accountparams)
- [AccountResult](index.md#accountresult)
- [Address](index.md#address)
- [CallParams](index.md#callparams)
- [CallResult](index.md#callresult)
- [ContractParams](index.md#contractparams)
- [ContractResult](index.md#contractresult)
- [Hex](index.md#hex)
- [MemoryClient](index.md#memoryclient)
- [RemoteClient](index.md#remoteclient)
- [ScriptParams](index.md#scriptparams)
- [ScriptResult](index.md#scriptresult)
- [TevmContract](index.md#tevmcontract)
- [TevmJsonRpcRequest](index.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](index.md#tevmjsonrpcrequesthandler)

### Functions

- [createMemoryClient](index.md#creatememoryclient)
- [createRemoteClient](index.md#createremoteclient)
- [createTevm](index.md#createtevm)
- [createTevmContract](index.md#createtevmcontract)
- [decodeFunctionData](index.md#decodefunctiondata)
- [decodeFunctionResult](index.md#decodefunctionresult)
- [encodeFunctionData](index.md#encodefunctiondata)
- [encodeFunctionResult](index.md#encodefunctionresult)
- [parseAbi](index.md#parseabi)

## Type Aliases

### Abi

Ƭ **Abi**: readonly (`AbiConstructor` \| `AbiError` \| `AbiEvent` \| `AbiFallback` \| `AbiFunction` \| `AbiReceive`)[]

Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

#### Defined in

node_modules/.pnpm/abitype@0.10.3_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:118

___

### AccountParams

Ƭ **AccountParams**: `Object`

Tevm params to put an account into the vm state

**`Example`**

```ts
// all fields are optional except address
const accountParams: import('@tevm/api').AccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](index.md#address) | Address of account |
| `balance?` | `bigint` | Balance to set account to |
| `deployedBytecode?` | `Hex` | Contract bytecode to set account to |
| `nonce?` | `bigint` | Nonce to set account to |
| `storageRoot?` | `Hex` | Storage root to set account to |

#### Defined in

vm/api/dist/index.d.ts:17

___

### AccountResult

Ƭ **AccountResult**\<`ErrorType`\>: `Object`

Result of Account Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`AccountError`](api.md#accounterror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

vm/api/dist/index.d.ts:963

___

### Address

Ƭ **Address**: `ResolvedRegister`[``"AddressType"``]

#### Defined in

node_modules/.pnpm/abitype@0.10.3_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:3

___

### CallParams

Ƭ **CallParams**: [`BaseCallParams`](api.md#basecallparams) & \{ `data?`: `Hex` ; `deployedBytecode?`: `Hex` ; `salt?`: `Hex`  }

Tevm params to execute a call on the vm
Call is the lowest level method to interact with the vm
and other messages such as contract and script are using call
under the hood

**`Example`**

```ts
const callParams: import('@tevm/api').CallParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}
```

#### Defined in

vm/api/dist/index.d.ts:142

___

### CallResult

Ƭ **CallResult**\<`ErrorType`\>: `Object`

Result of a Tevm VM Call method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`CallError`](api.md#callerror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `createdAddress?` | [`Address`](index.md#address) | Address of created account during transaction, if any |
| `createdAddresses?` | `Set`\<[`Address`](index.md#address)\> | Map of addresses which were created (used in EIP 6780) |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `executionGasUsed` | `bigint` | Amount of gas the code used to run |
| `gas?` | `bigint` | Amount of gas left |
| `gasRefund?` | `bigint` | The gas refund counter as a uint256 |
| `logs?` | [`Log`](api.md#log)[] | Array of logs that the contract emitted |
| `rawData` | `Hex` | Encoded return value from the contract as hex string |
| `selfdestruct?` | `Set`\<[`Address`](index.md#address)\> | A set of accounts to selfdestruct |

#### Defined in

vm/api/dist/index.d.ts:973

___

### ContractParams

Ƭ **ContractParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](api.md#basecallparams) & \{ `to`: [`Address`](index.md#address)  }

Tevm params to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

#### Defined in

vm/api/dist/index.d.ts:160

___

### ContractResult

Ƭ **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](index.md#callresult), ``"errors"``\> & \{ `data`: `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\> ; `errors?`: `never`  } \| [`CallResult`](index.md#callresult)\<`ErrorType`\> & \{ `data?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | [`ContractError`](api.md#contracterror) |

#### Defined in

vm/api/dist/index.d.ts:1016

___

### Hex

Ƭ **Hex**: \`0x$\{string}\`

#### Defined in

node_modules/.pnpm/viem@2.0.3_typescript@5.3.3/node_modules/viem/_types/types/misc.d.ts:2

___

### MemoryClient

Ƭ **MemoryClient**: `Awaited`\<`ReturnType`\<typeof [`createMemoryClient`](index.md#creatememoryclient)\>\>

#### Defined in

vm/client/dist/index.d.ts:19

___

### RemoteClient

Ƭ **RemoteClient**: `ReturnType`\<typeof [`createRemoteClient`](index.md#createremoteclient)\>

#### Defined in

vm/client/dist/index.d.ts:10

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](api.md#basecallparams) & \{ `deployedBytecode`: `Hex`  }

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |

#### Defined in

vm/api/dist/index.d.ts:170

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](api.md#scripterror) |

#### Defined in

vm/api/dist/index.d.ts:1026

___

### TevmContract

Ƭ **TevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`\<`THumanReadableAbi`\> |
| `bytecode` | `TBytecode` |
| `deployedBytecode` | `TDeployedBytecode` |
| `events` | `Events`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | `Read`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `write` | `Write`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |

#### Defined in

packages/contract/dist/index.d.ts:70

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`AccountJsonRpcRequest`](api.md#accountjsonrpcrequest) \| [`CallJsonRpcRequest`](api.md#calljsonrpcrequest) \| [`ContractJsonRpcRequest`](api.md#contractjsonrpcrequest) \| [`ScriptJsonRpcRequest`](api.md#scriptjsonrpcrequest) \| `LoadStateJsonRpcRequest` \| `DumpStateJsonRpcRequest`

A Tevm JSON-RPC request
`tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`

#### Defined in

vm/api/dist/index.d.ts:1391

___

### TevmJsonRpcRequestHandler

Ƭ **TevmJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

Type of a JSON-RPC request handler for tevm procedures
Generic and returns the correct response type for a given request

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`TevmJsonRpcRequest`](index.md#tevmjsonrpcrequest) \| `EthJsonRpcRequest` \| `AnvilJsonRpcRequest` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

#### Defined in

vm/api/dist/index.d.ts:2125

## Functions

### createMemoryClient

▸ **createMemoryClient**(`params`): `Promise`\<`viem.Client`\<`viem.HttpTransport`, `undefined`, `undefined`, `viem.PublicRpcSchema`, \{ `tevm`: [`Tevm`](vm.md#tevm)  } & `viem.PublicActions`\<`viem.HttpTransport`, `undefined`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CreateEVMOptions`](vm.md#createevmoptions) & \{ `fork`: \{ `url`: `string`  }  } |

#### Returns

`Promise`\<`viem.Client`\<`viem.HttpTransport`, `undefined`, `undefined`, `viem.PublicRpcSchema`, \{ `tevm`: [`Tevm`](vm.md#tevm)  } & `viem.PublicActions`\<`viem.HttpTransport`, `undefined`\>\>\>

#### Defined in

vm/client/dist/index.d.ts:12

___

### createRemoteClient

▸ **createRemoteClient**(`«destructured»`): `viem.Client`\<`viem.HttpTransport`, `undefined`, `undefined`, `viem.PublicRpcSchema`, \{ `tevm`: `Omit`\<`_tevm_api.Tevm`, ``"request"``\>  } & `viem.PublicActions`\<`viem.HttpTransport`, `undefined`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `url` | `string` |

#### Returns

`viem.Client`\<`viem.HttpTransport`, `undefined`, `undefined`, `viem.PublicRpcSchema`, \{ `tevm`: `Omit`\<`_tevm_api.Tevm`, ``"request"``\>  } & `viem.PublicActions`\<`viem.HttpTransport`, `undefined`\>\>

#### Defined in

vm/client/dist/index.d.ts:5

___

### createTevm

▸ **createTevm**(`options?`): `Promise`\<[`Tevm`](vm.md#tevm)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CreateEVMOptions`](vm.md#createevmoptions) |

#### Returns

`Promise`\<[`Tevm`](vm.md#tevm)\>

#### Defined in

vm/vm/dist/index.d.ts:97

___

### createTevmContract

▸ **createTevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`TevmContract`](index.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`TevmContract`](index.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>, ``"name"`` \| ``"deployedBytecode"`` \| ``"bytecode"`` \| ``"humanReadableAbi"``\> |

#### Returns

[`TevmContract`](index.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

packages/contract/dist/index.d.ts:81

___

### decodeFunctionData

▸ **decodeFunctionData**\<`abi`\>(`parameters`): `DecodeFunctionDataReturnType`\<`abi`, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends `Abi` \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionDataParameters`\<`abi`\> |

#### Returns

`DecodeFunctionDataReturnType`\<`abi`, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionData.d.ts:25

___

### decodeFunctionResult

▸ **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `DecodeFunctionResultReturnType`\<`abi`, `functionName`, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends `Abi` \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |
| `args` | extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`\> ? `functionName` : `ContractFunctionName`\<`abi`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`DecodeFunctionResultReturnType`\<`abi`, `functionName`, `args`\>

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:25

___

### encodeFunctionData

▸ **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends `Abi` \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionDataParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionDataReturnType`

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:27

___

### encodeFunctionResult

▸ **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends `Abi` \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionResultReturnType`

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionResult.d.ts:21

___

### parseAbi

▸ **parseAbi**\<`TSignatures`\>(`signatures`): `ParseAbi`\<`TSignatures`\>

Parses human-readable ABI into JSON [Abi](index.md#abi)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSignatures` | extends readonly `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signatures` | `TSignatures`[``"length"``] extends ``0`` ? [``"Error: At least one signature required"``] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\> | Human-Readable ABI |

#### Returns

`ParseAbi`\<`TSignatures`\>

Parsed [Abi](index.md#abi)

**`Example`**

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

#### Defined in

node_modules/.pnpm/abitype@0.10.2_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
