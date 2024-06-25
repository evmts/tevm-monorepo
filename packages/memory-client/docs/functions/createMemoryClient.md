[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / createMemoryClient

# Function: createMemoryClient()

> **createMemoryClient**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?): `object`

Creates a [MemoryClient](../type-aliases/MemoryClient.md) which is an viem client with an in-memory ethereum client as it's transport.
It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)

## Type Parameters

• **TCommon** *extends* `Chain` & `object` = `Chain` & `object`

• **TAccountOrAddress** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

• **TRpcSchema** *extends* `undefined` \| `RpcSchema` = [`object`, `object`, `object`, `object`, `object`]

## Parameters

• **options?**: `MemoryClientOptions`\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

`object`

### \_tevm

> **\_tevm**: `object` & `EIP1193Events` & `object` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

Low level access to tevm can be accessed via `tevm_tevm`. These apis are not guaranteed to be stable

#### See

BaseClient

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient()

// low level access to the tevm vm, blockchain, evm, stateManager, mempool, receiptsManager and more are available
const vm = await memoryClient._tevm.getVm()
vm.runBlocl(...)
const {blockchain, evm, stateManager} = vm
blockchain.addBlock(...)
evm.runCall(...)
stateManager.putAccount(...)

const mempool = await memoryClient._tevm.getTxPool()
const receiptsManager = await memoryClient._tevm.getReceiptsManager()
````

#### Type declaration

##### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type Parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

###### Parameters

• **decorator**

###### Returns

`BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

##### forkTransport?

> `readonly` `optional` **forkTransport**: `object`

Client to make json rpc requests to a forked node

###### Example

```ts
const client = createMemoryClient({ request: eip1193RequestFn })
```

##### forkTransport.request

> **request**: `EIP1193RequestFn`

##### getFilters()

> `readonly` **getFilters**: () => `Map`\<\`0x$\{string\}\`, `Filter`\>

Gets all registered filters mapped by id

###### Returns

`Map`\<\`0x$\{string\}\`, `Filter`\>

##### getImpersonatedAccount()

> `readonly` **getImpersonatedAccount**: () => `undefined` \| \`0x$\{string\}\`

The currently impersonated account. This is only used in `fork` mode

###### Returns

`undefined` \| \`0x$\{string\}\`

##### getReceiptsManager()

> `readonly` **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

###### Returns

`Promise`\<`ReceiptsManager`\>

##### getTxPool()

> `readonly` **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

###### Returns

`Promise`\<`TxPool`\>

##### getVm()

> `readonly` **getVm**: () => `Promise`\<`Vm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

###### Returns

`Promise`\<`Vm`\>

##### logger

> `readonly` **logger**: `Logger`

The logger instance

##### miningConfig

> `readonly` **miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

##### mode

> `readonly` **mode**: `"fork"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`normal` mode will not fetch any state and will only run the EVM in memory

###### Example

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

##### ready()

> `readonly` **ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

###### Example

```ts
const client = createMemoryClient()
await client.ready()
```

###### Returns

`Promise`\<`true`\>

##### removeFilter()

> `readonly` **removeFilter**: (`id`) => `void`

Removes a filter by id

###### Parameters

• **id**: \`0x$\{string\}\`

###### Returns

`void`

##### setFilter()

> `readonly` **setFilter**: (`filter`) => `void`

Creates a new filter to watch for logs events and blocks

###### Parameters

• **filter**: `Filter`

###### Returns

`void`

##### setImpersonatedAccount()

> `readonly` **setImpersonatedAccount**: (`address`) => `void`

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

###### Parameters

• **address**: `undefined` \| \`0x$\{string\}\`

###### Returns

`void`

#### Type declaration

##### emit()

Emit an event.

###### Parameters

• **eventName**: keyof `EIP1193EventMap`

The event name.

• ...**args**: `any`[]

Arguments to pass to the event listeners.

###### Returns

`boolean`

True if the event was emitted, false otherwise.

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

##### send

> **send**: `TevmJsonRpcRequestHandler`

##### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

### account

> **account**: `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`

The Account of the Client.

### batch?

> `optional` **batch**: `object`

Flags for batch settings.

### batch.multicall?

> `optional` **multicall**: `boolean` \| `object`

Toggle to enable `eth_call` multicall aggregation.

### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

### call()

> **call**: (`parameters`) => `Promise`\<`CallReturnType`\>

#### Parameters

• **parameters**: `CallParameters`\<`TCommon`\>

#### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

### ccipRead?

> `optional` **ccipRead**: `false` \| `object`

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

### chain

> **chain**: `TCommon`

Chain for the client.

### createBlockFilter()

> **createBlockFilter**: () => `Promise`\<`object`\>

#### Returns

`Promise`\<`object`\>

Filter. CreateBlockFilterReturnType

##### id

> **id**: \`0x$\{string\}\`

##### request

> **request**: `EIP1193RequestFn`\<readonly [`object`, `object`, `object`]\>

##### type

> **type**: `"block"`

### createContractEventFilter()

> **createContractEventFilter**: \<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

#### Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `undefined` \| `string`

• **TArgs** *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[]

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

• **TFromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **TToBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `CreateContractEventFilterParameters`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>

CreateContractEventFilterParameters

#### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

### createEventFilter()

> **createEventFilter**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", TAbiEvents, \_EventName, \_Args, TStrict, TFromBlock, TToBlock\>\[K\] \}\>

#### Type Parameters

• **TAbiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **TAbiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`\<`TAbiEvent`\>] : `undefined`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

