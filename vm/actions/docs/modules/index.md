[@tevm/vm](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### Type Aliases

- [Client](index.md#client)
- [CreateEVMOptions](index.md#createevmoptions)
- [Tevm](index.md#tevm)

### Functions

- [createClient](index.md#createclient)
- [createTevm](index.md#createtevm)

## Type Aliases

### Client

Ƭ **Client**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `putAccount` | (`action`: `PutAccountAction`) => `Promise`\<`TevmPutAccountResponse`\> |
| `putContractCode` | (`action`: `PutContractCodeAction`) => `Promise`\<`TevmPutContractCodeResponse`\> |
| `request` | \<T\>(`r`: `T`) => `Promise`\<`BackendReturnType`\<`T`\>\> |
| `runCall` | (`action`: `RunCallAction`) => `Promise`\<`TevmCallResponse`\> |
| `runContractCall` | \<TAbi, TFunctionName\>(`action`: `RunContractCallAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunContractCallResult`\<`TAbi`, `TFunctionName`\>\> |
| `runScript` | \<TAbi, TFunctionName\>(`action`: `RunScriptAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunScriptResult`\<`TAbi`, `TFunctionName`\>\> |

#### Defined in

[vm/vm/src/client/createClient.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L17)

___

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` |
| `customPrecompiles?` | `CustomPrecompile`[] |
| `customPredeploys?` | `CustomPredeploy`[] |
| `fork?` | `ForkOptions` |

#### Defined in

[vm/vm/src/Tevm.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L38)

___

### Tevm

Ƭ **Tevm**: `Object`

A local EVM instance running in JavaScript. Similar to Anvil in your browser

**`Example`**

```ts
import { Tevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = Tevm.create({
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
 ```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_evm` | `EVM` | Internal instance of the EVM. Can be used for lower level operations but is not guaranteed to stay stable between versions |
| `createHttpHandler` | () => `ReturnType`\<typeof `createHttpHandler`\> | Creates a httpHandler that can be used with node http server |
| `createJsonRpcClient` | () => `JsonRpcClient` | Creates a jsonrpc client |
| `forkUrl?` | `string` | Fork url if the EVM is forked |
| `putAccount` | (`action`: `PutAccountAction`) => `Promise`\<`Account`\> | Puts an account with ether balance into the state **`Example`** ```ts tevm.putAccount({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', balance: 100n, }) ``` |
| `putContractCode` | (`action`: `PutContractCodeAction`) => `Promise`\<`Uint8Array`\> | Puts a contract into the state **`Example`** ```ts tevm.putContract({ bytecode, contractAddress, }) ``` |
| `request` | \<TRequest\>(`request`: `TRequest`) => `Promise`\<`BackendReturnType`\<`TRequest`\>\> | Executes a jsonrpc request |
| `runCall` | (`action`: `RunCallAction`) => `Promise`\<`EVMResult`\> | Executes a call on the EVM **`Example`** ```ts const result = await tevm.runCall({ data: '0x...', caller: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', gasLimit: 1000000n, value: 10000000000000000n, }) ``` |
| `runContractCall` | \<TAbi, TFunctionName\>(`action`: `RunContractCallAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunContractCallResult`\<`TAbi`, `TFunctionName`\>\> | Calls contract code using an ABI and returns the decoded result **`Example`** ```ts const result = await tevm.runContractCall({ abi: MyContract.abi, contractAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', functionName: 'balanceOf', args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'], }) ``` |
| `runScript` | \<TAbi, TFunctionName\>(`action`: `RunScriptAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunScriptResult`\<`TAbi`, `TFunctionName`\>\> | Runs a script or contract that is not deployed to the chain The recomended way to use a script is with an Tevm import **`Example`** ```ts // Scripts require bytecode import { MyContractOrScript } from './MyContractOrScript.sol' with { tevm: 'bytecode' } tevm.runScript( MyContractOrScript.script.run() ) ``` Scripts can also be called directly via passing in args **`Example`** ```ts tevm.runScript({ bytecode, abi, functionName: 'run', }) ``` |

#### Defined in

[vm/vm/src/Tevm.ts:98](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L98)

## Functions

### createClient

▸ **createClient**(`rpcUrl`): [`Client`](index.md#client)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | `string` |

#### Returns

[`Client`](index.md#client)

#### Defined in

[vm/vm/src/client/createClient.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L38)

___

### createTevm

▸ **createTevm**(`options?`): `Promise`\<[`Tevm`](index.md#tevm)\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CreateEVMOptions`](index.md#createevmoptions) |

#### Returns

`Promise`\<[`Tevm`](index.md#tevm)\>

**`Example`**

```ts
import { Tevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = Tevm.create({
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
 ```

#### Defined in

[vm/vm/src/createTevm.js:47](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/createTevm.js#L47)
