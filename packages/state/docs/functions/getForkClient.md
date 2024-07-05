[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getForkClient

# Function: getForkClient()

> **getForkClient**(`baseState`): `object`

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`object`

### account

> **account**: `undefined`

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

• **parameters**: `CallParameters`\<`undefined` \| `Chain`\>

#### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

### ccipRead?

> `optional` **ccipRead**: `false` \| `object`

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

### chain

> **chain**: `undefined` \| `Chain`

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

• **args?**: `EstimateFeesPerGasParameters`\<`undefined` \| `Chain`, `TChainOverride`, `TType`\>

#### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

### estimateGas()

> **estimateGas**: (`args`) => `Promise`\<`bigint`\>

#### Parameters

• **args**: `EstimateGasParameters`\<`undefined` \| `Chain`\>

EstimateGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateGasReturnType

### estimateMaxPriorityFeePerGas()

> **estimateMaxPriorityFeePerGas**: \<`TChainOverride`\>(`args`?) => `Promise`\<`bigint`\>

#### Type Parameters

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args?**

• **args.chain?**: `null` \| `TChainOverride`

#### Returns

`Promise`\<`bigint`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `undefined` \| `Chain`, `undefined`, `PublicRpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `undefined` \| `Chain`\>\>

#### Type Parameters

• **client** *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`, `undefined` \| `Chain`, `undefined`\>\>

#### Parameters

• **fn**

#### Returns

`Client`\<`Transport`, `undefined` \| `Chain`, `undefined`, `PublicRpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions`\<`Transport`, `undefined` \| `Chain`\>\>

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

> **getBlock**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`?) => `Promise`\<`object`\>

#### Type Parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args?**: `GetBlockParameters`\<`TIncludeTransactions`, `TBlockTag`\>

GetBlockParameters

#### Returns

`Promise`\<`object`\>

Information about the block. GetBlockReturnType

##### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

Base fee per gas

##### blobGasUsed

> **blobGasUsed**: `bigint`

Total used blob gas by all transactions in this block

##### difficulty

> **difficulty**: `bigint`

Difficulty for this block

##### excessBlobGas

> **excessBlobGas**: `bigint`

Excess blob gas

##### extraData

> **extraData**: \`0x$\{string\}\`

"Extra data" field of this block

##### gasLimit

> **gasLimit**: `bigint`

Maximum gas allowed in this block

##### gasUsed

> **gasUsed**: `bigint`

Total used gas by all transactions in this block

##### hash

> **hash**: `TBlockTag` *extends* `"pending"` ? `null` : \`0x$\{string\}\`

Block hash or `null` if pending

##### logsBloom

> **logsBloom**: `TBlockTag` *extends* `"pending"` ? `null` : \`0x$\{string\}\`

Logs bloom filter or `null` if pending

##### miner

> **miner**: \`0x$\{string\}\`

Address that received this block’s mining rewards

##### mixHash

> **mixHash**: \`0x$\{string\}\`

Unique identifier for the block.

##### nonce

> **nonce**: `TBlockTag` *extends* `"pending"` ? `null` : \`0x$\{string\}\`

Proof-of-work hash or `null` if pending

##### number

> **number**: `TBlockTag` *extends* `"pending"` ? `null` : `bigint`

Block number or `null` if pending

##### parentHash

> **parentHash**: \`0x$\{string\}\`

Parent block hash

##### receiptsRoot

> **receiptsRoot**: \`0x$\{string\}\`

Root of the this block’s receipts trie

##### sealFields

> **sealFields**: \`0x$\{string\}\`[]

##### sha3Uncles

> **sha3Uncles**: \`0x$\{string\}\`

SHA3 of the uncles data in this block

##### size

> **size**: `bigint`

Size of this block in bytes

##### stateRoot

> **stateRoot**: \`0x$\{string\}\`

Root of this block’s final state trie

##### timestamp

> **timestamp**: `bigint`

Unix timestamp of when this block was collated

##### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

Total difficulty of the chain until this block

##### transactions

> **transactions**: `TIncludeTransactions` *extends* `true` ? (`object` \| `object` \| `object` \| `object`)[] : \`0x$\{string\}\`[]

##### transactionsRoot

> **transactionsRoot**: \`0x$\{string\}\`

Root of this block’s transaction trie

##### uncles

> **uncles**: \`0x$\{string\}\`[]

List of uncle hashes

##### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

List of withdrawal objects

##### withdrawalsRoot?

> `optional` **withdrawalsRoot**: \`0x$\{string\}\`

Root of the this block’s withdrawals trie

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

#### Parameters

• **args**: `GetCodeParameters`

#### Returns

`Promise`\<`GetCodeReturnType`\>

#### Deprecated

Use `getCode` instead.

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

> **getTransaction**: \<`TBlockTag`\>(`args`) => `Promise`\<`object` \| `object` \| `object` \| `object`\>

#### Type Parameters

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `GetTransactionParameters`\<`TBlockTag`\>

GetTransactionParameters

#### Returns

`Promise`\<`object` \| `object` \| `object` \| `object`\>

The transaction information. GetTransactionReturnType

### getTransactionConfirmations()

> **getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

#### Parameters

• **args**: `GetTransactionConfirmationsParameters`\<`undefined` \| `Chain`\>

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

> **getTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

#### Parameters

• **args**: `GetTransactionReceiptParameters`

GetTransactionReceiptParameters

#### Returns

`Promise`\<`TransactionReceipt`\>

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

> **prepareTransactionRequest**: \<`TRequest`, `TChainOverride`, `TAccountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "type" \| "gas" \| "nonce" \| "blobVersionedHashes" \| "fees" \| "chainId"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

#### Type Parameters

• **TRequest** *extends* `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> & `object` & `object`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **TAccountOverride** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

#### Parameters

• **args**: `PrepareTransactionRequestParameters`\<`undefined` \| `Chain`, `undefined` \| `Account`, `TChainOverride`, `TAccountOverride`, `TRequest`\>

PrepareTransactionRequestParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "type" \| "gas" \| "nonce" \| "blobVersionedHashes" \| "fees" \| "chainId"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

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

> **request**: `EIP1193RequestFn`\<`PublicRpcSchema`\>

Request function wrapped with friendly error handling

### sendRawTransaction()

> **sendRawTransaction**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

#### Parameters

• **args**: `SendRawTransactionParameters`

#### Returns

`Promise`\<\`0x$\{string\}\`\>

The transaction hash. SendRawTransactionReturnType

### simulateContract()

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

#### Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

• **chainOverride** *extends* `undefined` \| `Chain`

• **accountOverride** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

#### Parameters

• **args**: `SimulateContractParameters`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `chainOverride`, `accountOverride`\>

SimulateContractParameters

#### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

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

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

#### Parameters

• **args**: `WaitForTransactionReceiptParameters`\<`undefined` \| `Chain`\>

WaitForTransactionReceiptParameters

#### Returns

`Promise`\<`TransactionReceipt`\>

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

• **args**: `WatchBlocksParameters`\<`Transport`, `undefined` \| `Chain`, `TIncludeTransactions`, `TBlockTag`\>

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

[packages/state/src/actions/getForkClient.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getForkClient.js#L20)