• **TFromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **TToBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **_EventName** *extends* `undefined` \| `string` = `MaybeAbiEventName`\<`TAbiEvent`\>

• **_Args** *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[] = `undefined`

#### Parameters

• **args?**: `CreateEventFilterParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>

CreateEventFilterParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", TAbiEvents, \_EventName, \_Args, TStrict, TFromBlock, TToBlock\>\[K\] \}\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateEventFilterReturnType

### createPendingTransactionFilter()

> **createPendingTransactionFilter**: () => `Promise`\<`object`\>

#### Returns

`Promise`\<`object`\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateBlockFilterReturnType

##### id

> **id**: \`0x$\{string\}\`

##### request

> **request**: `EIP1193RequestFn`\<readonly [`object`, `object`, `object`]\>

##### type

> **type**: `"transaction"`

### estimateContractGas()

> **estimateContractGas**: \<`TChain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

#### Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

• **args**: `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `TChain`\>

EstimateContractGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateContractGasReturnType

### estimateFeesPerGas()

> **estimateFeesPerGas**: \<`TChainOverride`, `TType`\>(`args`?) => `Promise`\<`EstimateFeesPerGasReturnType`\>

#### Type Parameters

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **TType** *extends* `FeeValuesType` = `"eip1559"`

#### Parameters

• **args?**: `EstimateFeesPerGasParameters`\<`TCommon`, `TChainOverride`, `TType`\>

#### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

### estimateGas()

> **estimateGas**: (`args`) => `Promise`\<`bigint`\>

#### Parameters

• **args**: `EstimateGasParameters`\<`TCommon`\>

EstimateGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateGasReturnType

### estimateMaxPriorityFeePerGas()

> **estimateMaxPriorityFeePerGas**: \<`TChainOverride`\>(`args`?) => `Promise`\<`bigint`\>

#### Type Parameters

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args?**: `GetChainParameter`\<`TCommon`, `TChainOverride`\>

#### Returns

`Promise`\<`bigint`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & [`TevmActions`](../type-aliases/TevmActions.md)\>

#### Type Parameters

• **client** *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\>\>

#### Parameters

• **fn**

#### Returns

`Client`\<`Transport`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & [`TevmActions`](../type-aliases/TevmActions.md)\>

### getBalance()

> **getBalance**: (`args`) => `Promise`\<`bigint`\>

#### Parameters

• **args**: `GetBalanceParameters`

GetBalanceParameters

#### Returns

`Promise`\<`bigint`\>

The balance of the address in wei. GetBalanceReturnType

### getBlobBaseFee()

> **getBlobBaseFee**: () => `Promise`\<`bigint`\>

#### Returns

`Promise`\<`bigint`\>

The blob base fee (in wei). GetBlobBaseFeeReturnType

### getBlock()

> **getBlock**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, TIncludeTransactions, TBlockTag\>\[K\] \}\>

#### Type Parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args?**: `GetBlockParameters`\<`TIncludeTransactions`, `TBlockTag`\>

GetBlockParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, TIncludeTransactions, TBlockTag\>\[K\] \}\>

Information about the block. GetBlockReturnType

### getBlockNumber()

> **getBlockNumber**: (`args`?) => `Promise`\<`bigint`\>

#### Parameters

• **args?**: `GetBlockNumberParameters`

GetBlockNumberParameters

#### Returns

`Promise`\<`bigint`\>

The number of the block. GetBlockNumberReturnType

### getBlockTransactionCount()

> **getBlockTransactionCount**: (`args`?) => `Promise`\<`number`\>

#### Parameters

• **args?**: `GetBlockTransactionCountParameters`

GetBlockTransactionCountParameters

#### Returns

`Promise`\<`number`\>

The block transaction count. GetBlockTransactionCountReturnType

### ~~getBytecode()~~

> **getBytecode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

#### Deprecated

Use `getCode` instead.

#### Parameters

• **args**: `GetCodeParameters`

#### Returns

`Promise`\<`GetCodeReturnType`\>

### getChainId()

> **getChainId**: () => `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

