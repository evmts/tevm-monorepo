[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / createMemoryClient

# Function: createMemoryClient()

> **createMemoryClient**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?): `object`

Creates a [MemoryClient](../type-aliases/MemoryClient.md) which is a viem client with an in-memory Ethereum client as its transport.
It comes batteries included with all wallet, test, public, and tevm actions.

## Type Parameters

• **TCommon** *extends* `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\> = `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\>

• **TAccountOrAddress** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

• **TRpcSchema** *extends* `undefined` \| `RpcSchema` = [`object`, `object`, `object`, `object`, `object`]

## Parameters

• **options?**: [`MemoryClientOptions`](../type-aliases/MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

`object`

### account

> **account**: `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`

The Account of the Client.

### addChain()

> **addChain**: (`args`) => `Promise`\<`void`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/addChain
- JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { optimism } from 'viem/chains'

const client = createWalletClient({
  transport: custom(window.ethereum),
})
await client.addChain({ chain: optimism })
```

#### Parameters

• **args**: `AddChainParameters`

AddChainParameters

#### Returns

`Promise`\<`void`\>

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

> **createContractEventFilter**: \<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **args** *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[]

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `CreateContractEventFilterParameters`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>

CreateContractEventFilterParameters

#### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

### createEventFilter()

> **createEventFilter**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

#### Type Parameters

• **abiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? [`abiEvent`\<`abiEvent`\>] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **_EventName** *extends* `undefined` \| `string` = `MaybeAbiEventName`\<`abiEvent`\>

• **_Args** *extends* `undefined` \| `Record`\<`string`, `unknown`\> \| readonly `unknown`[] = `undefined`

#### Parameters

• **args?**: `CreateEventFilterParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>

CreateEventFilterParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

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

### deployContract()

> **deployContract**: \<`abi`, `chainOverride`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **chainOverride** *extends* `undefined` \| `Chain`

#### Parameters

• **args**: `DeployContractParameters`\<`abi`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`\>

DeployContractParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. DeployContractReturnType

### dropTransaction()

> **dropTransaction**: (`args`) => `Promise`\<`void`\>

Removes a transaction from the mempool.

- Docs: https://viem.sh/docs/actions/test/dropTransaction

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.dropTransaction({
  hash: '0xe58dceb6b20b03965bb678e27d141e151d7d4efc2334c2d6a49b9fac523f7364'
})
```

#### Parameters

• **args**: `DropTransactionParameters`

DropTransactionParameters

#### Returns

`Promise`\<`void`\>

### dumpState()

> **dumpState**: () => `Promise`\<\`0x$\{string\}\`\>

Serializes the current state (including contracts code, contract's storage,
accounts properties, etc.) into a savable data blob.

- Docs: https://viem.sh/docs/actions/test/dumpState

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.dumpState()
```

#### Returns

`Promise`\<\`0x$\{string\}\`\>

### estimateContractGas()

> **estimateContractGas**: \<`chain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

#### Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

• **args**: `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `chain`\>

EstimateContractGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateContractGasReturnType

### estimateFeesPerGas()

> **estimateFeesPerGas**: \<`chainOverride`, `type`\>(`args`?) => `Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **type** *extends* `FeeValuesType` = `"eip1559"`

#### Parameters

• **args?**: `EstimateFeesPerGasParameters`\<`TCommon`, `chainOverride`, `type`\>

#### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

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

> **estimateMaxPriorityFeePerGas**: \<`chainOverride`\>(`args`?) => `Promise`\<`bigint`\>

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args?**: `GetChainParameter`\<`TCommon`, `chainOverride`\>

#### Returns

`Promise`\<`bigint`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & [`TevmActions`](../type-aliases/TevmActions.md) & `PublicActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `WalletActions`\<`TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `TestActions`\>

#### Type Parameters

• **client** *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\>\>

#### Parameters

• **fn**

#### Returns

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & [`TevmActions`](../type-aliases/TevmActions.md) & `PublicActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `WalletActions`\<`TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & `TestActions`\>

### getAddresses()

> **getAddresses**: () => `Promise`\<`GetAddressesReturnType`\>

#### Returns

`Promise`\<`GetAddressesReturnType`\>

List of account addresses owned by the wallet or client. GetAddressesReturnType

### getAutomine()

> **getAutomine**: () => `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

Whether or not the node is auto mining. GetAutomineReturnType

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

> **getBlock**: \<`includeTransactions`, `blockTag`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, includeTransactions, blockTag\>\[K\] \}\>

#### Type Parameters

• **includeTransactions** *extends* `boolean` = `false`

• **blockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args?**: `GetBlockParameters`\<`includeTransactions`, `blockTag`\>

GetBlockParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, includeTransactions, blockTag\>\[K\] \}\>

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

### getChainId

> **getChainId**: () => `Promise`\<`number`\> & () => `Promise`\<`number`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const chainId = await client.getChainId()
// 1
```

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

> **getFilterChanges**: \<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

#### Type Parameters

• **filterType** *extends* `FilterType`

• **abi** *extends* `undefined` \| `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetFilterChangesParameters`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterChangesParameters

#### Returns

`Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

### getFilterLogs()

> **getFilterLogs**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

#### Type Parameters

• **abi** *extends* `undefined` \| `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetFilterLogsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterLogsParameters

#### Returns

`Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetFilterLogsReturnType

### getGasPrice()

> **getGasPrice**: () => `Promise`\<`bigint`\>

#### Returns

`Promise`\<`bigint`\>

The gas price (in wei). GetGasPriceReturnType

### getLogs()

> **getLogs**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>(`args`?) => `Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

#### Type Parameters

• **abiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? [`abiEvent`\<`abiEvent`\>] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args?**: `GetLogsParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>

GetLogsParameters

#### Returns

`Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetLogsReturnType

### getPermissions()

> **getPermissions**: () => `Promise`\<`GetPermissionsReturnType`\>

#### Returns

`Promise`\<`GetPermissionsReturnType`\>

The wallet permissions. GetPermissionsReturnType

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

> **getTransaction**: \<`blockTag`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, blockTag\>\[K\] \}\>

