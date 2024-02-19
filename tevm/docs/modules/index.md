[tevm](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [bytesToBigInt](index.md#bytestobigint)

### Classes

- [Predeploy](../classes/index.Predeploy.md)

### Interfaces

- [ForkStateManagerOpts](../interfaces/index.ForkStateManagerOpts.md)
- [ProxyStateManagerOpts](../interfaces/index.ProxyStateManagerOpts.md)

### Type Aliases

- [Abi](index.md#abi)
- [AbiConstructor](index.md#abiconstructor)
- [AbiEvent](index.md#abievent)
- [AbiFunction](index.md#abifunction)
- [AbiItemType](index.md#abiitemtype)
- [AbiParametersToPrimitiveTypes](index.md#abiparameterstoprimitivetypes)
- [Account](index.md#account)
- [Address](index.md#address)
- [BaseClient](index.md#baseclient)
- [BaseClientOptions](index.md#baseclientoptions)
- [BlockNumber](index.md#blocknumber)
- [BlockParam](index.md#blockparam)
- [BlockTag](index.md#blocktag)
- [CallParams](index.md#callparams)
- [CallResult](index.md#callresult)
- [ConstructorArgument](index.md#constructorargument)
- [Contract](index.md#contract)
- [ContractFunctionName](index.md#contractfunctionname)
- [ContractParams](index.md#contractparams)
- [ContractResult](index.md#contractresult)
- [CreateContract](index.md#createcontract)
- [CreateContractParams](index.md#createcontractparams)
- [CreateEventFilterParameters](index.md#createeventfilterparameters)
- [CreateMemoryDbFn](index.md#creatememorydbfn)
- [CreateScript](index.md#createscript)
- [CreateScriptParams](index.md#createscriptparams)
- [CustomPrecompile](index.md#customprecompile)
- [CustomPredeploy](index.md#custompredeploy)
- [DecodeFunctionResultReturnType](index.md#decodefunctionresultreturntype)
- [EncodeFunctionDataParameters](index.md#encodefunctiondataparameters)
- [EventActionCreator](index.md#eventactioncreator)
- [Extension](index.md#extension)
- [ExtractAbiEvent](index.md#extractabievent)
- [ExtractAbiEventNames](index.md#extractabieventnames)
- [ExtractAbiEvents](index.md#extractabievents)
- [ExtractAbiFunction](index.md#extractabifunction)
- [ExtractAbiFunctionNames](index.md#extractabifunctionnames)
- [Filter](index.md#filter)
- [FormatAbi](index.md#formatabi)
- [GetAccountParams](index.md#getaccountparams)
- [GetAccountResult](index.md#getaccountresult)
- [GetEventArgs](index.md#geteventargs)
- [HDAccount](index.md#hdaccount)
- [Hardfork](index.md#hardfork)
- [Hex](index.md#hex)
- [JsonRpcRequest](index.md#jsonrpcrequest)
- [JsonRpcRequestTypeFromMethod](index.md#jsonrpcrequesttypefrommethod)
- [JsonRpcResponse](index.md#jsonrpcresponse)
- [JsonRpcReturnTypeFromMethod](index.md#jsonrpcreturntypefrommethod)
- [MemoryClient](index.md#memoryclient)
- [MemoryDb](index.md#memorydb)
- [ParseAbi](index.md#parseabi)
- [ReadActionCreator](index.md#readactioncreator)
- [Script](index.md#script)
- [ScriptParams](index.md#scriptparams)
- [ScriptResult](index.md#scriptresult)
- [SerializableTevmState](index.md#serializabletevmstate)
- [SetAccountParams](index.md#setaccountparams)
- [SetAccountResult](index.md#setaccountresult)
- [TevmClient](index.md#tevmclient)
- [TevmJsonRpcBulkRequestHandler](index.md#tevmjsonrpcbulkrequesthandler)
- [TevmJsonRpcRequest](index.md#tevmjsonrpcrequest)
- [TevmJsonRpcRequestHandler](index.md#tevmjsonrpcrequesthandler)
- [TraceCall](index.md#tracecall)
- [TraceParams](index.md#traceparams)
- [TraceResult](index.md#traceresult)
- [WriteActionCreator](index.md#writeactioncreator)

### Functions

- [boolToBytes](index.md#booltobytes)
- [boolToHex](index.md#booltohex)
- [bytesToBigint](index.md#bytestobigint-1)
- [bytesToBool](index.md#bytestobool)
- [bytesToHex](index.md#bytestohex)
- [bytesToNumber](index.md#bytestonumber)
- [createBaseClient](index.md#createbaseclient)
- [createContract](index.md#createcontract-1)
- [createMemoryClient](index.md#creatememoryclient)
- [createMemoryDb](index.md#creatememorydb)
- [createScript](index.md#createscript-1)
- [decodeAbiParameters](index.md#decodeabiparameters)
- [decodeErrorResult](index.md#decodeerrorresult)
- [decodeEventLog](index.md#decodeeventlog)
- [decodeFunctionData](index.md#decodefunctiondata)
- [decodeFunctionResult](index.md#decodefunctionresult)
- [defineCall](index.md#definecall)
- [definePrecompile](index.md#defineprecompile)
- [definePredeploy](index.md#definepredeploy)
- [encodeAbiParameters](index.md#encodeabiparameters)
- [encodeDeployData](index.md#encodedeploydata)
- [encodeErrorResult](index.md#encodeerrorresult)
- [encodeEventTopics](index.md#encodeeventtopics)
- [encodeFunctionData](index.md#encodefunctiondata)
- [encodeFunctionResult](index.md#encodefunctionresult)
- [encodePacked](index.md#encodepacked)
- [formatAbi](index.md#formatabi-1)
- [formatEther](index.md#formatether)
- [formatGwei](index.md#formatgwei)
- [formatLog](index.md#formatlog)
- [fromBytes](index.md#frombytes)
- [fromHex](index.md#fromhex)
- [fromRlp](index.md#fromrlp)
- [getAddress](index.md#getaddress)
- [hexToBigInt](index.md#hextobigint)
- [hexToBool](index.md#hextobool)
- [hexToBytes](index.md#hextobytes)
- [hexToNumber](index.md#hextonumber)
- [hexToString](index.md#hextostring)
- [isAddress](index.md#isaddress)
- [isBytes](index.md#isbytes)
- [isHex](index.md#ishex)
- [keccak256](index.md#keccak256)
- [mnemonicToAccount](index.md#mnemonictoaccount)
- [numberToHex](index.md#numbertohex)
- [parseAbi](index.md#parseabi-1)
- [parseEther](index.md#parseether)
- [parseGwei](index.md#parsegwei)
- [stringToHex](index.md#stringtohex)
- [toBytes](index.md#tobytes)
- [toHex](index.md#tohex)
- [toRlp](index.md#torlp)

## References

### bytesToBigInt

Renames and re-exports [bytesToBigint](index.md#bytestobigint-1)

## Type Aliases

### Abi

Ƭ **Abi**: readonly ([`AbiConstructor`](index.md#abiconstructor) \| `AbiError` \| [`AbiEvent`](index.md#abievent) \| `AbiFallback` \| [`AbiFunction`](index.md#abifunction) \| `AbiReceive`)[]

Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:118

___

### AbiConstructor

Ƭ **AbiConstructor**: `Object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputs` | readonly `AbiParameter`[] | - |
| `payable?` | `boolean` | **`Deprecated`** use `payable` or `nonpayable` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `stateMutability` | `Extract`\<`AbiStateMutability`, ``"payable"`` \| ``"nonpayable"``\> | - |
| `type` | ``"constructor"`` | - |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:74

___

### AbiEvent

Ƭ **AbiEvent**: `Object`

ABI ["event"](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `anonymous?` | `boolean` |
| `inputs` | readonly `AbiEventParameter`[] |
| `name` | `string` |
| `type` | ``"event"`` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:101

___

### AbiFunction

Ƭ **AbiFunction**: `Object`

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `constant?` | `boolean` | **`Deprecated`** use `pure` or `view` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `gas?` | `number` | **`Deprecated`** Vyper used to provide gas estimates **`See`** https://github.com/vyperlang/vyper/issues/2151 |
| `inputs` | readonly `AbiParameter`[] | - |
| `name` | `string` | - |
| `outputs` | readonly `AbiParameter`[] | - |
| `payable?` | `boolean` | **`Deprecated`** use `payable` or `nonpayable` from AbiStateMutability instead **`See`** https://github.com/ethereum/solidity/issues/992 |
| `stateMutability` | `AbiStateMutability` | - |
| `type` | ``"function"`` | - |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:51

___

### AbiItemType

Ƭ **AbiItemType**: ``"constructor"`` \| ``"error"`` \| ``"event"`` \| ``"fallback"`` \| ``"function"`` \| ``"receive"``

`"type"` name for [Abi](index.md#abi) items.

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:114

___

### AbiParametersToPrimitiveTypes

Ƭ **AbiParametersToPrimitiveTypes**\<`TAbiParameters`, `TAbiParameterKind`\>: `Pretty`\<\{ [K in keyof TAbiParameters]: AbiParameterToPrimitiveType\<TAbiParameters[K], TAbiParameterKind\> }\>

Converts array of AbiParameter to corresponding TypeScript primitive types.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbiParameters` | extends readonly `AbiParameter`[] | Array of AbiParameter to convert to TypeScript representations |
| `TAbiParameterKind` | extends `AbiParameterKind` = `AbiParameterKind` | Optional AbiParameterKind to narrow by parameter type |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:86

___

### Account

Ƭ **Account**\<`TAddress`\>: `JsonRpcAccount`\<`TAddress`\> \| `LocalAccount`\<`string`, `TAddress`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAddress` | extends [`Address`](index.md#address) = [`Address`](index.md#address) |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/types.d.ts:9

___

### Address

Ƭ **Address**: `ResolvedRegister`[``"AddressType"``]

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/abi.d.ts:3

___

### BaseClient

Ƭ **BaseClient**\<`TMode`, `TExtended`\>: \{ `chainId`: `number` ; `extend`: \<TExtension\>(`decorator`: (`client`: [`BaseClient`](index.md#baseclient)\<`TMode`, `TExtended`\>) => `TExtension`) => [`BaseClient`](index.md#baseclient)\<`TMode`, `TExtended` & `TExtension`\> ; `forkUrl?`: `string` ; `mode`: `TMode` ; `vm`: `TevmVm`  } & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMode` | extends ``"fork"`` \| ``"proxy"`` \| ``"normal"`` = ``"fork"`` \| ``"proxy"`` \| ``"normal"`` |
| `TExtended` | {} |

#### Defined in

evmts-monorepo/packages/base-client/types/BaseClient.d.ts:5

___

### BaseClientOptions

Ƭ **BaseClientOptions**: `Object`

Options for creating an Tevm MemoryClient instance

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` | Enable/disable unlimited contract size. Defaults to false. |
| `chainId?` | `number` | Optionally set the chainId. Defaults to chainId of fokred/proxied chain or 900 |
| `customPrecompiles?` | [`CustomPrecompile`](index.md#customprecompile)[] | Custom precompiles allow you to run arbitrary JavaScript code in the EVM. See the [Precompile guide](https://todo.todo) documentation for a deeper dive An ever growing standard library of precompiles is provided at `tevm/precompiles` **`Notice`** Not implemented yet [Implementation pr](https://github.com/evmts/tevm-monorepo/pull/728/files) Below example shows how to make a precompile so you can call `fs.writeFile` and `fs.readFile` in your contracts. Note: this specific precompile is also provided in the standard library For security precompiles can only be added statically when the vm is created. **`Example`** ```ts import { createMemoryClient, defineCall, definePrecompile } from 'tevm' import { createScript } from '@tevm/contract' import fs from 'fs/promises' const Fs = createScript({ name: 'Fs', humanReadableAbi: [ 'function readFile(string path) returns (string)', 'function writeFile(string path, string data) returns (bool)', ] }) const fsPrecompile = definePrecompile({ contract: Fs, address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2', call: defineCall(Fs.abi, { readFile: async ({ args }) => { return { returnValue: await fs.readFile(...args, 'utf8'), executionGasUsed: 0n, } }, writeFile: async ({ args }) => { await fs.writeFile(...args) return { returnValue: true, executionGasUsed: 0n } }, }), }) const tevm = createMemoryClient({ customPrecompiles: [fsPrecompile] }) |
| `customPredeploys?` | `ReadonlyArray`\<[`CustomPredeploy`](index.md#custompredeploy)\<`any`, `any`\>\> | Custom predeploys allow you to deploy arbitrary EVM bytecode to an address. This is a convenience method and equivalent to calling tevm.setAccount() manually to set the contract code. ```typescript const tevm = createMemoryClient({ customPredeploys: [ // can pass a `tevm Script` here as well { address: '0x420420...', abi: [...], deployedBytecode: '0x420420...', } ], }) ``` |
| `eips?` | `ReadonlyArray`\<`number`\> | Eips to enable. Defaults to `[1559, 4895]` |
| `fork?` | [`ForkStateManagerOpts`](../interfaces/index.ForkStateManagerOpts.md) | Fork options fork a live network if enabled. When in fork mode Tevm will fetch and cache all state from the block forked from the provided URL Cannot be set if `proxy` is also set |
| `hardfork?` | [`Hardfork`](index.md#hardfork) | Hardfork to use. Defaults to `shanghai` |
| `profiler?` | `boolean` | Enable profiler. Defaults to false. |
| `proxy?` | [`ProxyStateManagerOpts`](../interfaces/index.ProxyStateManagerOpts.md) | Options to initialize the client in `proxy` mode When in proxy mode Tevm will fetch all state from the latest block of the provided proxy URL Cannot be set if `fork` is also set |

#### Defined in

evmts-monorepo/packages/base-client/types/BaseClientOptions.d.ts:8

___

### BlockNumber

Ƭ **BlockNumber**\<`TQuantity`\>: `TQuantity`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TQuantity` | `bigint` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/block.d.ts:68

___

### BlockParam

Ƭ **BlockParam**: [`BlockTag`](actions_types.md#blocktag) \| [`Hex`](index.md#hex) \| `bigint`

#### Defined in

evmts-monorepo/packages/actions-types/types/common/BlockParam.d.ts:3

___

### BlockTag

Ƭ **BlockTag**: ``"latest"`` \| ``"earliest"`` \| ``"pending"`` \| ``"safe"`` \| ``"finalized"``

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/block.d.ts:69

___

### CallParams

Ƭ **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](actions_types.md#basecallparams)\<`TThrowOnFail`\> & \{ `data?`: [`Hex`](actions_types.md#hex) ; `deployedBytecode?`: [`Hex`](actions_types.md#hex) ; `salt?`: [`Hex`](actions_types.md#hex)  }

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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/CallParams.d.ts:15

___

### CallResult

Ƭ **CallResult**\<`ErrorType`\>: `Object`

Result of a Tevm VM Call method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`CallError`](errors.md#callerror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| `createdAddress?` | [`Address`](actions_types.md#address) | Address of created account during transaction, if any |
| `createdAddresses?` | `Set`\<[`Address`](actions_types.md#address)\> | Map of addresses which were created (used in EIP 6780) |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `executionGasUsed` | `bigint` | Amount of gas the code used to run |
| `gas?` | `bigint` | Amount of gas left |
| `gasRefund?` | `bigint` | The gas refund counter as a uint256 |
| `logs?` | [`Log`](actions_types.md#log)[] | Array of logs that the contract emitted |
| `rawData` | [`Hex`](actions_types.md#hex) | Encoded return value from the contract as hex string |
| `selfdestruct?` | `Set`\<[`Address`](actions_types.md#address)\> | A set of accounts to selfdestruct |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/CallResult.d.ts:6

___

### ConstructorArgument

Ƭ **ConstructorArgument**\<`T`\>: `T` extends (...`args`: infer P) => `any` ? `P`[``0``] : `never`

Infers the the first argument of a class

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:11

___

### Contract

Ƭ **Contract**\<`TName`, `THumanReadableAbi`\>: `Object`

An action creator for `Tevm.contract`, `Tevm.eth.getEvents` and more
It also is the type solidity contract imports are turned into.

Contracts generate actions that can be dispatched to tevm methods
such as `contract` `traceContract` and `eth.events`

**`Example`**

```typescript
tevm.contract(
-  { abi: [...], args: ['0x1234...'], functionName: 'balanceOf' },
+  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

A contract can be made via the `createContract` function

**`Example`**

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```
These contracts can be automatically generated by using [@tevm/bundler](https://todo.todo)
and then importing it. The Tevm bundler will automatically resolve your solidity imports into
tevm contract instances

**`Example`**

```typescript
import { MyContract } from './MyContract.sol'

console.log(MyContract.humanReadableAbi)
```
Address can be added to a contract using the `withAddress` method

**`Example`**

```typescript
import { MyContract } from './MyContract.sol'

const MyContractOptimism = MyContract.withAddress('0x420...')
```
Contracts can also be used with other libraries such as Viem and ethers.

**`Example`**

```typescript
import { MyContract } from './MyContract.sol'
import { createPublicClient } from 'viem'

// see viem docs
const client = createPublicClient({...})

const result = await client.readContract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | [`ParseAbi`](index.md#parseabi)\<`THumanReadableAbi`\> | The json abi of the contract **`Example`** ```typescript import { MyContract } from './MyContract.sol' console.log(MyContract.abi) // [{name: 'balanceOf', inputs: [...], outputs: [...], ...}] ``` |
| `bytecode?` | `undefined` | The contract bytecode is not defined on Contract objects are expected to be deployed to the chain. See `Script` type which is a contract with bytecode It's provided here to allow easier access of the property when using a `Contract \| Script` union type |
| `deployedBytecode?` | `undefined` | The contract deployedBytecode is not defined on Contract objects are expected to be deployed to the chain. See `Script` type which is a contract with deployedBytecode It's provided here to allow easier access of the property when using a `Contract \| Script` union type |
| `events` | [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> | Action creators for events. Can be used to create event filters in a typesafe way **`Example`** ```typescript tevm.eth.getLog( MyContract.withAddress('0x420...').events.Transfer({ from: '0x1234...' }), ) === |
| `humanReadableAbi` | `THumanReadableAbi` | The human readable abi of the contract **`Example`** ```typescript import { MyContract } from './MyContract.sol' console.log(MyContract.humanReadableAbi) // ['function balanceOf(address): uint256', ...] ``` |
| `name` | `TName` | The name of the contract. If imported this will match the name of the contract import |
| `read` | [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> | Action creators for contract view and pure functions **`Example`** ```typescript tevm.contract( MyContract.withAddress('0x420...').read.balanceOf('0x1234...'), ) ``` |
| `withAddress` | \<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>, ``"read"`` \| ``"write"`` \| ``"events"`` \| ``"address"``\> & \{ `address`: `TAddress` ; `events`: [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\> ; `read`: [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\> ; `write`: [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\>  } | Adds an address to the contract. All action creators will return the address property if added. **`Example`** ```typescript import { MyContract } from './MyContract.sol' const MyContractOptimism = MyContract.withAddress('0x420...') ``` |
| `write` | [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> | Action creators for contract payable and nonpayable functions **`Example`** ```typescript tevm.contract( MyContract.withAddress('0x420...').read.balanceOf('0x1234...'), ) ``` |

#### Defined in

evmts-monorepo/packages/contract/types/Contract.d.ts:60

___

### ContractFunctionName

Ƭ **ContractFunctionName**\<`abi`, `mutability`\>: [`ExtractAbiFunctionNames`](index.md#extractabifunctionnames)\<`abi` extends [`Abi`](index.md#abi) ? `abi` : [`Abi`](index.md#abi), `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `mutability` | extends `AbiStateMutability` = `AbiStateMutability` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/contract.d.ts:5

___

### ContractParams

Ƭ **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](index.md#encodefunctiondataparameters)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](actions_types.md#basecallparams)\<`TThrowOnFail`\> & \{ `to`: [`Address`](actions_types.md#address)  }

Tevm params to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](actions_types.md#abi) \| readonly `unknown`[] = [`Abi`](actions_types.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/ContractParams.d.ts:7

___

### ContractResult

Ƭ **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](index.md#callresult), ``"errors"``\> & \{ `data`: [`DecodeFunctionResultReturnType`](index.md#decodefunctionresultreturntype)\<`TAbi`, `TFunctionName`\> ; `errors?`: `never`  } \| [`CallResult`](index.md#callresult)\<`ErrorType`\> & \{ `data?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](actions_types.md#abi) \| readonly `unknown`[] = [`Abi`](actions_types.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |
| `ErrorType` | [`ContractError`](errors.md#contracterror) |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/ContractResult.d.ts:5

___

### CreateContract

Ƭ **CreateContract**: \<TName, THumanReadableAbi\>(`{ name, humanReadableAbi, }`: [`CreateContractParams`](index.md#createcontractparams)\<`TName`, `THumanReadableAbi`\>) => [`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

**`Example`**

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

**`Example`**

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

#### Type declaration

▸ \<`TName`, `THumanReadableAbi`\>(`{ name, humanReadableAbi, }`): [`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `{ name, humanReadableAbi, }` | [`CreateContractParams`](index.md#createcontractparams)\<`TName`, `THumanReadableAbi`\> |

##### Returns

[`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>

#### Defined in

evmts-monorepo/packages/contract/types/types.d.ts:36

___

### CreateContractParams

Ƭ **CreateContractParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"``\>

Params for creating a [Contract](index.md#contract) instance

**`See`**

[CreateContract](index.md#createcontract)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

evmts-monorepo/packages/contract/types/types.d.ts:7

___

### CreateEventFilterParameters

Ƭ **CreateEventFilterParameters**\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>: \{ `address?`: [`Address`](index.md#address) \| [`Address`](index.md#address)[] ; `fromBlock?`: `TFromBlock` \| [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag) ; `toBlock?`: `TToBlock` \| [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag)  } & `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> extends infer TEventFilterArgs ? \{ `args`: `TEventFilterArgs` \| `_Args` extends `TEventFilterArgs` ? `_Args` : `never` ; `event`: `TAbiEvent` ; `events?`: `never` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `TAbiEvent` ; `events?`: `never` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `never` ; `events`: `TAbiEvents` ; `strict?`: `TStrict`  } \| \{ `args?`: `never` ; `event?`: `never` ; `events?`: `never` ; `strict?`: `never`  } : \{ `args?`: `never` ; `event?`: `never` ; `events?`: `never` ; `strict?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbiEvent` | extends [`AbiEvent`](index.md#abievent) \| `undefined` = `undefined` |
| `TAbiEvents` | extends readonly [`AbiEvent`](index.md#abievent)[] \| readonly `unknown`[] \| `undefined` = `TAbiEvent` extends [`AbiEvent`](index.md#abievent) ? [`TAbiEvent`] : `undefined` |
| `TStrict` | extends `boolean` \| `undefined` = `undefined` |
| `TFromBlock` | extends [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag) \| `undefined` = `undefined` |
| `TToBlock` | extends [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag) \| `undefined` = `undefined` |
| `_EventName` | extends `string` \| `undefined` = `MaybeAbiEventName`\<`TAbiEvent`\> |
| `_Args` | extends `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> \| `undefined` = `undefined` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/actions/public/createEventFilter.d.ts:13

___

### CreateMemoryDbFn

Ƭ **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb?`: `Map`\<`TKey`, `TValue`\>) => [`MemoryDb`](index.md#memorydb)\<`TKey`, `TValue`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` \| `number` \| `Uint8Array` = `Uint8Array` |
| `TValue` | extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| `DBObject` = `Uint8Array` |

#### Type declaration

▸ (`initialDb?`): [`MemoryDb`](index.md#memorydb)\<`TKey`, `TValue`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `initialDb?` | `Map`\<`TKey`, `TValue`\> |

##### Returns

[`MemoryDb`](index.md#memorydb)\<`TKey`, `TValue`\>

#### Defined in

evmts-monorepo/packages/utils/types/CreateMemoryDbFn.d.ts:3

___

### CreateScript

Ƭ **CreateScript**: \<TName, THumanReadableAbi\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, }`: [`CreateScriptParams`](index.md#createscriptparams)\<`TName`, `THumanReadableAbi`\>) => [`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>

Type of `createScript` factory function
Creates a tevm Script instance from human readable abi

**`Example`**

```typescript
import { type Script, createScript} from 'tevm/contract'

const script: Script = createScript({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead(): uint256', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

**`Example`**

```typescript
import { type Script, createScript, formatAbi} from 'tevm/contract'
import { formatAbi } from 'tevm/abi'

const script = createScript({
 name: 'MyScript',
 bytecode: '0x123...',
 deployedBytecode: '0x123...',
 humanReadableAbi: formatAbi([
  {
    name: 'balanceOf',
    inputs: [
    {
    name: 'owner',
    type: 'address',
    },
    ],
    outputs: [
    {
    name: 'balance',
    type: 'uint256',
    },
  }
  ]),
 })

#### Type declaration

▸ \<`TName`, `THumanReadableAbi`\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, }`): [`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `{ name, humanReadableAbi, bytecode, deployedBytecode, }` | [`CreateScriptParams`](index.md#createscriptparams)\<`TName`, `THumanReadableAbi`\> |

##### Returns

[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>

#### Defined in

evmts-monorepo/packages/contract/types/types.d.ts:85

___

### CreateScriptParams

Ƭ **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"`` \| ``"bytecode"`` \| ``"deployedBytecode"``\>

Params for creating a [Script](index.md#script) instance

**`See`**

[CreateScript](index.md#createscript)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

evmts-monorepo/packages/contract/types/types.d.ts:41

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

evmts-monorepo/packages/base-client/types/CustomPrecompile.d.ts:14

___

### CustomPredeploy

Ƭ **CustomPredeploy**\<`TName`, `THumanReadableAbi`\>: `Object`

Params taken by the definePredeploy function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](index.md#address) |
| `contract` | [`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\> |

#### Defined in

evmts-monorepo/packages/predeploys/types/CustomPredeploy.d.ts:6

___

### DecodeFunctionResultReturnType

Ƭ **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\>, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `functionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> \| `undefined` = [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> |
| `args` | extends `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\>\> |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:23

___

### EncodeFunctionDataParameters

Ƭ **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: \{ `abi`: `abi`  } & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](index.md#abi)\> extends ``true`` ? `abi`[``"length"``] extends ``1`` ? \{ `functionName?`: `functionName` \| `allFunctionNames`  } : \{ `functionName`: `functionName` \| `allFunctionNames`  } : \{ `functionName?`: `functionName` \| `allFunctionNames`  }\> & `UnionEvaluate`\<readonly [] extends `allArgs` ? \{ `args?`: `allArgs`  } : \{ `args`: `allArgs`  }\> & `hasFunctions` extends ``true`` ? `unknown` : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `functionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> \| `undefined` = [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> |
| `hasFunctions` | `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`ExtractAbiFunctions`\<`abi`\>] extends [`never`] ? ``false`` : ``true`` : ``true`` |
| `allArgs` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\>\> |
| `allFunctionNames` | [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:12

___

### EventActionCreator

Ƭ **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TEventName in ExtractAbiEventNames\<ParseAbi\<THumanReadableAbi\>\>]: Function & Object & TAddressArgs }

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way

**`Example`**

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TDeployedBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TAddress` | extends [`Address`](index.md#address) \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress`  } |

#### Defined in

evmts-monorepo/packages/contract/types/event/EventActionCreator.d.ts:16

___

### Extension

Ƭ **Extension**\<`TExtended`\>: (`client`: [`BaseClient`](index.md#baseclient)) => `TExtended`

#### Type parameters

| Name |
| :------ |
| `TExtended` |

#### Type declaration

▸ (`client`): `TExtended`

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`BaseClient`](index.md#baseclient) |

##### Returns

`TExtended`

#### Defined in

evmts-monorepo/packages/base-client/types/Extension.d.ts:2

___

### ExtractAbiEvent

Ƭ **ExtractAbiEvent**\<`TAbi`, `TEventName`\>: `Extract`\<[`ExtractAbiEvents`](index.md#extractabievents)\<`TAbi`\>, \{ `name`: `TEventName`  }\>

Extracts [AbiEvent](index.md#abievent) with name from [Abi](index.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) | [Abi](index.md#abi) to extract [AbiEvent](index.md#abievent) from |
| `TEventName` | extends [`ExtractAbiEventNames`](index.md#extractabieventnames)\<`TAbi`\> | String name of event to extract from [Abi](index.md#abi) |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:149

___

### ExtractAbiEventNames

Ƭ **ExtractAbiEventNames**\<`TAbi`\>: [`ExtractAbiEvents`](index.md#extractabievents)\<`TAbi`\>[``"name"``]

Extracts all [AbiEvent](index.md#abievent) names from [Abi](index.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) | [Abi](index.md#abi) to extract event names from |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:141

___

### ExtractAbiEvents

Ƭ **ExtractAbiEvents**\<`TAbi`\>: `Extract`\<`TAbi`[`number`], \{ `type`: ``"event"``  }\>

Extracts all [AbiEvent](index.md#abievent) types from [Abi](index.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) | [Abi](index.md#abi) to extract events from |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:132

___

### ExtractAbiFunction

Ƭ **ExtractAbiFunction**\<`TAbi`, `TFunctionName`, `TAbiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>, \{ `name`: `TFunctionName`  }\>

Extracts [AbiFunction](index.md#abifunction) with name from [Abi](index.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) | [Abi](index.md#abi) to extract [AbiFunction](index.md#abifunction) from |
| `TFunctionName` | extends [`ExtractAbiFunctionNames`](index.md#extractabifunctionnames)\<`TAbi`\> | String name of function to extract from [Abi](index.md#abi) |
| `TAbiStateMutability` | extends `AbiStateMutability` = `AbiStateMutability` | AbiStateMutability to filter by |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:123

___

### ExtractAbiFunctionNames

Ƭ **ExtractAbiFunctionNames**\<`TAbi`, `TAbiStateMutability`\>: `ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>[``"name"``]

Extracts all [AbiFunction](index.md#abifunction) names from [Abi](index.md#abi).

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) | [Abi](index.md#abi) to extract function names from |
| `TAbiStateMutability` | extends `AbiStateMutability` = `AbiStateMutability` | AbiStateMutability to filter by |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/utils.d.ts:114

___

### Filter

Ƭ **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: \{ `id`: [`Hex`](index.md#hex) ; `request`: `EIP1193RequestFn`\<`FilterRpcSchema`\> ; `type`: `TFilterType`  } & `TFilterType` extends ``"event"`` ? \{ `fromBlock?`: `TFromBlock` ; `toBlock?`: `TToBlock`  } & `TAbi` extends [`Abi`](index.md#abi) ? `undefined` extends `TEventName` ? \{ `abi`: `TAbi` ; `args?`: `never` ; `eventName?`: `never` ; `strict`: `TStrict`  } : `TArgs` extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? \{ `abi`: `TAbi` ; `args`: `TArgs` ; `eventName`: `TEventName` ; `strict`: `TStrict`  } : \{ `abi`: `TAbi` ; `args?`: `never` ; `eventName`: `TEventName` ; `strict`: `TStrict`  } : \{ `abi?`: `never` ; `args?`: `never` ; `eventName?`: `never` ; `strict?`: `never`  } : {}

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TFilterType` | extends `FilterType` = ``"event"`` |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] \| `undefined` = `undefined` |
| `TEventName` | extends `string` \| `undefined` = `undefined` |
| `TArgs` | extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> |
| `TStrict` | extends `boolean` \| `undefined` = `undefined` |
| `TFromBlock` | extends [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag) \| `undefined` = `undefined` |
| `TToBlock` | extends [`BlockNumber`](index.md#blocknumber) \| [`BlockTag`](index.md#blocktag) \| `undefined` = `undefined` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/filter.d.ts:11

___

### FormatAbi

Ƭ **FormatAbi**\<`TAbi`\>: [`Abi`](index.md#abi) extends `TAbi` ? readonly `string`[] : `TAbi` extends readonly [] ? `never` : `TAbi` extends [`Abi`](index.md#abi) ? \{ [K in keyof TAbi]: FormatAbiItem\<TAbi[K]\> } : readonly `string`[]

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] | ABI |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9

___

### GetAccountParams

Ƭ **GetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `address`: [`Address`](actions_types.md#address)  }

Tevm params to get an account

**`Example`**

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/GetAccountParams.d.ts:10

___

### GetAccountResult

Ƭ **GetAccountResult**\<`ErrorType`\>: `Object`

Result of GetAccount Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`GetAccountError`](errors.md#getaccounterror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](actions_types.md#address) | Address of account |
| `balance?` | `bigint` | Balance to set account to |
| `codeHash?` | [`Hex`](actions_types.md#hex) | Code hash to set account to |
| `deployedBytecode?` | [`Hex`](actions_types.md#hex) | Contract bytecode to set account to |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| `isContract?` | `boolean` | True if account is a contract |
| `isEmpty?` | `boolean` | True if account is empty |
| `nonce?` | `bigint` | Nonce to set account to |
| `storageRoot?` | [`Hex`](actions_types.md#hex) | Storage root to set account to |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/GetAccountResult.d.ts:6

___

### GetEventArgs

Ƭ **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: ``true`` extends `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `TEventName` | extends `string` |
| `TConfig` | extends `EventParameterOptions` = `DefaultEventParameterOptions` |
| `TAbiEvent` | extends [`AbiEvent`](index.md#abievent) & \{ `type`: ``"event"``  } = `TAbi` extends [`Abi`](index.md#abi) ? [`ExtractAbiEvent`](index.md#extractabievent)\<`TAbi`, `TEventName`\> : [`AbiEvent`](index.md#abievent) & \{ `type`: ``"event"``  } |
| `TArgs` | `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`[``"inputs"``], `TConfig`\> |
| `FailedToParseArgs` | [`TArgs`] extends [`never`] ? ``true`` : ``false`` \| readonly `unknown`[] extends `TArgs` ? ``true`` : ``false`` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/contract.d.ts:68

___

### HDAccount

Ƭ **HDAccount**: `LocalAccount`\<``"hd"``\> & \{ `getHdKey`: () => `HDKey`  }

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/types.d.ts:31

___

### Hardfork

Ƭ **Hardfork**: ``"chainstart"`` \| ``"homestead"`` \| ``"dao"`` \| ``"tangerineWhistle"`` \| ``"spuriousDragon"`` \| ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"muirGlacier"`` \| ``"berlin"`` \| ``"london"`` \| ``"arrowGlacier"`` \| ``"grayGlacier"`` \| ``"mergeForkIdTransition"`` \| ``"paris"`` \| ``"shanghai"`` \| ``"cancun"``

Ethereum hardfork option

#### Defined in

evmts-monorepo/packages/base-client/types/Hardfork.d.ts:4

___

### Hex

Ƭ **Hex**: \`0x$\{string}\`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/types/misc.d.ts:2

___

### JsonRpcRequest

Ƭ **JsonRpcRequest**\<`TMethod`, `TParams`\>: \{ `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod`  } & `TParams` extends readonly [] ? \{ `params?`: `TParams`  } : \{ `params`: `TParams`  }

Helper type for creating JSON-RPC request types

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |

#### Defined in

evmts-monorepo/packages/jsonrpc/types/JsonRpcRequest.d.ts:4

___

### JsonRpcRequestTypeFromMethod

Ƭ **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](procedures_types.md#ethrequesttype) & [`TevmRequestType`](procedures_types.md#tevmrequesttype) & [`AnvilRequestType`](procedures_types.md#anvilrequesttype) & [`DebugRequestType`](procedures_types.md#debugrequesttype)[`TMethod`]

Utility type to get the request type given a method name

**`Example`**

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends keyof [`EthRequestType`](procedures_types.md#ethrequesttype) \| keyof [`TevmRequestType`](procedures_types.md#tevmrequesttype) \| keyof [`AnvilRequestType`](procedures_types.md#anvilrequesttype) \| keyof [`DebugRequestType`](procedures_types.md#debugrequesttype) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:1013

___

### JsonRpcResponse

Ƭ **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\>: \{ `error?`: `never` ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result`: `TResult`  } \| \{ `error`: \{ `code`: `TErrorCode` ; `message`: `string`  } ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |

#### Defined in

evmts-monorepo/packages/jsonrpc/types/JsonRpcResponse.d.ts:1

___

### JsonRpcReturnTypeFromMethod

Ƭ **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](procedures_types.md#ethreturntype) & [`TevmReturnType`](procedures_types.md#tevmreturntype) & [`AnvilReturnType`](procedures_types.md#anvilreturntype) & [`DebugReturnType`](procedures_types.md#debugreturntype)[`TMethod`]

Utility type to get the return type given a method name

**`Example`**

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends keyof [`EthReturnType`](procedures_types.md#ethreturntype) \| keyof [`TevmReturnType`](procedures_types.md#tevmreturntype) \| keyof [`AnvilReturnType`](procedures_types.md#anvilreturntype) \| keyof [`DebugReturnType`](procedures_types.md#debugreturntype) |

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:1034

___

### MemoryClient

Ƭ **MemoryClient**: [`TevmClient`](index.md#tevmclient) & [`BaseClient`](index.md#baseclient)

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
Implements the [TevmClient](index.md#tevmclient) interface with an in memory EVM instance.

**`See`**

 - [TevmClient](index.md#tevmclient)
 - [WrappedEvm](https://todo.todo) for an remote client

**`Example`**

```ts
import { createMemoryClient } from "tevm"
import { createPublicClient, http } from "@tevm/utils"
import { MyERC721 } from './MyERC721.sol'

const tevm = createMemoryClient({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.contract(
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

evmts-monorepo/packages/memory-client/types/MemoryClient.d.ts:37

___

### MemoryDb

Ƭ **MemoryDb**\<`TKey`, `TValue`\>: `DB`\<`TKey`, `TValue`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` \| `number` \| `Uint8Array` = `Uint8Array` |
| `TValue` | extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| `DBObject` = `Uint8Array` |

#### Defined in

evmts-monorepo/packages/utils/types/MemoryDb.d.ts:2

___

### ParseAbi

Ƭ **ParseAbi**\<`TSignatures`\>: `string`[] extends `TSignatures` ? [`Abi`](index.md#abi) : `TSignatures` extends readonly `string`[] ? `TSignatures` extends `Signatures`\<`TSignatures`\> ? `ParseStructs`\<`TSignatures`\> extends infer Structs ? \{ [K in keyof TSignatures]: TSignatures[K] extends string ? ParseSignature\<TSignatures[K], Structs\> : never } extends infer Mapped ? `Filter`\<`Mapped`, `never`\> extends infer Result ? `Result` extends readonly [] ? `never` : `Result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](index.md#abi)

**`Example`**

```ts
type Result = ParseAbi<
  // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  [
    'function balanceOf(address owner) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 amount)',
  ]
>
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TSignatures` | extends readonly `string`[] | Human-readable ABI |

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:21

___

### ReadActionCreator

Ƭ **ReadActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>]: Function & Object & TAddressArgs }

A mapping of view and pure contract methods to action creators

**`Example`**

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TDeployedBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TAddress` | extends [`Address`](index.md#address) \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress` ; `to`: `TAddress`  } |

#### Defined in

evmts-monorepo/packages/contract/types/read/ReadActionCreator.d.ts:12

___

### Script

Ƭ **Script**\<`TName`, `THumanReadableAbi`\>: `Object`

An action creator for `Tevm.script`, `Tevm.contract` and more
representing a solidity contract bytecode and ABI.
Scripts are akin to Foundry scripts you can run in the Tevm vm.

Script is also is the type solidity contract imports are turned into.

Scripts and contracts generate actions that can be dispatched to tevm methods
such as `contract` and `script`

**`Example`**

```typescript
tevm.script(
-  { deployedBytecode: '0x60242....', abi: [...], args: ['0x1234...'], functionName: 'balanceOf' },
+  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

A script can be made via the `createScript` function

**`Example`**

```typescript
import { type Contract, createScript} from 'tevm/contract'

const contract: Contract = createScript({
  name: 'MyScript',
 	abi: [
 		...
 	],
})
```
These scripts can be automatically generated by using [@tevm/bundler](https://todo.todo)
and then importing it. The Tevm bundler will automatically resolve your solidity imports into
tevm contract instances

**`Example`**

```typescript
import { MyScript } from './MyScript.sol'

console.log(MyScript.humanReadableAbi)
```
Address can be added to a contract using the `withAddress` method

**`Example`**

```typescript
import { MyScript } from './MyScript.sol'

const MyScript = MyScript.withAddress('0x420...')
```
Scripts can also be used with other libraries such as Viem and ethers.

**`Example`**

```typescript
import { MyScript } from './MyScript.sol'
import { createPublicClient } from 'viem'

// see viem docs
const client = createPublicClient({...})

const result = await client.readContract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | [`ParseAbi`](index.md#parseabi)\<`THumanReadableAbi`\> | The json abi of the contract **`Example`** ```typescript import { MyScript } from './MyScript.sol' console.log(MyScript.abi) // [{name: 'balanceOf', inputs: [...], outputs: [...], ...}] ``` |
| `bytecode` | [`Hex`](index.md#hex) | The contract bytecode. This can be used for deploying the contract bytecode is different from deployedBytecode in that the bytecode includes the code to deploy the contract whereas the deployed bytecode is the code that is deployed |
| `deployedBytecode` | [`Hex`](index.md#hex) | The deployed contract bytecode. TThis can be used with the `script` tevm method to execute arbitrary solidity code that isn't necessarily deployed to the chain deployedBytecode is different from bytecode in that the bytecode includes the code to deploy the contract whereas the deployed bytecode is the code that is deployed |
| `events` | [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `undefined`\> | Action creators for events. Can be used to create event filters in a typesafe way **`Example`** ```typescript tevm.eth.getLog( MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }), ) === |
| `humanReadableAbi` | `THumanReadableAbi` | The human readable abi of the contract **`Example`** ```typescript import { MyScript } from './MyScript.sol' console.log(MyScript.humanReadableAbi) // ['function balanceOf(address): uint256', ...] ``` |
| `name` | `TName` | The name of the contract. If imported this will match the name of the contract import |
| `read` | [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `undefined`\> | Action creators for contract view and pure functions **`Example`** ```typescript tevm.contract( MyScript.withAddress('0x420...').read.balanceOf('0x1234...'), ) ``` |
| `withAddress` | \<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>, ``"events"`` \| ``"read"`` \| ``"write"`` \| ``"address"``\> & \{ `address`: `TAddress` ; `events`: [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `TAddress`\> ; `read`: [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `TAddress`\> ; `write`: [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `TAddress`\>  } | Adds an address to the contract. All action creators will return the address property if added. **`Example`** ```typescript import { MyScript } from './MyScript.sol' const MyScript = MyScript.withAddress('0x420...') ``` Note this is not necessary with `tevm.script` method that doesn't require a contract address to execute |
| `write` | [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, [`Hex`](index.md#hex), [`Hex`](index.md#hex), `undefined`\> | Action creators for contract payable and nonpayable functions **`Example`** ```typescript tevm.contract( MyScript.withAddress('0x420...').read.balanceOf('0x1234...'), ) ``` |

#### Defined in

evmts-monorepo/packages/contract/types/Script.d.ts:63

___

### ScriptParams

Ƭ **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](index.md#encodefunctiondataparameters)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](actions_types.md#basecallparams)\<`TThrowOnFail`\> & \{ `deployedBytecode`: [`Hex`](index.md#hex)  }

Tevm params for deploying and running a script

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] = [`Abi`](index.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/ScriptParams.d.ts:7

___

### ScriptResult

Ƭ **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](index.md#contractresult)\<`TAbi`, `TFunctionName`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](actions_types.md#abi) \| readonly `unknown`[] = [`Abi`](actions_types.md#abi) |
| `TFunctionName` | extends [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> = [`ContractFunctionName`](index.md#contractfunctionname)\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](errors.md#scripterror) |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/ScriptResult.d.ts:5

___

### SerializableTevmState

Ƭ **SerializableTevmState**: `Object`

#### Index signature

▪ [key: `string`]: [`AccountStorage`](../interfaces/state.AccountStorage.md)

#### Defined in

evmts-monorepo/packages/state/types/SerializableTevmState.d.ts:2

___

### SetAccountParams

Ƭ **SetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & \{ `address`: [`Address`](index.md#address) ; `balance?`: `bigint` ; `deployedBytecode?`: [`Hex`](index.md#hex) ; `nonce?`: `bigint` ; `storageRoot?`: [`Hex`](index.md#hex)  }

Tevm params to set an account in the vm state
all fields are optional except address

**`Example`**

```ts
const accountParams: import('tevm/api').SetAccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TThrowOnFail` | extends `boolean` = `boolean` |

#### Defined in

evmts-monorepo/packages/actions-types/types/params/SetAccountParams.d.ts:16

___

### SetAccountResult

Ƭ **SetAccountResult**\<`ErrorType`\>: `Object`

Result of SetAccount Action

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ErrorType` | [`SetAccountError`](errors.md#setaccounterror) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors?` | `ErrorType`[] | Description of the exception, if any occurred |

#### Defined in

evmts-monorepo/packages/actions-types/types/result/SetAccountResult.d.ts:5

___

### TevmClient

Ƭ **TevmClient**: `Object`

A local EVM instance running in the browser, Bun, or Node.js. Akin to anvil or ganache. The TevmClient interface
is a unified interface that all Clients implement. This provides a consistent developer experience no matter how you are
using Tevm.

**`See`**

[TevmClient guide](https://tevm.sh/learn/clients/) for more documentation on clients

#### JSON-RPC

Tevm exposes a JSON-RPC interface for interacting with the EVM via the [TevmClient.request](index.md#request)

**`Example`**

```typescript
import {createMemoryClient, type Tevm} from 'tevm'

const tevm: Tevm = createMemoryClient()

await tevm.request({
  method: 'eth_blockNumber',
  params: [],
  id: 1,
  jsonrpc: '2.0',
}) // 0n
```

#### Actions

TevmClient exposes a higher level `actions` based api similar to [viem](https://viem.sh) for interacting with TevmClient in a typesasafe
ergonomic way.

**`Example`**

```typescript
// same as eth_blockNumber example
const account = await tevm.account({address: `0x${'0'.repeat(40)}`})
console.log(account.balance) // 0n
```

#### Ethereum actions

Ethereum actions are namespaced under [TevmClient.eth](index.md#eth)

**`Example`**

```typescript
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

#### Anvil hardhat and ganache compatibility

Will have anvil_* ganache_* and hardhat_* JSON-RPC compatibility in future versions

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`CallHandler`](actions_types.md#callhandler) | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **`Example`** ```ts const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } ``` |
| `contract` | [`ContractHandler`](actions_types.md#contracthandler) | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **`Example`** ```ts const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello" ``` |
| `dumpState` | [`DumpStateHandler`](actions_types.md#dumpstatehandler) | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `eth` | \{ `blockNumber`: [`EthBlockNumberHandler`](actions_types.md#ethblocknumberhandler) ; `call`: [`EthCallHandler`](actions_types.md#ethcallhandler) ; `chainId`: [`EthChainIdHandler`](actions_types.md#ethchainidhandler) ; `gasPrice`: [`EthGasPriceHandler`](actions_types.md#ethgaspricehandler) ; `getBalance`: [`EthGetBalanceHandler`](actions_types.md#ethgetbalancehandler) ; `getCode`: [`EthGetCodeHandler`](actions_types.md#ethgetcodehandler) ; `getStorageAt`: [`EthGetStorageAtHandler`](actions_types.md#ethgetstorageathandler)  } | Standard JSON-RPC methods for interacting with the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) |
| `eth.blockNumber` | [`EthBlockNumberHandler`](actions_types.md#ethblocknumberhandler) | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n ``` |
| `eth.call` | [`EthCallHandler`](actions_types.md#ethcallhandler) | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..." ``` |
| `eth.chainId` | [`EthChainIdHandler`](actions_types.md#ethchainidhandler) | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const chainId = await tevm.eth.chainId() console.log(chainId) // 10n ``` |
| `eth.gasPrice` | [`EthGasPriceHandler`](actions_types.md#ethgaspricehandler) | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n ``` |
| `eth.getBalance` | [`EthGetBalanceHandler`](actions_types.md#ethgetbalancehandler) | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n ``` |
| `eth.getCode` | [`EthGetCodeHandler`](actions_types.md#ethgetcodehandler) | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const code = await tevm.eth.getCode({address: '0x123...'}) ``` |
| `eth.getStorageAt` | [`EthGetStorageAtHandler`](actions_types.md#ethgetstorageathandler) | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0}) ``` |
| `getAccount` | [`GetAccountHandler`](actions_types.md#getaccounthandler) | Gets the state of a specific ethereum address **`Example`** ```ts const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance) ``` |
| `loadState` | [`LoadStateHandler`](actions_types.md#loadstatehandler) | Loads a previously dumped state into the VM State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `request` | [`TevmJsonRpcRequestHandler`](index.md#tevmjsonrpcrequesthandler) | Request handler for JSON-RPC requests. Most users will want to use the [`actions` api](https://tevm.sh/learn/actions/) instead of this method directly **`Example`** ```typescript const blockNumberResponse = await tevm.request({ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }) const accountResponse = await tevm.request({ method: 'tevm_getAccount', params: [{address: '0x123...'}], id: 1, jsonrpc: '2.0', }) ``` |
| `requestBulk` | [`TevmJsonRpcBulkRequestHandler`](index.md#tevmjsonrpcbulkrequesthandler) | Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results. Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run sequentially or interphere with each other. An option for configuring requests sequentially or in parallel will be added in the future. Currently is not very generic with regard to input and output types. **`Example`** ```typescript const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }, { method: 'eth_gasPrice', params: [] id: 1 jsonrpc: '2.0' }]) ``` ### tevm_* methods #### tevm_call request - CallJsonRpcRequest response - CallJsonRpcResponse #### tevm_script request - ScriptJsonRpcRequest response - ScriptJsonRpcResponse #### tevm_getAccount request - GetAccountJsonRpcRequest response - GetAccountJsonRpcResponse #### tevm_setAccount request - SetAccountJsonRpcRequest response - SetAccountJsonRpcResponse #### tevm_fork request - ForkJsonRpcRequest response - ForkJsonRpcResponse ### debug_* methods #### debug_traceCall request - DebugTraceCallJsonRpcRequest response - DebugTraceCallJsonRpcResponse ### eth_* methods #### eth_blockNumber request - EthBlockNumberJsonRpcRequest response - EthBlockNumberJsonRpcResponse #### eth_chainId request - EthChainIdJsonRpcRequest response - EthChainIdJsonRpcResponse #### eth_getCode request - EthGetCodeJsonRpcRequest response - EthGetCodeJsonRpcResponse #### eth_getStorageAt request - EthGetStorageAtJsonRpcRequest response - EthGetStorageAtJsonRpcResponse #### eth_gasPrice request - EthGasPriceJsonRpcRequest response - EthGasPriceJsonRpcResponse #### eth_getBalance request - EthGetBalanceJsonRpcRequest response - EthGetBalanceJsonRpcResponse |
| `script` | [`ScriptHandler`](actions_types.md#scripthandler) | Executes scripts against the Tevm EVM. By default the script is sandboxed and the state is reset after each execution unless the `persist` option is set to true. **`Example`** ```typescript const res = tevm.script({ deployedBytecode: '0x6080604...', abi: [...], function: 'run', args: ['hello world'] }) ``` Contract handlers provide a more ergonomic way to execute scripts **`Example`** ```typescript ipmort {MyScript} from './MyScript.s.sol' const res = tevm.script( MyScript.read.run('hello world') ) ``` |
| `setAccount` | [`SetAccountHandler`](actions_types.md#setaccounthandler) | Sets the state of a specific ethereum address **`Example`** ```ts import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') }) ``` |

#### Defined in

evmts-monorepo/packages/client-types/types/TevmClient.d.ts:105

___

### TevmJsonRpcBulkRequestHandler

Ƭ **TevmJsonRpcBulkRequestHandler**: (`requests`: `ReadonlyArray`\<[`TevmJsonRpcRequest`](index.md#tevmjsonrpcrequest) \| [`EthJsonRpcRequest`](procedures_types.md#ethjsonrpcrequest) \| [`AnvilJsonRpcRequest`](procedures_types.md#anviljsonrpcrequest) \| [`DebugJsonRpcRequest`](procedures_types.md#debugjsonrpcrequest)\>) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`any`\>[]\>

Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
will be added in the future.

Currently is not very generic with regard to input and output types.

**`Example`**

```typescript
const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
}, {
 method: 'eth_gasPrice',
 params: []
 id: 1
 jsonrpc: '2.0'
}])
```

### tevm_* methods

#### tevm_call

request - [CallJsonRpcRequest](procedures_types.md#calljsonrpcrequest)
response - [CallJsonRpcResponse](procedures_types.md#calljsonrpcresponse)

#### tevm_script

request - [ScriptJsonRpcRequest](procedures_types.md#scriptjsonrpcrequest)
response - [ScriptJsonRpcResponse](procedures_types.md#scriptjsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](procedures_types.md#getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](procedures_types.md#getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](procedures_types.md#setaccountjsonrpcrequest)
response - [SetAccountJsonRpcResponse](procedures_types.md#setaccountjsonrpcresponse)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](procedures_types.md#debugtracecalljsonrpcrequest)
response - [DebugTraceCallJsonRpcResponse](procedures_types.md#debugtracecalljsonrpcresponse)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](procedures_types.md#ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](procedures_types.md#ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](procedures_types.md#ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](procedures_types.md#ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](procedures_types.md#ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](procedures_types.md#ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](procedures_types.md#ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](procedures_types.md#ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](procedures_types.md#ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](procedures_types.md#ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](procedures_types.md#ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](procedures_types.md#ethgetbalancejsonrpcresponse)

#### Type declaration

▸ (`requests`): `Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`any`\>[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `requests` | `ReadonlyArray`\<[`TevmJsonRpcRequest`](index.md#tevmjsonrpcrequest) \| [`EthJsonRpcRequest`](procedures_types.md#ethjsonrpcrequest) \| [`AnvilJsonRpcRequest`](procedures_types.md#anviljsonrpcrequest) \| [`DebugJsonRpcRequest`](procedures_types.md#debugjsonrpcrequest)\> |

##### Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`any`\>[]\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:1202

___

### TevmJsonRpcRequest

Ƭ **TevmJsonRpcRequest**: [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest) \| [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest) \| [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest) \| [`ContractJsonRpcRequest`](procedures_types.md#contractjsonrpcrequest) \| [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest) \| [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest) \| [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest)

A Tevm JSON-RPC request
`tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:403

___

### TevmJsonRpcRequestHandler

Ƭ **TevmJsonRpcRequestHandler**: \<TRequest\>(`request`: `TRequest`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`TRequest`[``"method"``]\>\>

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

**`Example`**

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

### tevm_* methods

#### tevm_call

request - [CallJsonRpcRequest](procedures_types.md#calljsonrpcrequest)
response - [CallJsonRpcResponse](procedures_types.md#calljsonrpcresponse)

#### tevm_script

request - [ScriptJsonRpcRequest](procedures_types.md#scriptjsonrpcrequest)
response - [ScriptJsonRpcResponse](procedures_types.md#scriptjsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](procedures_types.md#getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](procedures_types.md#getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](procedures_types.md#setaccountjsonrpcrequest)
response - [SetAccountJsonRpcResponse](procedures_types.md#setaccountjsonrpcresponse)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](procedures_types.md#debugtracecalljsonrpcrequest)
response - [DebugTraceCallJsonRpcResponse](procedures_types.md#debugtracecalljsonrpcresponse)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](procedures_types.md#ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](procedures_types.md#ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](procedures_types.md#ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](procedures_types.md#ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](procedures_types.md#ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](procedures_types.md#ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](procedures_types.md#ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](procedures_types.md#ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](procedures_types.md#ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](procedures_types.md#ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](procedures_types.md#ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](procedures_types.md#ethgetbalancejsonrpcresponse)

#### Type declaration

▸ \<`TRequest`\>(`request`): `Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`TRequest`[``"method"``]\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRequest` | extends [`TevmJsonRpcRequest`](index.md#tevmjsonrpcrequest) \| [`EthJsonRpcRequest`](procedures_types.md#ethjsonrpcrequest) \| [`AnvilJsonRpcRequest`](procedures_types.md#anviljsonrpcrequest) \| [`DebugJsonRpcRequest`](procedures_types.md#debugjsonrpcrequest) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `TRequest` |

##### Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](index.md#jsonrpcreturntypefrommethod)\<`TRequest`[``"method"``]\>\>

#### Defined in

evmts-monorepo/packages/procedures-types/dist/index.d.ts:1116

___

### TraceCall

Ƭ **TraceCall**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](index.md#tracecall)[] |
| `from` | [`Address`](actions_types.md#address) |
| `gas?` | `bigint` |
| `gasUsed?` | `bigint` |
| `input` | [`Hex`](actions_types.md#hex) |
| `output` | [`Hex`](actions_types.md#hex) |
| `to` | [`Address`](actions_types.md#address) |
| `type` | [`TraceType`](actions_types.md#tracetype) |
| `value?` | `bigint` |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TraceCall.d.ts:4

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

evmts-monorepo/packages/actions-types/types/params/DebugParams.d.ts:7

___

### TraceResult

Ƭ **TraceResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calls?` | [`TraceCall`](index.md#tracecall)[] |
| `from` | [`Address`](actions_types.md#address) |
| `gas` | `bigint` |
| `gasUsed` | `bigint` |
| `input` | [`Hex`](actions_types.md#hex) |
| `output` | [`Hex`](actions_types.md#hex) |
| `to` | [`Address`](actions_types.md#address) |
| `type` | [`TraceType`](actions_types.md#tracetype) |
| `value` | `bigint` |

#### Defined in

evmts-monorepo/packages/actions-types/types/common/TraceResult.d.ts:5

___

### WriteActionCreator

Ƭ **WriteActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>]: Function & Object & TAddressArgs }

A mapping of payable and nonpayable contract methods to action creators

**`Example`**

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TDeployedBytecode` | extends [`Hex`](index.md#hex) \| `undefined` |
| `TAddress` | extends [`Address`](index.md#address) \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress` ; `to`: `TAddress`  } |

#### Defined in

evmts-monorepo/packages/contract/types/write/WriteActionCreator.d.ts:12

## Functions

### boolToBytes

▸ **boolToBytes**(`value`, `opts?`): `Uint8Array`

Encodes a boolean into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#booltobytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Boolean value to encode. |
| `opts?` | `BoolToBytesOpts` | Options. |

#### Returns

`Uint8Array`

Byte array value.

**`Example`**

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true)
// Uint8Array([1])
```

**`Example`**

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true, { size: 32 })
// Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:62

___

### boolToHex

▸ **boolToHex**(`value`, `opts?`): [`Hex`](index.md#hex)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Value to encode. |
| `opts?` | `BoolToHexOpts` | Options. |

#### Returns

[`Hex`](index.md#hex)

Hex value.

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

**`Example`**

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:66

___

### bytesToBigint

▸ **bytesToBigint**(`bytes`, `opts?`): `bigint`

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `opts?` | `BytesToBigIntOpts` | Options. |

#### Returns

`bigint`

BigInt value.

**`Example`**

```ts
import { bytesToBigInt } from 'viem'
const data = bytesToBigInt(new Uint8Array([1, 164]))
// 420n
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:59

___

### bytesToBool

▸ **bytesToBool**(`bytes_`, `opts?`): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes_` | `Uint8Array` | - |
| `opts?` | `BytesToBoolOpts` | Options. |

#### Returns

`boolean`

Boolean value.

**`Example`**

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:79

___

### bytesToHex

▸ **bytesToHex**(`value`, `opts?`): [`Hex`](index.md#hex)

Encodes a bytes array into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#bytestohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Uint8Array` | Value to encode. |
| `opts?` | `BytesToHexOpts` | Options. |

#### Returns

[`Hex`](index.md#hex)

Hex value.

**`Example`**

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
// '0x48656c6c6f20576f726c6421'
```

**`Example`**

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:91

___

### bytesToNumber

▸ **bytesToNumber**(`bytes`, `opts?`): `number`

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `opts?` | `BytesToBigIntOpts` | Options. |

#### Returns

`number`

Number value.

**`Example`**

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:96

___

### createBaseClient

▸ **createBaseClient**(`options?`): `Promise`\<`BaseClient`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BaseClientOptions`](index.md#baseclientoptions) |

#### Returns

`Promise`\<`BaseClient`\>

#### Defined in

evmts-monorepo/packages/base-client/types/createBaseClient.d.ts:1

___

### createContract

▸ **createContract**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateContractParams`](index.md#createcontractparams)\<`TName`, `THumanReadableAbi`\> |

#### Returns

[`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>

**`Example`**

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

**`Example`**

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

#### Defined in

evmts-monorepo/packages/contract/types/createContract.d.ts:29

___

### createMemoryClient

▸ **createMemoryClient**(`options?`): `Promise`\<`MemoryClient`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BaseClientOptions`](index.md#baseclientoptions) |

#### Returns

`Promise`\<`MemoryClient`\>

#### Defined in

evmts-monorepo/packages/memory-client/types/createMemoryClient.d.ts:1

___

### createMemoryDb

▸ **createMemoryDb**(`initialDb?`): [`MemoryDb`](index.md#memorydb)\<`Uint8Array`, `Uint8Array`\>

A simple ethereumjs DB instance that uses an in memory Map as it's backend
Pass in an initial DB optionally to prepoulate the DB.

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialDb?` | `Map`\<`Uint8Array`, `Uint8Array`\> |

#### Returns

[`MemoryDb`](index.md#memorydb)\<`Uint8Array`, `Uint8Array`\>

#### Defined in

evmts-monorepo/packages/utils/types/createMemoryDb.d.ts:7

___

### createScript

▸ **createScript**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>

Creates a Tevm `Script` instance from humanReadableAbi and bytecode

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateScriptParams`](index.md#createscriptparams)\<`TName`, `THumanReadableAbi`\> |

#### Returns

[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>

**`Example`**

```typescript
import { type Script, createScript} from 'tevm/contract'

const script: Script = createScript({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead(): uint256', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

**`Example`**

```typescript
import { type Script, createScript, formatAbi} from 'tevm/contract'
import { formatAbi } from 'tevm/utils'

const script = createScript({
 name: 'MyScript',
 bytecode: '0x123...',
 deployedBytecode: '0x123...',
 humanReadableAbi: formatAbi([
  {
    name: 'balanceOf',
    inputs: [
    {
    name: 'owner',
    type: 'address',
    },
    ],
    outputs: [
    {
    name: 'balance',
    type: 'uint256',
    },
  }
  ]),
 })
 ```

#### Defined in

evmts-monorepo/packages/contract/types/createScript.d.ts:45

___

### decodeAbiParameters

▸ **decodeAbiParameters**\<`TParams`\>(`params`, `data`): `DecodeAbiParametersReturnType`\<`TParams`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends readonly `AbiParameter`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `data` | \`0x$\{string}\` \| `Uint8Array` |

#### Returns

`DecodeAbiParametersReturnType`\<`TParams`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeAbiParameters.d.ts:14

___

### decodeErrorResult

▸ **decodeErrorResult**\<`TAbi`\>(`parameters`): `DecodeErrorResultReturnType`\<`TAbi`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeErrorResultParameters`\<`TAbi`\> |

#### Returns

`DecodeErrorResultReturnType`\<`TAbi`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeErrorResult.d.ts:26

___

### decodeEventLog

▸ **decodeEventLog**\<`abi`, `eventName`, `topics`, `data`, `strict`\>(`parameters`): `DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `eventName` | extends `undefined` \| `string` = `undefined` |
| `topics` | extends \`0x$\{string}\`[] = \`0x$\{string}\`[] |
| `data` | extends `undefined` \| \`0x$\{string}\` = `undefined` |
| `strict` | extends `boolean` = ``true`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeEventLogParameters`\<`abi`, `eventName`, `topics`, `data`, `strict`\> |

#### Returns

`DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeEventLog.d.ts:32

___

### decodeFunctionData

▸ **decodeFunctionData**\<`abi`\>(`parameters`): `DecodeFunctionDataReturnType`\<`abi`, [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionDataParameters`\<`abi`\> |

#### Returns

`DecodeFunctionDataReturnType`\<`abi`, [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionData.d.ts:25

___

### decodeFunctionResult

▸ **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](index.md#decodefunctionresultreturntype)\<`abi`, `functionName`, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |
| `args` | extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

[`DecodeFunctionResultReturnType`](index.md#decodefunctionresultreturntype)\<`abi`, `functionName`, `args`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:25

___

### defineCall

▸ **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`: \{ `data`: \`0x$\{string}\` ; `gasLimit`: `bigint`  }) => `Promise`\<`ExecResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `abi` | `TAbi` |
| `handlers` | \{ [TFunctionName in string]: Handler\<TAbi, TFunctionName\> } |

#### Returns

`fn`

▸ (`«destructured»`): `Promise`\<`ExecResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data` | \`0x$\{string}\` |
| › `gasLimit` | `bigint` |

##### Returns

`Promise`\<`ExecResult`\>

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:113

___

### definePrecompile

▸ **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>, ``"address"`` \| ``"events"`` \| ``"read"`` \| ``"write"``\> & \{ `address`: `TAddress` ; `events`: [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>, ``"address"`` \| ``"events"`` \| ``"read"`` \| ``"write"``\> & \{ `address`: `TAddress` ; `events`: [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>, ``"contract"`` \| ``"call"``\> |

#### Returns

`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Script`](index.md#script)\<`TName`, `THumanReadableAbi`\>, ``"address"`` \| ``"events"`` \| ``"read"`` \| ``"write"``\> & \{ `address`: `TAddress` ; `events`: [`EventActionCreator`](index.md#eventactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `read`: [`ReadActionCreator`](index.md#readactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\> ; `write`: [`WriteActionCreator`](index.md#writeactioncreator)\<`THumanReadableAbi`, \`0x$\{string}\`, \`0x$\{string}\`, `TAddress`\>  }\>\>

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:97

___

### definePredeploy

▸ **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Predeploy`](../classes/index.Predeploy.md)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`Predeploy`](../classes/index.Predeploy.md)\<`TName`, `THumanReadableAbi`\>, ``"address"`` \| ``"contract"``\> |

#### Returns

[`Predeploy`](../classes/index.Predeploy.md)\<`TName`, `THumanReadableAbi`\>

**`Example`**

```ts
import { definePredeploy } from 'tevm/predeploys'
import { createMemoryClient } from 'tevm/vm'
import { createScript } from 'tevm/contract'

const predeploy = definePredeploy({
  address: `0x${'23'.repeat(20)}`,
  contract: createScript({
    name: 'PredeployExample',
    humanReadableAbi: ['function foo() external pure returns (uint256)'],
    bytecode: '0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe608060405260043610610041576000357c0100',
    deployedBytecode: '0x608060405260043610610041576000357c010000
  })
})

const vm = createMemoryClient({
 predeploys: [predeploy.predeploy()],
})
```

#### Defined in

evmts-monorepo/packages/predeploys/types/definePredeploy.d.ts:25

___

### encodeAbiParameters

▸ **encodeAbiParameters**\<`TParams`\>(`params`, `values`): `EncodeAbiParametersReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends readonly `unknown`[] \| readonly `AbiParameter`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |
| `values` | `TParams` extends readonly `AbiParameter`[] ? \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<TParams[K], AbiParameterKind\> }[K] } : `never` |

#### Returns

`EncodeAbiParametersReturnType`

**`Description`**

Encodes a list of primitive values into an ABI-encoded hex value.

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeAbiParameters.d.ts:17

___

### encodeDeployData

▸ **encodeDeployData**\<`abi`\>(`parameters`): `EncodeDeployDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeDeployDataParameters`\<`abi`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"constructor"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractConstructorArgs`\<`abi`\>\> |

#### Returns

`EncodeDeployDataReturnType`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeDeployData.d.ts:21

___

### encodeErrorResult

▸ **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `errorName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"error"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractErrorArgs`\<`abi`, `errorName` extends `ContractErrorName`\<`abi`\> ? `errorName` : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\> |

#### Returns

`EncodeErrorResultReturnType`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeErrorResult.d.ts:23

___

### encodeEventTopics

▸ **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): \`0x$\{string}\`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `eventName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `type`: ``"event"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\> |

#### Returns

\`0x$\{string}\`[]

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeEventTopics.d.ts:24

___

### encodeFunctionData

▸ **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`EncodeFunctionDataParameters`](index.md#encodefunctiondataparameters)\<`abi`, `functionName`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionDataReturnType`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:27

___

### encodeFunctionResult

▸ **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends [`Abi`](index.md#abi) ? [`Abi`](index.md#abi) extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, [`ContractFunctionName`](index.md#contractfunctionname)\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionResultReturnType`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionResult.d.ts:21

___

### encodePacked

▸ **encodePacked**\<`TPackedAbiTypes`\>(`types`, `values`): [`Hex`](index.md#hex)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPackedAbiTypes` | extends readonly `unknown`[] \| readonly `PackedAbiType`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `types` | `TPackedAbiTypes` |
| `values` | `EncodePackedValues`\<`TPackedAbiTypes`\> |

#### Returns

[`Hex`](index.md#hex)

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodePacked.d.ts:17

___

### formatAbi

▸ **formatAbi**\<`TAbi`\>(`abi`): [`FormatAbi`](index.md#formatabi)\<`TAbi`\>

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends [`Abi`](index.md#abi) \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | `TAbi` | ABI |

#### Returns

[`FormatAbi`](index.md#formatabi)\<`TAbi`\>

Human-readable ABI

#### Defined in

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:18

___

### formatEther

▸ **formatEther**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` \| ``"gwei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatEther.d.ts:14

___

### formatGwei

▸ **formatGwei**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatGwei.d.ts:14

___

### formatLog

▸ **formatLog**(`log`, `«destructured»?`): `Log`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Partial`\<`RpcLog`\> |
| `«destructured»` | `Object` |
| › `args?` | `unknown` |
| › `eventName?` | `string` |

#### Returns

`Log`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/formatters/log.d.ts:5

___

### fromBytes

▸ **fromBytes**\<`TTo`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`TTo`\>

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes
- Example: https://viem.sh/docs/utilities/fromBytes#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"hex"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `toOrOpts` | `FromBytesParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromBytesReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(new Uint8Array([1, 164]), 'number')
// 420
```

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  'string'
)
// 'Hello world'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:37

___

### fromHex

▸ **fromHex**\<`TTo`\>(`hex`, `toOrOpts`): `FromHexReturnType`\<`TTo`\>

Decodes a hex string into a string, number, bigint, boolean, or byte array.

- Docs: https://viem.sh/docs/utilities/fromHex
- Example: https://viem.sh/docs/utilities/fromHex#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"bytes"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex string to decode. |
| `toOrOpts` | `FromHexParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromHexReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x1a4', 'number')
// 420
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c6421', 'string')
// 'Hello world'
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
  size: 32,
  to: 'string'
})
// 'Hello world'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:47

___

### fromRlp

▸ **fromRlp**\<`to`\>(`value`, `to?`): `FromRlpReturnType`\<`to`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `to` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | \`0x$\{string}\` \| `Uint8Array` |
| `to?` | `to` \| `To` |

#### Returns

`FromRlpReturnType`\<`to`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromRlp.d.ts:12

___

### getAddress

▸ **getAddress**(`address`, `chainId?`): [`Address`](index.md#address)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId?` | `number` |

#### Returns

[`Address`](index.md#address)

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/address/getAddress.d.ts:9

___

### hexToBigInt

▸ **hexToBigInt**(`hex`, `opts?`): `bigint`

Decodes a hex value into a bigint.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobigint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

#### Returns

`bigint`

BigInt value.

**`Example`**

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x1a4', { signed: true })
// 420n
```

**`Example`**

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420n
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:74

___

### hexToBool

▸ **hexToBool**(`hex_`, `opts?`): `boolean`

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex_` | \`0x$\{string}\` | - |
| `opts?` | `HexToBoolOpts` | Options. |

#### Returns

`boolean`

Boolean value.

**`Example`**

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

**`Example`**

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:99

___

### hexToBytes

▸ **hexToBytes**(`hex_`, `opts?`): `ByteArray`

Encodes a hex string into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#hextobytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex_` | \`0x$\{string}\` | - |
| `opts?` | `HexToBytesOpts` | Options. |

#### Returns

`ByteArray`

Byte array value.

**`Example`**

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

**`Example`**

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:87

___

### hexToNumber

▸ **hexToNumber**(`hex`, `opts?`): `number`

Decodes a hex string into a number.

- Docs: https://viem.sh/docs/utilities/fromHex#hextonumber

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

#### Returns

`number`

Number value.

**`Example`**

```ts
import { hexToNumber } from 'viem'
const data = hexToNumber('0x1a4')
// 420
```

**`Example`**

```ts
import { hexToNumber } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:121

___

### hexToString

▸ **hexToString**(`hex`, `opts?`): `string`

Decodes a hex value into a UTF-8 string.

- Docs: https://viem.sh/docs/utilities/fromHex#hextostring

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex value to decode. |
| `opts?` | `HexToStringOpts` | Options. |

#### Returns

`string`

String value.

**`Example`**

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c6421')
// 'Hello world!'
```

**`Example`**

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 size: 32,
})
// 'Hello world'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:148

___

### isAddress

▸ **isAddress**(`address`): address is \`0x$\{string}\`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

address is \`0x$\{string}\`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/address/isAddress.d.ts:4

___

### isBytes

▸ **isBytes**(`value`): value is Uint8Array

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is Uint8Array

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/data/isBytes.d.ts:4

___

### isHex

▸ **isHex**(`value`, `«destructured»?`): value is \`0x$\{string}\`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `«destructured»` | `Object` |
| › `strict?` | `boolean` |

#### Returns

value is \`0x$\{string}\`

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/data/isHex.d.ts:4

___

### keccak256

▸ **keccak256**\<`TTo`\>(`value`, `to_?`): `Keccak256Hash`\<`TTo`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | \`0x$\{string}\` \| `Uint8Array` |
| `to_?` | `TTo` |

#### Returns

`Keccak256Hash`\<`TTo`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/hash/keccak256.d.ts:9

___

### mnemonicToAccount

▸ **mnemonicToAccount**(`mnemonic`, `opts?`): [`HDAccount`](index.md#hdaccount)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `opts?` | `HDOptions` |

#### Returns

[`HDAccount`](index.md#hdaccount)

A HD Account.

**`Description`**

Creates an Account from a mnemonic phrase.

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/accounts/mnemonicToAccount.d.ts:10

___

### numberToHex

▸ **numberToHex**(`value_`, `opts?`): [`Hex`](index.md#hex)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value_` | `number` \| `bigint` | - |
| `opts?` | `NumberToHexOpts` | Options. |

#### Returns

[`Hex`](index.md#hex)

Hex value.

**`Example`**

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

**`Example`**

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:122

___

### parseAbi

▸ **parseAbi**\<`TSignatures`\>(`signatures`): [`ParseAbi`](index.md#parseabi)\<`TSignatures`\>

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

[`ParseAbi`](index.md#parseabi)\<`TSignatures`\>

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

evmts-monorepo/node_modules/.pnpm/abitype@1.0.0_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37

___

### parseEther

▸ **parseEther**(`ether`, `unit?`): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

#### Parameters

| Name | Type |
| :------ | :------ |
| `ether` | `string` |
| `unit?` | ``"wei"`` \| ``"gwei"`` |

#### Returns

`bigint`

**`Example`**

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/parseEther.d.ts:15

___

### parseGwei

▸ **parseGwei**(`ether`, `unit?`): `bigint`

Converts a string representation of gwei to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseGwei

#### Parameters

| Name | Type |
| :------ | :------ |
| `ether` | `string` |
| `unit?` | ``"wei"`` |

#### Returns

`bigint`

**`Example`**

```ts
import { parseGwei } from 'viem'

parseGwei('420')
// 420000000000n
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/parseGwei.d.ts:15

___

### stringToHex

▸ **stringToHex**(`value_`, `opts?`): [`Hex`](index.md#hex)

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value_` | `string` | - |
| `opts?` | `StringToHexOpts` | Options. |

#### Returns

[`Hex`](index.md#hex)

Hex value.

**`Example`**

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

**`Example`**

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:147

___

### toBytes

▸ **toBytes**(`value`, `opts?`): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` | Value to encode. |
| `opts?` | `ToBytesParameters` | Options. |

#### Returns

`ByteArray`

Byte array value.

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420)
// Uint8Array([1, 164])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420, { size: 4 })
// Uint8Array([0, 0, 1, 164])
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:37

___

### toHex

▸ **toHex**(`value`, `opts?`): [`Hex`](index.md#hex)

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array` | Value to encode. |
| `opts?` | `ToHexParameters` | Options. |

#### Returns

[`Hex`](index.md#hex)

Hex value.

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:36

___

### toRlp

▸ **toRlp**\<`to`\>(`bytes`, `to?`): `ToRlpReturnType`\<`to`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `to` | extends `To` = ``"hex"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `RecursiveArray`\<`Uint8Array`\> \| `RecursiveArray`\<\`0x$\{string}\`\> |
| `to?` | `to` \| `To` |

#### Returns

`ToRlpReturnType`\<`to`\>

#### Defined in

evmts-monorepo/node_modules/.pnpm/viem@2.7.9_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toRlp.d.ts:10