The current chain ID. GetChainIdReturnType

### getCode()

> **getCode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

#### Parameters

• **args**: `GetCodeParameters`

GetBytecodeParameters

#### Returns

`Promise`\<`GetCodeReturnType`\>

The contract's bytecode. GetBytecodeReturnType

### getContractEvents()

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string` = `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

#### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetContractEventsReturnType

### getEip712Domain()

> **getEip712Domain**: (`args`) => `Promise`\<`GetEip712DomainReturnType`\>

#### Parameters

• **args**: `GetEip712DomainParameters`

#### Returns

`Promise`\<`GetEip712DomainReturnType`\>

The EIP-712 domain, fields, and extensions. GetEip712DomainReturnType

### getEnsAddress()

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

#### Parameters

• **args**

GetEnsAddressParameters

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.coinType?**: `number`

ENSIP-9 compliant coinType used to resolve addresses for other chains

• **args.gatewayUrls?**: `string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

• **args.name**: `string`

Name to get the address for.

• **args.strict?**: `boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

• **args.universalResolverAddress?**: \`0x$\{string\}\`

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsAddressReturnType`\>

Address for ENS name or `null` if not found. GetEnsAddressReturnType

### getEnsAvatar()

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

#### Parameters

• **args**

GetEnsAvatarParameters

• **args.assetGatewayUrls?**: `AssetGatewayUrls`

Gateway urls to resolve IPFS and/or Arweave assets.

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.gatewayUrls?**: `string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

• **args.name**: `string`

ENS name to get Text for.

• **args.strict?**: `boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

• **args.universalResolverAddress?**: \`0x$\{string\}\`

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsAvatarReturnType`\>

Avatar URI or `null` if not found. GetEnsAvatarReturnType

### getEnsName()

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

#### Parameters

• **args**

GetEnsNameParameters

• **args.address**: \`0x$\{string\}\`

Address to get ENS name for.

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.gatewayUrls?**: `string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

• **args.strict?**: `boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

• **args.universalResolverAddress?**: \`0x$\{string\}\`

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsNameReturnType`\>

Name or `null` if not found. GetEnsNameReturnType

### getEnsResolver()

> **getEnsResolver**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Parameters

• **args**

GetEnsResolverParameters

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.name**: `string`

Name to get the address for.

• **args.universalResolverAddress?**: \`0x$\{string\}\`

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<\`0x$\{string\}\`\>

Address for ENS resolver. GetEnsResolverReturnType

### getEnsText()

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

#### Parameters

• **args**

GetEnsTextParameters

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.gatewayUrls?**: `string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

• **args.key**: `string`

Text record to retrieve.

• **args.name**: `string`

ENS name to get Text for.

• **args.strict?**: `boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

• **args.universalResolverAddress?**: \`0x$\{string\}\`

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsTextReturnType`\>

Address for ENS resolver. GetEnsTextReturnType

### getFeeHistory()

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

#### Parameters

• **args**: `GetFeeHistoryParameters`

GetFeeHistoryParameters

#### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

The gas estimate (in wei). GetFeeHistoryReturnType

### getFilterChanges()

> **getFilterChanges**: \<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

#### Type Parameters

• **TFilterType** *extends* `FilterType`

• **TAbi** *extends* `undefined` \| `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `undefined` \| `string`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

• **TFromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **TToBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetFilterChangesParameters`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>

