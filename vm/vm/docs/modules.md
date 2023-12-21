[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [Cache](undefined)
- [EthersStateManager](undefined)
- [ViemStateManager](undefined)

### Interfaces

- [EthersStateManagerOpts](undefined)
- [ViemStateManagerOpts](undefined)

### Type Aliases

- [Client](undefined)
- [CreateEVMOptions](undefined)
- [PutAccountAction](undefined)
- [PutContractCodeAction](undefined)
- [RunCallAction](undefined)
- [Tevm](undefined)

### Variables

- [CallActionValidator](undefined)
- [PutAccountActionValidator](undefined)
- [PutContractCodeActionValidator](undefined)
- [RunContractCallActionValidator](undefined)
- [RunScriptActionValidator](undefined)
- [defaultCaller](undefined)
- [defaultGasLimit](undefined)

### Functions

- [createClient](undefined)
- [createTevm](undefined)
- [putAccountHandler](undefined)
- [putContractCodeHandler](undefined)
- [runCallHandler](undefined)
- [runContractCallHandler](undefined)
- [runScriptHandler](undefined)
- [tevmCall](undefined)
- [tevmContractCall](undefined)
- [tevmPutAccount](undefined)
- [tevmPutContractCode](undefined)
- [tevmScript](undefined)

## Classes

### Cache

• **Cache**: Class Cache

#### Defined in

[vm/vm/src/stateManager/Cache.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/stateManager/Cache.ts#L13)

___

### EthersStateManager

• **EthersStateManager**: Class EthersStateManager

#### Defined in

[vm/vm/src/stateManager/EthersStateManager.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/stateManager/EthersStateManager.ts#L82)

___

### ViemStateManager

• **ViemStateManager**: Class ViemStateManager

A state manager that will fetch state from rpc using a viem public client and cache it for
f future requests

#### Defined in

[vm/vm/src/stateManager/ViemStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/stateManager/ViemStateManager.ts#L37)

## Interfaces

### EthersStateManagerOpts

• **EthersStateManagerOpts**: Interface EthersStateManagerOpts

#### Defined in

[vm/vm/src/stateManager/EthersStateManager.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/stateManager/EthersStateManager.ts#L77)

___

### ViemStateManagerOpts

• **ViemStateManagerOpts**: Interface ViemStateManagerOpts

#### Defined in

[vm/vm/src/stateManager/ViemStateManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/stateManager/ViemStateManager.ts#L28)

## Type Aliases

### Client

Ƭ **Client**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `putAccount` | Method putAccount |
| `putContractCode` | Method putContractCode |
| `request` | Method request |
| `runCall` | Method runCall |
| `runContractCall` | Method runContractCall |
| `runScript` | Method runScript |

#### Defined in

[vm/vm/src/client/createClient.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L17)

___

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowUnlimitedContractSize?` | boolean |
| `customPrecompiles?` | CustomPrecompile[] |
| `fork?` | ForkOptions |

#### Defined in

[vm/vm/src/Tevm.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L38)

___

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

Tevm action to put an account into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | Address |
| `balance?` | bigint |

#### Defined in

[vm/vm/src/actions/putAccount/PutAccountAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount/PutAccountAction.ts#L6)

___

### PutContractCodeAction

Ƭ **PutContractCodeAction**: `Object`

Tevm action to put contract code into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contractAddress` | Address |
| `deployedBytecode` | Hex |

#### Defined in

[vm/vm/src/actions/putContractCode/PutContractCodeAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode/PutContractCodeAction.ts#L6)

___

### RunCallAction

Ƭ **RunCallAction**: `Object`

Tevm action to execute a call on the vm

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caller` | Address |
| `data` | Hex |
| `gasLimit?` | bigint |
| `origin?` | Address |
| `to?` | Address |
| `value?` | bigint |

#### Defined in

[vm/vm/src/actions/runCall/RunCallAction.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall/RunCallAction.ts#L6)

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
| `_evm` | EVM | Internal instance of the EVM. Can be used for lower level operations but is not guaranteed to stay stable between versions |
| `createHttpHandler` | Function | - |
| `createJsonRpcClient` | Function | - |
| `forkUrl?` | string | Fork url if the EVM is forked |
| `putAccount` | Function | - |
| `putContractCode` | Function | - |
| `request` | Function | - |
| `runCall` | Function | - |
| `runContractCall` | Function | - |
| `runScript` | Function | - |

#### Defined in

[vm/vm/src/Tevm.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L97)

## Variables

### CallActionValidator

• `Const` **CallActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/runCall/CallActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall/CallActionValidator.js#L5)

___

### PutAccountActionValidator

• `Const` **PutAccountActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/putAccount/PutAccountActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount/PutAccountActionValidator.js#L5)

___

### PutContractCodeActionValidator

• `Const` **PutContractCodeActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/putContractCode/PutContractCodeActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode/PutContractCodeActionValidator.js#L5)

___

### RunContractCallActionValidator

• `Const` **RunContractCallActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/contractCall/RunContractCallActionValidator.js:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/contractCall/RunContractCallActionValidator.js#L4)

___

### RunScriptActionValidator

• `Const` **RunScriptActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/runScript/RunScriptActionValidator.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript/RunScriptActionValidator.js#L5)

___

### defaultCaller

• `Const` **defaultCaller**: "0x0000000000000000000000000000000000000000" = `'0x0000000000000000000000000000000000000000'`

#### Defined in

[vm/vm/src/actions/contractCall/defaultCaller.js:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/contractCall/defaultCaller.js#L1)

___

### defaultGasLimit

• `Const` **defaultGasLimit**: bigint

#### Defined in

[vm/vm/src/actions/contractCall/defaultGasLimit.js:1](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/contractCall/defaultGasLimit.js#L1)

## Functions

### createClient

▸ **createClient**(`rpcUrl`): Client

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | string |

#### Returns

Client

#### Defined in

[vm/vm/src/client/createClient.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L38)

___

### createTevm

▸ **createTevm**(`options?`): Promise\<Tevm\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | CreateEVMOptions |

#### Returns

Promise\<Tevm\>

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

___

### putAccountHandler

▸ **putAccountHandler**(`tevm`, `action`): Promise\<Account\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tevm` | Tevm |
| `action` | PutAccountAction |

#### Returns

Promise\<Account\>

#### Defined in

[vm/vm/src/actions/putAccount/putAccountHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount/putAccountHandler.js#L13)

___

### putContractCodeHandler

▸ **putContractCodeHandler**(`tevm`, `action`): Promise\<Uint8Array\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tevm` | Tevm |
| `action` | PutContractCodeAction |

#### Returns

Promise\<Uint8Array\>

#### Defined in

[vm/vm/src/actions/putContractCode/putContractCodeHandler.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode/putContractCodeHandler.js#L9)

___

### runCallHandler

▸ **runCallHandler**(`tevm`, `action`): Promise\<EVMResult\>

Executes a call on the vm

#### Parameters

| Name | Type |
| :------ | :------ |
| `tevm` | Tevm |
| `action` | RunCallAction |

#### Returns

Promise\<EVMResult\>

#### Defined in

[vm/vm/src/actions/runCall/runCallHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall/runCallHandler.js#L10)

___

### runContractCallHandler

▸ **runContractCallHandler**\<`TAbi`, `TFunctionName`\>(`tevm`, `action`): Promise\<RunContractCallResult\<TAbi, TFunctionName\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tevm` | Tevm |
| `action` | RunContractCallAction\<TAbi, TFunctionName\> |

#### Returns

Promise\<RunContractCallResult\<TAbi, TFunctionName\>\>

#### Defined in

[vm/vm/src/actions/contractCall/RunContractCallHandlerGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/contractCall/RunContractCallHandlerGeneric.ts#L6)

___

### runScriptHandler

▸ **runScriptHandler**\<`TAbi`, `TFunctionName`\>(`tevm`, `«destructured»`): Promise\<RunScriptResult\<TAbi, TFunctionName\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tevm` | Tevm |
| `«destructured»` | RunScriptAction\<TAbi, TFunctionName\> |

#### Returns

Promise\<RunScriptResult\<TAbi, TFunctionName\>\>

#### Defined in

[vm/vm/src/actions/runScript/RunScriptHandlerGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript/RunScriptHandlerGeneric.ts#L6)

___

### tevmCall

▸ **tevmCall**(`vm`, `request`): Promise\<TevmCallResponse\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | Tevm |
| `request` | TevmCallRequest |

#### Returns

Promise\<TevmCallResponse\>

#### Defined in

[vm/vm/src/jsonrpc/runCall/tevmCall.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/jsonrpc/runCall/tevmCall.js#L8)

___

### tevmContractCall

▸ **tevmContractCall**\<`TAbi`, `TFunctionName`\>(`vm`, `request`): Promise\<TevmContractCallResponse\<TAbi, TFunctionName\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | Tevm |
| `request` | TevmContractCallRequest\<TAbi, TFunctionName\> |

#### Returns

Promise\<TevmContractCallResponse\<TAbi, TFunctionName\>\>

#### Defined in

[vm/vm/src/jsonrpc/contractCall/TevmContractCallGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/jsonrpc/contractCall/TevmContractCallGeneric.ts#L6)

___

### tevmPutAccount

▸ **tevmPutAccount**(`vm`, `request`): Promise\<TevmPutAccountResponse\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | Tevm |
| `request` | TevmPutAccountRequest |

#### Returns

Promise\<TevmPutAccountResponse\>

#### Defined in

[vm/vm/src/jsonrpc/putAccount/tevmPutAccount.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/jsonrpc/putAccount/tevmPutAccount.js#L8)

___

### tevmPutContractCode

▸ **tevmPutContractCode**(`vm`, `request`): Promise\<TevmPutContractCodeResponse\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | Tevm |
| `request` | TevmPutContractCodeRequest |

#### Returns

Promise\<TevmPutContractCodeResponse\>

#### Defined in

[vm/vm/src/jsonrpc/putContractCode/tevmPutContractCode.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/jsonrpc/putContractCode/tevmPutContractCode.js#L8)

___

### tevmScript

▸ **tevmScript**\<`TAbi`, `TFunctionName`\>(`vm`, `request`): Promise\<TevmScriptResponse\<TAbi, TFunctionName\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | Tevm |
| `request` | TevmScriptRequest\<TAbi, TFunctionName\> |

#### Returns

Promise\<TevmScriptResponse\<TAbi, TFunctionName\>\>

#### Defined in

[vm/vm/src/jsonrpc/runScript/TevmScriptGeneric.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/jsonrpc/runScript/TevmScriptGeneric.ts#L6)