#### Type Parameters

• **blockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `GetTransactionParameters`\<`blockTag`\>

GetTransactionParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, blockTag\>\[K\] \}\>

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

### getTxpoolContent()

> **getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

#### Returns

`Promise`\<`GetTxpoolContentReturnType`\>

Transaction pool content. GetTxpoolContentReturnType

### getTxpoolStatus()

> **getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

#### Returns

`Promise`\<`GetTxpoolStatusReturnType`\>

Transaction pool status. GetTxpoolStatusReturnType

### impersonateAccount()

> **impersonateAccount**: (`args`) => `Promise`\<`void`\>

Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.

- Docs: https://viem.sh/docs/actions/test/impersonateAccount

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.impersonateAccount({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### Parameters

• **args**: `ImpersonateAccountParameters`

ImpersonateAccountParameters

#### Returns

`Promise`\<`void`\>

### increaseTime()

> **increaseTime**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

Jump forward in time by the given amount of time, in seconds.

- Docs: https://viem.sh/docs/actions/test/increaseTime

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.increaseTime({
  seconds: 420,
})
```

#### Parameters

• **args**: `IncreaseTimeParameters`

– IncreaseTimeParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

### inspectTxpool()

> **inspectTxpool**: () => `Promise`\<`InspectTxpoolReturnType`\>

#### Returns

`Promise`\<`InspectTxpoolReturnType`\>

Transaction pool inspection data. InspectTxpoolReturnType

### key

> **key**: `string`

A key for the client.

### loadState()

> **loadState**: (`args`) => `Promise`\<`void`\>

Adds state previously dumped with `dumpState` to the current chain.

- Docs: https://viem.sh/docs/actions/test/loadState

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.loadState({ state: '0x...' })
```

#### Parameters

• **args**: `LoadStateParameters`

#### Returns

`Promise`\<`void`\>

### mine()

> **mine**: (`args`) => `Promise`\<`void`\>

Mine a specified number of blocks.

- Docs: https://viem.sh/docs/actions/test/mine

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.mine({ blocks: 1 })
```

#### Parameters

• **args**: `MineParameters`

– MineParameters

#### Returns

`Promise`\<`void`\>

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

### prepareTransactionRequest

> **prepareTransactionRequest**: \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<(...) & (...) & (...), (...) extends (...) ? (...) : (...)\> & Object, ParameterTypeToParameters\<(...)\[(...)\] extends readonly (...)\[\] ? (...)\[(...)\] : (...) \| (...) \| (...) \| (...) \| (...) \| (...)\>\> & (unknown extends request\["kzg"\] ? Object : Pick\<request, "kzg"\>))\[K\] \}\> & \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<(...) & (...) & (...), (...) extends (...) ? (...) : (...)\> & Object, ParameterTypeToParameters\<(...)\[(...)\] extends readonly (...)\[\] ? (...)\[(...)\] : (...) \| (...) \| (...) \| (...) \| (...) \| (...)\>\> & (unknown extends request\["kzg"\] ? Object : Pick\<request, "kzg"\>))\[K\] \}\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

#### Param

PrepareTransactionRequestParameters

#### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

```ts
// Account Hoisting
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  account: privateKeyToAccount('0x…'),
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

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

### removeBlockTimestampInterval()

> **removeBlockTimestampInterval**: () => `Promise`\<`void`\>

Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.

- Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { removeBlockTimestampInterval } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.removeBlockTimestampInterval()
```

#### Returns

`Promise`\<`void`\>

### request

> **request**: `EIP1193RequestFn`\<[`object`, `object`, `object`, `object`, `object`]\>

Request function wrapped with friendly error handling

### requestAddresses()

> **requestAddresses**: () => `Promise`\<`RequestAddressesReturnType`\>

#### Returns

`Promise`\<`RequestAddressesReturnType`\>

List of accounts managed by a wallet RequestAddressesReturnType

### requestPermissions()

> **requestPermissions**: (`args`) => `Promise`\<`RequestPermissionsReturnType`\>

#### Parameters

• **args**

RequestPermissionsParameters

• **args.eth\_accounts**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`RequestPermissionsReturnType`\>

The wallet permissions. RequestPermissionsReturnType

### reset()

> **reset**: (`args`?) => `Promise`\<`void`\>

Resets fork back to its original state.

- Docs: https://viem.sh/docs/actions/test/reset

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.reset({ blockNumber: 69420n })
```

#### Parameters

• **args?**: `ResetParameters`

– ResetParameters

#### Returns

`Promise`\<`void`\>

### revert()

> **revert**: (`args`) => `Promise`\<`void`\>

Revert the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/revert

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.revert({ id: '0x…' })
```

#### Parameters

• **args**: `RevertParameters`

– RevertParameters

#### Returns

`Promise`\<`void`\>

### sendRawTransaction

> **sendRawTransaction**: (`args`) => `Promise`\<\`0x$\{string\}\`\> & (`args`) => `Promise`\<\`0x$\{string\}\`\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

#### Param

Client to use

#### Param

SendRawTransactionParameters

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { sendRawTransaction } from 'viem/wallet'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const hash = await client.sendRawTransaction({
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
})
```

### sendTransaction()

> **sendTransaction**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Type Parameters

• **request** *extends* `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> & `object`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args**: `SendTransactionParameters`\<`TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`, `request`\>

SendTransactionParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. SendTransactionReturnType

### sendUnsignedTransaction()

> **sendUnsignedTransaction**: \<`chain`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Type Parameters

• **chain** *extends* `undefined` \| `Chain`

#### Parameters

• **args**: `SendUnsignedTransactionParameters`\<`chain`\>

– SendUnsignedTransactionParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The transaction hash. SendUnsignedTransactionReturnType

### setAutomine()

> **setAutomine**: (`args`) => `Promise`\<`void`\>

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

- Docs: https://viem.sh/docs/actions/test/setAutomine

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setAutomine()
```

#### Parameters

• **args**: `boolean`

#### Returns

`Promise`\<`void`\>

### setBalance()

> **setBalance**: (`args`) => `Promise`\<`void`\>

Modifies the balance of an account.

- Docs: https://viem.sh/docs/actions/test/setBalance

#### Example

```ts
import { createTestClient, http, parseEther } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBalance({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: parseEther('1'),
})
```

#### Parameters

• **args**: `SetBalanceParameters`

– SetBalanceParameters

#### Returns

`Promise`\<`void`\>

### setBlockGasLimit()

> **setBlockGasLimit**: (`args`) => `Promise`\<`void`\>

Sets the block's gas limit.

- Docs: https://viem.sh/docs/actions/test/setBlockGasLimit

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBlockGasLimit({ gasLimit: 420_000n })
```

#### Parameters

• **args**: `SetBlockGasLimitParameters`

– SetBlockGasLimitParameters

#### Returns

`Promise`\<`void`\>

### setBlockTimestampInterval()

> **setBlockTimestampInterval**: (`args`) => `Promise`\<`void`\>

Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

- Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBlockTimestampInterval({ interval: 5 })
```

#### Parameters

• **args**: `SetBlockTimestampIntervalParameters`

– SetBlockTimestampIntervalParameters

#### Returns

`Promise`\<`void`\>

### setCode()

> **setCode**: (`args`) => `Promise`\<`void`\>

Modifies the bytecode stored at an account's address.

- Docs: https://viem.sh/docs/actions/test/setCode

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setCode({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df…',
})
```

#### Parameters

• **args**: `SetCodeParameters`

– SetCodeParameters

#### Returns

`Promise`\<`void`\>

### setCoinbase()

> **setCoinbase**: (`args`) => `Promise`\<`void`\>

Sets the coinbase address to be used in new blocks.

- Docs: https://viem.sh/docs/actions/test/setCoinbase

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setCoinbase({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
})
```

#### Parameters

• **args**: `SetCoinbaseParameters`

– SetCoinbaseParameters

#### Returns

`Promise`\<`void`\>

### setIntervalMining()

> **setIntervalMining**: (`args`) => `Promise`\<`void`\>

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.

- Docs: https://viem.sh/docs/actions/test/setIntervalMining

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setIntervalMining({ interval: 5 })
```

#### Parameters

• **args**: `SetIntervalMiningParameters`

– SetIntervalMiningParameters

#### Returns

`Promise`\<`void`\>

### setLoggingEnabled()

> **setLoggingEnabled**: (`args`) => `Promise`\<`void`\>

Enable or disable logging on the test node network.

- Docs: https://viem.sh/docs/actions/test/setLoggingEnabled

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setLoggingEnabled()
```

#### Parameters

• **args**: `boolean`

#### Returns

`Promise`\<`void`\>

### setMinGasPrice()

> **setMinGasPrice**: (`args`) => `Promise`\<`void`\>

Change the minimum gas price accepted by the network (in wei).

- Docs: https://viem.sh/docs/actions/test/setMinGasPrice

Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.

#### Example

```ts
import { createTestClient, http, parseGwei } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setMinGasPrice({
  gasPrice: parseGwei('20'),
})
```

#### Parameters

• **args**: `SetMinGasPriceParameters`

– SetBlockGasLimitParameters

#### Returns

`Promise`\<`void`\>

### setNextBlockBaseFeePerGas()

> **setNextBlockBaseFeePerGas**: (`args`) => `Promise`\<`void`\>

Sets the next block's base fee per gas.

- Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas

#### Example

```ts
import { createTestClient, http, parseGwei } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNextBlockBaseFeePerGas({
  baseFeePerGas: parseGwei('20'),
})
```

#### Parameters

• **args**: `SetNextBlockBaseFeePerGasParameters`

– SetNextBlockBaseFeePerGasParameters

#### Returns

`Promise`\<`void`\>

### setNextBlockTimestamp()

> **setNextBlockTimestamp**: (`args`) => `Promise`\<`void`\>

Sets the next block's timestamp.

- Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNextBlockTimestamp({ timestamp: 1671744314n })
```

#### Parameters

• **args**: `SetNextBlockTimestampParameters`

– SetNextBlockTimestampParameters

#### Returns

`Promise`\<`void`\>

### setNonce()

> **setNonce**: (`args`) => `Promise`\<`void`\>

Modifies (overrides) the nonce of an account.

- Docs: https://viem.sh/docs/actions/test/setNonce

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNonce({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  nonce: 420,
})
```

#### Parameters

• **args**: `SetNonceParameters`

– SetNonceParameters

#### Returns

`Promise`\<`void`\>

### setRpcUrl()

> **setRpcUrl**: (`args`) => `Promise`\<`void`\>

Sets the backend RPC URL.

- Docs: https://viem.sh/docs/actions/test/setRpcUrl

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setRpcUrl('https://eth-mainnet.g.alchemy.com/v2')
```

#### Parameters

• **args**: `string`

#### Returns

`Promise`\<`void`\>

### setStorageAt()

> **setStorageAt**: (`args`) => `Promise`\<`void`\>

Writes to a slot of an account's storage.

- Docs: https://viem.sh/docs/actions/test/setStorageAt

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setStorageAt({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  index: 2,
  value: '0x0000000000000000000000000000000000000000000000000000000000000069',
})
```

#### Parameters

• **args**: `SetStorageAtParameters`

– SetStorageAtParameters

#### Returns

`Promise`\<`void`\>

### signMessage()

> **signMessage**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Parameters

• **args**: `SignMessageParameters`\<`TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\>

SignMessageParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The signed message. SignMessageReturnType

### signTransaction()

> **signTransaction**: \<`chainOverride`\>(`args`) => `Promise`\<\`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| \`0x04$\{string\}\` \| `TransactionSerializedLegacy`\>

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain`

#### Parameters

• **args**: `SignTransactionParameters`\<`TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`\>

SignTransactionParameters

#### Returns

`Promise`\<\`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| \`0x04$\{string\}\` \| `TransactionSerializedLegacy`\>

The signed message. SignTransactionReturnType

### signTypedData()

> **signTypedData**: \<`typedData`, `primaryType`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Type Parameters

• **typedData** *extends* `object` \| `object`

• **primaryType** *extends* `string`

#### Parameters

• **args**: `SignTypedDataParameters`\<`typedData`, `primaryType`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\>

SignTypedDataParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The signed data. SignTypedDataReturnType

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

### snapshot()

> **snapshot**: () => `Promise`\<\`0x$\{string\}\`\>

Snapshot the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/snapshot

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { snapshot } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.snapshot()
```

#### Returns

`Promise`\<\`0x$\{string\}\`\>

### stopImpersonatingAccount()

> **stopImpersonatingAccount**: (`args`) => `Promise`\<`void`\>

Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).

- Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { stopImpersonatingAccount } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.stopImpersonatingAccount({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
})
```

#### Parameters

• **args**: `StopImpersonatingAccountParameters`

– StopImpersonatingAccountParameters

#### Returns

`Promise`\<`void`\>

### switchChain()

> **switchChain**: (`args`) => `Promise`\<`void`\>

Switch the target chain in a wallet.

- Docs: https://viem.sh/docs/actions/wallet/switchChain
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet, optimism } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
await client.switchChain({ id: optimism.id })
```

#### Parameters

• **args**: `SwitchChainParameters`

SwitchChainParameters

#### Returns

`Promise`\<`void`\>

### tevm

> **tevm**: `object` & `EIP1193Events` & `object` & `Eip1193RequestProvider`

Low level access to TEVM can be accessed via `tevm`. These APIs are not guaranteed to be stable.

#### See

TevmNode

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient()

// low level access to the TEVM VM, blockchain, EVM, stateManager, mempool, receiptsManager and more are available
const vm = await memoryClient.tevm.getVm()
vm.runBlock(...)
const { blockchain, evm, stateManager } = vm
blockchain.addBlock(...)
evm.runCall(...)
stateManager.putAccount(...)

const mempool = await memoryClient.tevm.getTxPool()
const receiptsManager = await memoryClient.tevm.getReceiptsManager()
```

#### Type declaration

##### deepCopy()

> `readonly` **deepCopy**: () => `Promise`\<`TevmNode`\<`"fork"` \| `"normal"`, `object`\>\>

Copies the current client state into a new client

###### Returns

`Promise`\<`TevmNode`\<`"fork"` \| `"normal"`, `object`\>\>

##### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => `TevmNode`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type Parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

###### Parameters

• **decorator**

###### Returns

`TevmNode`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

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

##### status

> **status**: `"INITIALIZING"` \| `"READY"` \| `"SYNCING"` \| `"MINING"` \| `"STOPPED"`

Returns status of the client
- INITIALIZING: The client is initializing
- READY: The client is ready to be used
- SYNCING: The client is syncing with the forked node
- MINING: The client is mining a block

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

### tevmCall

> **tevmCall**: `CallHandler`

A powerful low level API for executing calls and sending transactions.
See [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
See [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

```typescript
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
In addition to making basic calls, you can also do advanced things like:
- Impersonate accounts via passing in `from`, `caller`, or `origin`
- Set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- Send as a transaction with `createTransaction: true`
For all options see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)

### tevmContract

> **tevmContract**: `ContractHandler`

A powerful low level API for calling contracts. Similar to `tevmCall` but takes care of encoding and decoding data, revert messages, etc.
See [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
See [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

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
In addition to making basic calls, you can also do advanced things like:
- Impersonate accounts via passing in `from`, `caller`, or `origin`
- Set the call depth via `depth`
- Create a trace or access list using `createTrace: true` or `createAccessList: true`
- Send as a transaction with `createTransaction: true`
For all options see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)

### tevmDeploy

> **tevmDeploy**: `DeployHandler`

Deploys a contract to the EVM with encoded constructor arguments. Extends `tevmCall` so it supports all advanced options.

#### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.

#### Example

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

console.log(deploymentResult.createdAddress)
```

### tevmDumpState

> **tevmDumpState**: `DumpStateHandler`

Dumps a JSON serializable state from the EVM. This can be useful for persisting and restoring state between processes.

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

Gets the account state of an account. It does not return the storage state by default but can if `returnStorage` is set to `true`.
In forked mode, the storage is only the storage TEVM has cached and may not represent all the on-chain storage.

#### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.

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

Loads a JSON serializable state into the EVM. This can be useful for persisting and restoring state between processes.

#### Example

```typescript
import { createMemoryClient } from 'tevm'
import fs from 'fs'

const client = createMemoryClient()

const state = fs.readFileSync('state.json', 'utf8')

await client.tevmLoadState(state)
```

### tevmMine

> **tevmMine**: `MineHandler`

Mines a new block with all pending transactions. In `manual` mode you must call this manually before the canonical head state is updated.

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmMine()
```

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

Returns a promise that resolves when the TEVM is ready.
This is not needed to explicitly be called as all actions will wait for the TEVM to be ready.

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmReady()
```
Same as calling `client.tevm.ready()`

#### Returns

`Promise`\<`true`\>

### tevmSetAccount

> **tevmSetAccount**: `SetAccountHandler`

Sets any property of an account including its balance, nonce, contract deployedBytecode, contract state, and more.

#### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.

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

> **transport**: `TransportConfig`\<`string`\> & `object`

The RPC transport

#### Type declaration

##### tevm

> **tevm**: `object` & `EIP1193Events` & `object` & `object`

###### Type declaration

###### deepCopy()

> `readonly` **deepCopy**: () => `Promise`\<`TevmNode`\<`"fork"` \| `"normal"`, `object`\>\>

Copies the current client state into a new client

###### Returns

`Promise`\<`TevmNode`\<`"fork"` \| `"normal"`, `object`\>\>

###### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => `TevmNode`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type Parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

###### Parameters

• **decorator**

###### Returns

`TevmNode`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

###### forkTransport?

> `readonly` `optional` **forkTransport**: `object`

Client to make json rpc requests to a forked node

###### Example

```ts
const client = createMemoryClient({ request: eip1193RequestFn })
```

###### forkTransport.request

> **request**: `EIP1193RequestFn`

###### getFilters()

> `readonly` **getFilters**: () => `Map`\<\`0x$\{string\}\`, `Filter`\>

Gets all registered filters mapped by id

###### Returns

`Map`\<\`0x$\{string\}\`, `Filter`\>

###### getImpersonatedAccount()

> `readonly` **getImpersonatedAccount**: () => `undefined` \| \`0x$\{string\}\`

The currently impersonated account. This is only used in `fork` mode

###### Returns

`undefined` \| \`0x$\{string\}\`

###### getReceiptsManager()

> `readonly` **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

###### Returns

`Promise`\<`ReceiptsManager`\>

###### getTxPool()

> `readonly` **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

###### Returns

`Promise`\<`TxPool`\>

###### getVm()

> `readonly` **getVm**: () => `Promise`\<`Vm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

###### Returns

`Promise`\<`Vm`\>

###### logger

> `readonly` **logger**: `Logger`

The logger instance

###### miningConfig

> `readonly` **miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

###### mode

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

###### ready()

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

###### removeFilter()

> `readonly` **removeFilter**: (`id`) => `void`

Removes a filter by id

###### Parameters

• **id**: \`0x$\{string\}\`

###### Returns

`void`

###### setFilter()

> `readonly` **setFilter**: (`filter`) => `void`

Creates a new filter to watch for logs events and blocks

###### Parameters

• **filter**: `Filter`

###### Returns

`void`

###### setImpersonatedAccount()

> `readonly` **setImpersonatedAccount**: (`address`) => `void`

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

###### Parameters

• **address**: `undefined` \| \`0x$\{string\}\`

###### Returns

`void`

###### status

> **status**: `"INITIALIZING"` \| `"READY"` \| `"SYNCING"` \| `"MINING"` \| `"STOPPED"`

Returns status of the client
- INITIALIZING: The client is initializing
- READY: The client is ready to be used
- SYNCING: The client is syncing with the forked node
- MINING: The client is mining a block

###### Type declaration

###### emit()

Emit an event.

###### Parameters

• **eventName**: keyof `EIP1193EventMap`

The event name.

• ...**args**: `any`[]

Arguments to pass to the event listeners.

###### Returns

`boolean`

True if the event was emitted, false otherwise.

###### Type declaration

###### request

> **request**: `EIP1193RequestFn`

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

### watchAsset()

> **watchAsset**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**: `WatchAssetParams`

WatchAssetParameters

#### Returns

`Promise`\<`boolean`\>

Boolean indicating if the token was successfully added. WatchAssetReturnType

### watchBlockNumber()

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

#### Parameters

• **args**: `WatchBlockNumberParameters`

WatchBlockNumberParameters

#### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

### watchBlocks()

> **watchBlocks**: \<`includeTransactions`, `blockTag`\>(`args`) => `WatchBlocksReturnType`

#### Type Parameters

• **includeTransactions** *extends* `boolean` = `false`

• **blockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `WatchBlocksParameters`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `includeTransactions`, `blockTag`\>

WatchBlocksParameters

#### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

### watchContractEvent()

> **watchContractEvent**: \<`abi`, `eventName`, `strict`\>(`args`) => `WatchContractEventReturnType`

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchContractEventParameters`\<`abi`, `eventName`, `strict`, [`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchContractEventParameters

#### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

### watchEvent()

> **watchEvent**: \<`abiEvent`, `abiEvents`, `strict`\>(`args`) => `WatchEventReturnType`

#### Type Parameters

• **abiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `abiEvent` *extends* `AbiEvent` ? [`abiEvent`\<`abiEvent`\>] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchEventParameters`\<`abiEvent`, `abiEvents`, `strict`, [`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchEventParameters

#### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

### watchPendingTransactions()

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

#### Parameters

• **args**: `WatchPendingTransactionsParameters`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchPendingTransactionsParameters

#### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

### writeContract()

> **writeContract**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args**: `WriteContractParameters`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `chainOverride`\>

WriteContractParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). WriteContractReturnType

## Defined in

[packages/memory-client/src/createMemoryClient.js:189](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L189)