GetFilterChangesParameters

#### Returns

`Promise`\<`GetFilterChangesReturnType`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

### getFilterLogs()

> **getFilterLogs**: \<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

#### Type Parameters

• **TAbi** *extends* `undefined` \| `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `undefined` \| `string`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

• **TFromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **TToBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetFilterLogsParameters`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>

GetFilterLogsParameters

#### Returns

`Promise`\<`GetFilterLogsReturnType`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

A list of event logs. GetFilterLogsReturnType

### getGasPrice()

> **getGasPrice**: () => `Promise`\<`bigint`\>

#### Returns

`Promise`\<`bigint`\>

The gas price (in wei). GetGasPriceReturnType

### getLogs()

> **getLogs**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`?) => `Promise`\<`GetLogsReturnType`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

#### Type Parameters

• **TAbiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **TAbiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`\<`TAbiEvent`\>] : `undefined`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

• **TFromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **TToBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args?**: `GetLogsParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>

GetLogsParameters

#### Returns

`Promise`\<`GetLogsReturnType`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

A list of event logs. GetLogsReturnType

### getProof()

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

#### Parameters

• **args**: `GetProofParameters`

#### Returns

`Promise`\<`GetProofReturnType`\>

Proof data. GetProofReturnType

### getStorageAt()

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

#### Parameters

• **args**: `GetStorageAtParameters`

GetStorageAtParameters

#### Returns

`Promise`\<`GetStorageAtReturnType`\>

The value of the storage slot. GetStorageAtReturnType

### getTransaction()

> **getTransaction**: \<`TBlockTag`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, TBlockTag\>\[K\] \}\>

#### Type Parameters

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `GetTransactionParameters`\<`TBlockTag`\>

GetTransactionParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, TBlockTag\>\[K\] \}\>

The transaction information. GetTransactionReturnType

### getTransactionConfirmations()

> **getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

#### Parameters

• **args**: `GetTransactionConfirmationsParameters`\<`TCommon`\>

GetTransactionConfirmationsParameters

#### Returns

`Promise`\<`bigint`\>

The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. GetTransactionConfirmationsReturnType

### getTransactionCount()

> **getTransactionCount**: (`args`) => `Promise`\<`number`\>

#### Parameters

• **args**: `GetTransactionCountParameters`

GetTransactionCountParameters

#### Returns

`Promise`\<`number`\>

The number of transactions an account has sent. GetTransactionCountReturnType

### getTransactionReceipt()

> **getTransactionReceipt**: (`args`) => `Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

#### Parameters

• **args**: `GetTransactionReceiptParameters`

GetTransactionReceiptParameters

#### Returns

`Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

The transaction receipt. GetTransactionReceiptReturnType

### key

> **key**: `string`

A key for the client.

### multicall()

> **multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

#### Type Parameters

• **contracts** *extends* readonly `unknown`[]

• **allowFailure** *extends* `boolean` = `true`

#### Parameters

• **args**: `MulticallParameters`\<`contracts`, `allowFailure`\>

MulticallParameters

#### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

An array of results with accompanying status. MulticallReturnType

### name

> **name**: `string`

A name for the client.

### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

### prepareTransactionRequest()

> **prepareTransactionRequest**: \<`TRequest`, `TChainOverride`, `TAccountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "gas" \| "nonce" \| "blobVersionedHashes" \| "chainId" \| "type" \| "fees"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

#### Type Parameters

• **TRequest** *extends* `object` & `object`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **TAccountOverride** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

#### Parameters

• **args**: `PrepareTransactionRequestParameters`\<`TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `TChainOverride`, `TAccountOverride`, `TRequest`\>

PrepareTransactionRequestParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "gas" \| "nonce" \| "blobVersionedHashes" \| "chainId" \| "type" \| "fees"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

The transaction request. PrepareTransactionRequestReturnType

### readContract()

> **readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

• **args**: `ReadContractParameters`\<`abi`, `functionName`, `args`\>

ReadContractParameters

#### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

The response from the contract. Type is inferred. ReadContractReturnType

### request

> **request**: `EIP1193RequestFn`\<[`object`, `object`, `object`, `object`, `object`]\>

Request function wrapped with friendly error handling

### sendRawTransaction()

> **sendRawTransaction**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Parameters

• **args**: `SendRawTransactionParameters`

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The transaction hash. SendRawTransactionReturnType

### simulateContract()

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`, `accountOverride`\>\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

