---
title: Example Reference
description: A reference page in my new Starlight docs site.
---
### Tevm

Ƭ **Tevm**: `Tevm` & \{ `_evm`: `TevmEvm` ; `_vm`: `VM` ; `forkUrl?`: `string`  }

A local EVM instance running in the browser or Node.js. Similar to anvil in browser.

**`Example`**

```ts
import { createTevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = createTevm({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
const contractAddress = '0x43db6BF26964aF9D7eEd9e03E53415D37a000002'

await tevm.contract(
  MyERC721.withAddress(contractAddress).write.mint({
    caller: address,
  }),
)

const balance = await tevm.contract(
 MyERC721.read.balanceOf({
 caller: address,
 }),
)
 console.log(balance) // 1n
 ```

#### Defined in

[vm/vm/src/Tevm.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L35)

### createTevm

▸ **createTevm**(`options?`): `Promise`\<[`Tevm`](modules.md#tevm)\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CreateEVMOptions`](modules.md#createevmoptions) |

#### Returns

`Promise`\<[`Tevm`](modules.md#tevm)\>

**`Example`**

```ts
import { Tevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = createTevm({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await tevm.runContractCall(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n

## Tevm

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | [`AccountHandler`](./account.md#accounthandler) |
| `call` | [`CallHandler`](./call.md#callhandler) |
| `contract` | [`ContractHandler`](./contract.md#contracthandler) |
| `request` | [`TevmJsonRpcRequestHandler`](#tevmjsonrpcrequesthandler) |
| `script` | [`ScriptHandler`](./script.md#scripthandler) |
| `eth.blockNumber` | [`EthBlockNumberHandler`](./eth.md#ethblocknumberhandler) |
| `eth.chainId` | [`EthChainIdHandler`](./eth.md#ethchainidhandler) |
| `eth.gasPrice` | [`EthGasPriceHandler`](./eth.md#ethgaspricehandler) |
| `eth.getBalance` | [`EthGetBalanceHandler`](./eth.md#ethgetbalancehandler) |
| `eth.getCode` | [`EthGetCodeHandler`](./eth.md#ethgetcodehandler) |
| `eth.getStorageAt` | [`EthGetStorageAtHandler`](./eth.md#ethgetstorageathandler) |

#### Defined in

[Tevm.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/Tevm.ts#L23)

#### Implemented in

- VM implementation

[vm/vm/src/createTevm.js:56](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/createTevm.js#L56)

- Remote JSON-RPC client implementation

[vm/client/src/createRemoteClient.js](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createRemoteClient.js)

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`AccountJsonRpcRequest`](modules.md#accountjsonrpcrequest) \| [`CallJsonRpcRequest`](modules.md#calljsonrpcrequest) \| [`ContractJsonRpcRequest`](modules.md#contractjsonrpcrequest) \| [`ScriptJsonRpcRequest`](modules.md#scriptjsonrpcrequest)

A Tevm JSON-RPC request
`tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`

#### Defined in

[requests/TevmJsonRpcRequest.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/TevmJsonRpcRequest.ts#L10)

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
| `TRequest` | extends [`TevmJsonRpcRequest`](modules.md#tevmjsonrpcrequest) \| [`EthJsonRpcRequest`](modules.md#ethjsonrpcrequest) \| `AnvilJsonRpcRequest` \| `DebugJsonRpcRequest` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<`ReturnType`\<`TRequest`[``"method"``]\>\>

#### Defined in

[TevmJsonRpcRequestHandler.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L148)

___

[@tevm/vm](README.md) / Exports

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` |
| `customPrecompiles?` | [`CustomPrecompile`](modules.md#customprecompile)[] |
| `customPredeploys?` | `ReadonlyArray`\<`CustomPredeploy`\<`any`, `any`\>\> |
| `fork?` | [`ForkOptions`](modules.md#forkoptions) |

#### Defined in

[vm/vm/src/CreateEVMOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/CreateEVMOptions.ts#L8)

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

TODO This should be publically exported from ethereumjs but isn't
Typing this by hand is tedious so we are using some typescript inference to get it
do a pr to export this from ethereumjs and then replace this with an import
TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm

#### Defined in

[vm/vm/src/CustomPrecompile.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/CustomPrecompile.ts#L16)

___

### ForkOptions

Ƭ **ForkOptions**: `Object`

Options fetch state that isn't available locally.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag?` | `bigint` | The block tag to use for the EVM. If not passed it will start from the latest block at the time of forking |
| `url` | `string` | A viem PublicClient to use for the EVM. It will be used to fetch state that isn't available locally. |

#### Defined in

[vm/vm/src/ForkOptions.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/ForkOptions.ts#L4)