• **chainOverride** *extends* `undefined` \| `Chain`

• **accountOverride** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

#### Parameters

• **args**: `SimulateContractParameters`\<`abi`, `functionName`, `args`, `TCommon`, `chainOverride`, `accountOverride`\>

SimulateContractParameters

#### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

### tevmCall

> **tevmCall**: `CallHandler`

A powerful low level api for executing calls and sending transactions
See [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference
See [CallResult](https://tevm.sh/reference/tevm/precompiles/type-aliases/callresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript`
import { createMemoryClient } from 'tevm'
import { ERC20 } from 'tevm/contract'

const client = createMemoryClient()

const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)

await client.setAccount(token)

const balance = await client.tevmCall({
 to: token.address,
 data: encodeFunctionData(token.read.balanceOf, [token.address]),
})
```
In addiiton to making basic call, you can also do advanced things like
- impersonate accounts via passing in `from`, `caller`, or `origin`
- set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- send as a transaction with `createTransaction: true`
For all options see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
Same as calling `client._tevm.call`
`

### tevmContract

> **tevmContract**: `ContractHandler`

A powerful low level api for calling contracts. Similar to `tevmCall` but takes care of encoding and decoding data, revert messages, etc.
See [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference]
See [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript
import { createMemoryClient } from 'tevm'
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()
const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)
await client.setAccount(token)
const balance = await client.tevmContract({
  contract: token,
  method: token.read.balanceOf,
  args: [token.address],
})
```
In addiiton to making basic call, you can also do advanced things like
- impersonate accounts via passing in `from`, `caller`, or `origin`
- set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- send as a transaction with `createTransaction: true`
For all options see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)

### tevmDeploy

> **tevmDeploy**: `DeployHandler`

Deploys a contract to the EVM with encoded constructor arguments. Extends `tevmCall` so it supports all advanced options

#### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript
import { createMemoryClient } from 'tevm'
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()
const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)

const deploymentResult = await client.tevmDeploy({
  abi: token.abi,
  bytecode: token.bytecode,
  args: ['TokenName', 18, 'SYMBOL'],
})

console.log(deployedResult.createdAddressess)

### tevmDumpState

> **tevmDumpState**: `DumpStateHandler`

Dumps a json serializable state from the evm. This can be useful for persisting and restoring state between processes

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'
const client = createMemoryClient()
const state = await client.tevmDumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

### tevmGetAccount

> **tevmGetAccount**: `GetAccountHandler`

Gets the account state of an account
It does not return the storage state by default but can if `returnStorage` is set to `true`. In forked mode the storage is only the storage
Tevm has cached and may not represent all the onchain storage.

#### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const account = await client.tevmGetAccount({
  address: `0x${'0000'.repeat(10)}`,
  returnStorage: true,
})
```

### tevmLoadState

> **tevmLoadState**: `LoadStateHandler`

Loads a json serializable state into the evm. This can be useful for persisting and restoring state between processes

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'

const client = createMemoryClient()

const state = fs.readFileSync('state.json', 'utf8')

await client.tevmLoadState(state)
````

### tevmMine

> **tevmMine**: `MineHandler`

Mines a new block with all pending transactions. In `manual` mode you must call this manually before the cannonical head state is updated

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmMine()
```

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

Returns a promise that resolves when the tevm is ready
This is not needed to explicitly be called as all actions will wait for the tevm to be ready

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmReady()
```
Same as calling `client._tevm.ready()`

#### Returns

`Promise`\<`true`\>

### ~~tevmScript~~

> **tevmScript**: `ScriptHandler`

#### Deprecated

in favor of tevmContract. To migrate simply replace `tevmScript` with `tevmContract` as the api is supported and more
tevmContract also now supports deploying contracts with constructor arguments too via `params.code`. TevmScript previously did not support this
and only supported deployedBytecode with no constructor arguments. tevmContract supports using deployedBytecode as waell.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise it will be a call`. You must also mine the transaction
before it updates the cannonical head state.` This can be avoided by setting mining mode to `auto` when using createMemoryClient`
@example
```typescript
import { createMemoryClient } from 'tevm'`
import { ERC20 } from './MyERC721.sol'

const client = createMemoryClient()

const balance = await client.tevmContract({
  createTransaction: true,
  deployedBytecode: ERC20.deployedBytecode,
  abi: ERC20.abi,
  method: 'mint',
  args: [client.address, 1n],
})
```
Same as calling `client._tevm.script`
`

### tevmSetAccount

> **tevmSetAccount**: `SetAccountHandler`

Sets any property of an account including
- it's balance
- It's nonce
- It's contract deployedBytecode
- It's contract state
- more

#### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference]
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference

#### Example

```typescript
import { createMemoryClient, numberToHex } from 'tevm'
import { SimpleContract } from 'tevm/contract'

const client = createMemoryClient()

await client.tevmSetAccount({
 address: `0x${'0123'.repeat(10)}`,
 balance: 100n,
 nonce: 1n,
 deployedBytecode: SimpleContract.deployedBytecode,
 state: {
   [`0x${'0'.repeat(64)}`]: numberToHex(420n),
 }
})
```

### transport

> **transport**: `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\>

The RPC transport

### type

> **type**: `string`

The type of client.

### uid

> **uid**: `string`

A unique ID for the client.

### uninstallFilter()

> **uninstallFilter**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**: `UninstallFilterParameters`

UninstallFilterParameters

#### Returns

`Promise`\<`boolean`\>

A boolean indicating if the Filter was successfully uninstalled. UninstallFilterReturnType

### verifyMessage()

> **verifyMessage**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**

• **args.address**: \`0x$\{string\}\`

The address that signed the original message.

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.factory?**: \`0x$\{string\}\`

• **args.factoryData?**: \`0x$\{string\}\`

• **args.message**: `SignableMessage`

The message to be verified.

• **args.signature**: \`0x$\{string\}\` \| `Uint8Array` \| `Signature`

The signature that was generated by signing the message with the address's private key.

#### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyMessageReturnType

### verifySiweMessage()

> **verifySiweMessage**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**

• **args.address?**: \`0x$\{string\}\`

Ethereum address to check against.

• **args.blockNumber?**: `bigint`

The balance of the account at a block number.

• **args.blockTag?**: `BlockTag`

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

• **args.domain?**: `string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority to check against.

• **args.message**: `string`

EIP-4361 formatted message.

• **args.nonce?**: `string`

Random string to check against.

• **args.scheme?**: `string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme to check against.

• **args.signature**: \`0x$\{string\}\`

Signature to check against.

• **args.time?**: `Date`

Current time to check optional `expirationTime` and `notBefore` fields.

**Default**

```ts
new Date()
```

#### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifySiweMessageReturnType

### verifyTypedData()

> **verifyTypedData**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**: `VerifyTypedDataParameters`

#### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyTypedDataReturnType

### waitForTransactionReceipt()

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

#### Parameters

• **args**: `WaitForTransactionReceiptParameters`\<`TCommon`\>

WaitForTransactionReceiptParameters

#### Returns

`Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

The transaction receipt. WaitForTransactionReceiptReturnType

### watchBlockNumber()

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

#### Parameters

• **args**: `WatchBlockNumberParameters`

WatchBlockNumberParameters

#### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

### watchBlocks()

> **watchBlocks**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`) => `WatchBlocksReturnType`

#### Type Parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `WatchBlocksParameters`\<`Transport`, `TCommon`, `TIncludeTransactions`, `TBlockTag`\>

WatchBlocksParameters

#### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

### watchContractEvent()

> **watchContractEvent**: \<`TAbi`, `TEventName`, `TStrict`\>(`args`) => `WatchContractEventReturnType`

#### Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `string`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchContractEventParameters`\<`TAbi`, `TEventName`, `TStrict`, `Transport`\>

WatchContractEventParameters

#### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

### watchEvent()

> **watchEvent**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`\>(`args`) => `WatchEventReturnType`

#### Type Parameters

• **TAbiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **TAbiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`\<`TAbiEvent`\>] : `undefined`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchEventParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `Transport`\>

WatchEventParameters

#### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

### watchPendingTransactions()

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

#### Parameters

• **args**: `WatchPendingTransactionsParameters`\<`Transport`\>

WatchPendingTransactionsParameters

#### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

## Defined in

[packages/memory-client/src/createMemoryClient.js:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L94)
