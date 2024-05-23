[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createL1Client

# Function: createL1Client()

> **createL1Client**(`__namedParameters`): `object`

Creates a Tevm client preloaded and initialized with L1 contracts. This corresponds to the 3.0 major version of Optimism
When possible it uses the values from mainnet. For some constants this
isn't possible as currently this protocol isn't deployed to a testnet or mainnet.

All constants including vital OP stack addresses and owners are available and transactions may be sent mocking them using tevm `to` property.

## Parameters

• **\_\_namedParameters**= `{}`

• **\_\_namedParameters.chainId?**: `10`= `10`

## Returns

`object`

### \_tevm

> **\_tevm**: `object` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

#### Type declaration

##### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

###### Parameters

• **decorator**

###### Returns

`BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

##### forkUrl?

> `optional` `readonly` **forkUrl**: `string`

Fork url if the EVM is forked

###### Example

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

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

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

##### send

> **send**: `TevmJsonRpcRequestHandler`

##### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

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

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const data = await client.call({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
})
```

#### Parameters

• **parameters**: `CallParameters`\<`undefined` \| `Chain`\>

#### Returns

`Promise`\<`CallReturnType`\>

### ccipRead?

> `optional` **ccipRead**: `false` \| `object`

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

### chain

> **chain**: `undefined`

Chain for the client.

### createBlockFilter()

> **createBlockFilter**: () => `Promise`\<`object`\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

#### Example

```ts
import { createPublicClient, createBlockFilter, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await createBlockFilter(client)
// { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
```

#### Returns

`Promise`\<`object`\>

##### id

> **id**: \`0x$\{string\}\`

##### request

> **request**: `EIP1193RequestFn`\<readonly [`object`, `object`, `object`]\>

##### type

> **type**: `"block"`

### createContractEventFilter()

> **createContractEventFilter**: \<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

#### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
})
```

#### Type parameters

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

### createEventFilter()

> **createEventFilter**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: Filter\<"event", TAbiEvents, \_EventName, \_Args, TStrict, TFromBlock, TToBlock\>\[K\] \}\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
})
```

#### Type parameters

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

### createPendingTransactionFilter()

> **createPendingTransactionFilter**: () => `Promise`\<`object`\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
// { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
```

#### Returns

`Promise`\<`object`\>

##### id

> **id**: \`0x$\{string\}\`

##### request

> **request**: `EIP1193RequestFn`\<readonly [`object`, `object`, `object`]\>

##### type

> **type**: `"transaction"`

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

> **estimateContractGas**: \<`TChain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

#### Remarks

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

#### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gas = await client.estimateContractGas({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint() public']),
  functionName: 'mint',
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
})
```

#### Type parameters

• **TChain** *extends* `undefined` \| `Chain`

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

• **args**: `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `TChain`\>

EstimateContractGasParameters

#### Returns

`Promise`\<`bigint`\>

### estimateFeesPerGas()

> **estimateFeesPerGas**: \<`TChainOverride`, `TType`\>(`args`?) => `Promise`\<`EstimateFeesPerGasReturnType`\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateFeesPerGas()
// { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
```

#### Type parameters

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **TType** *extends* `FeeValuesType` = `"eip1559"`

#### Parameters

• **args?**: `EstimateFeesPerGasParameters`\<`undefined` \| `Chain`, `TChainOverride`, `TType`\>

#### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\>

### estimateGas()

> **estimateGas**: (`args`) => `Promise`\<`bigint`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

#### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasEstimate = await client.estimateGas({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

#### Parameters

• **args**: `EstimateGasParameters`\<`undefined` \| `Chain`\>

EstimateGasParameters

#### Returns

`Promise`\<`bigint`\>

### estimateMaxPriorityFeePerGas()

> **estimateMaxPriorityFeePerGas**: \<`TChainOverride`\>(`args`?) => `Promise`\<`bigint`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas()
// 10000000n
```

#### Type parameters

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

• **args?**

• **args.chain?**: `null` \| `TChainOverride`

#### Returns

`Promise`\<`bigint`\>

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `undefined`, `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions` & `TestActions` & `TevmActions`\>

#### Type parameters

• **client** *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`, `undefined`, `undefined`\>\>

#### Parameters

• **fn**

#### Returns

`Client`\<`Transport`, `undefined`, `undefined`, [`object`, `object`, `object`, `object`, `object`], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `PublicActions` & `TestActions` & `TevmActions`\>

### getAutomine()

> **getAutomine**: () => `Promise`\<`boolean`\>

Returns the automatic mining status of the node.

- Docs: https://viem.sh/docs/actions/test/getAutomine

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const isAutomining = await client.getAutomine()
```

#### Returns

`Promise`\<`boolean`\>

### getBalance()

> **getBalance**: (`args`) => `Promise`\<`bigint`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

#### Remarks

You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).

```ts
const balance = await getBalance(client, {
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  blockTag: 'safe'
})
const balanceAsEther = formatEther(balance)
// "6.942"
```

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const balance = await client.getBalance({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
// 10000000000000000000000n (wei)
```

#### Parameters

• **args**: `GetBalanceParameters`

GetBalanceParameters

#### Returns

`Promise`\<`bigint`\>

### getBlobBaseFee()

> **getBlobBaseFee**: () => `Promise`\<`bigint`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getBlobBaseFee } from 'viem/public'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blobBaseFee = await client.getBlobBaseFee()
```

#### Returns

`Promise`\<`bigint`\>

### getBlock()

> **getBlock**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`?) => `Promise`\<`object`\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getBlock()
```

#### Type parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args?**: `GetBlockParameters`\<`TIncludeTransactions`, `TBlockTag`\>

GetBlockParameters

#### Returns

`Promise`\<`object`\>

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

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blockNumber = await client.getBlockNumber()
// 69420n
```

#### Parameters

• **args?**: `GetBlockNumberParameters`

GetBlockNumberParameters

#### Returns

`Promise`\<`bigint`\>

### getBlockTransactionCount()

> **getBlockTransactionCount**: (`args`?) => `Promise`\<`number`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const count = await client.getBlockTransactionCount()
```

#### Parameters

• **args?**: `GetBlockTransactionCountParameters`

GetBlockTransactionCountParameters

#### Returns

`Promise`\<`number`\>

### getBytecode()

> **getBytecode**: (`args`) => `Promise`\<`GetBytecodeReturnType`\>

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getBytecode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getBytecode({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
})
```

#### Parameters

• **args**: `GetBytecodeParameters`

GetBytecodeParameters

#### Returns

`Promise`\<`GetBytecodeReturnType`\>

### getChainId()

> **getChainId**: () => `Promise`\<`number`\>

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

#### Returns

`Promise`\<`number`\>

### getContractEvents()

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { wagmiAbi } from './abi'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getContractEvents(client, {
 address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 abi: wagmiAbi,
 eventName: 'Transfer'
})
```

#### Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string` = `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| `BlockTag` = `undefined`

#### Parameters

• **args**: `GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

#### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

### getEnsAddress()

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAddress = await client.getEnsAddress({
  name: normalize('wevm.eth'),
})
// '0xd2135CfB216b74109775236E36d4b433F1DF507B'
```

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

### getEnsAvatar()

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Remarks

Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAvatar = await client.getEnsAvatar({
  name: normalize('wevm.eth'),
})
// 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
```

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

### getEnsName()

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Remarks

Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensName = await client.getEnsName({
  address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
})
// 'wevm.eth'
```

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

### getEnsResolver()

> **getEnsResolver**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Remarks

Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const resolverAddress = await client.getEnsResolver({
  name: normalize('wevm.eth'),
})
// '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
```

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

### getEnsText()

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const twitterRecord = await client.getEnsText({
  name: normalize('wevm.eth'),
  key: 'com.twitter',
})
// 'wagmi_sh'
```

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

### getFeeHistory()

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const feeHistory = await client.getFeeHistory({
  blockCount: 4,
  rewardPercentiles: [25, 75],
})
```

#### Parameters

• **args**: `GetFeeHistoryParameters`

GetFeeHistoryParameters

#### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

### getFilterChanges()

> **getFilterChanges**: \<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

#### Remarks

A Filter can be created from the following actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

Depending on the type of filter, the return value will be different:

- If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
- If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
- If the filter was created with `createBlockFilter`, it returns a list of block hashes.

#### Examples

```ts
// Blocks
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createBlockFilter()
const hashes = await client.getFilterChanges({ filter })
```

```ts
// Contract Events
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
  eventName: 'Transfer',
})
const logs = await client.getFilterChanges({ filter })
```

```ts
// Raw Events
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterChanges({ filter })
```

```ts
// Transactions
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
const hashes = await client.getFilterChanges({ filter })
```

#### Type parameters

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

### getFilterLogs()

> **getFilterLogs**: \<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

#### Remarks

`getFilterLogs` is only compatible with **event filters**.

#### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterLogs({ filter })
```

#### Type parameters

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

### getGasPrice()

> **getGasPrice**: () => `Promise`\<`bigint`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasPrice = await client.getGasPrice()
```

#### Returns

`Promise`\<`bigint`\>

### getLogs()

> **getLogs**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`?) => `Promise`\<`GetLogsReturnType`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/filters-and-logs/event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

#### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getLogs()
```

#### Type parameters

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

### getProof()

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getProof({
 address: '0x...',
 storageKeys: ['0x...'],
})
```

#### Parameters

• **args**: `GetProofParameters`

#### Returns

`Promise`\<`GetProofReturnType`\>

### getStorageAt()

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getStorageAt } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getStorageAt({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  slot: toHex(0),
})
```

#### Parameters

• **args**: `GetStorageAtParameters`

GetStorageAtParameters

#### Returns

`Promise`\<`GetStorageAtReturnType`\>

### getTransaction()

> **getTransaction**: \<`TBlockTag`\>(`args`) => `Promise`\<`object` \| `object` \| `object` \| `object`\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transaction = await client.getTransaction({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

#### Type parameters

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `GetTransactionParameters`\<`TBlockTag`\>

GetTransactionParameters

#### Returns

`Promise`\<`object` \| `object` \| `object` \| `object`\>

### getTransactionConfirmations()

> **getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const confirmations = await client.getTransactionConfirmations({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

#### Parameters

• **args**: `GetTransactionConfirmationsParameters`\<`undefined` \| `Chain`\>

GetTransactionConfirmationsParameters

#### Returns

`Promise`\<`bigint`\>

### getTransactionCount()

> **getTransactionCount**: (`args`) => `Promise`\<`number`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionCount = await client.getTransactionCount({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### Parameters

• **args**: `GetTransactionCountParameters`

GetTransactionCountParameters

#### Returns

`Promise`\<`number`\>

### getTransactionReceipt()

> **getTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.getTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

#### Parameters

• **args**: `GetTransactionReceiptParameters`

GetTransactionReceiptParameters

#### Returns

`Promise`\<`TransactionReceipt`\>

### getTxpoolContent()

> **getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const content = await client.getTxpoolContent()
```

#### Returns

`Promise`\<`GetTxpoolContentReturnType`\>

### getTxpoolStatus()

> **getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolStatus

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const status = await client.getTxpoolStatus()
```

#### Returns

`Promise`\<`GetTxpoolStatusReturnType`\>

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

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/inspectTxpool

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const data = await client.inspectTxpool()
```

#### Returns

`Promise`\<`InspectTxpoolReturnType`\>

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

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

#### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])
const result = await client.multicall({
  contracts: [
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'balanceOf',
      args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
    },
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'totalSupply',
    },
  ],
})
// [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
```

#### Type parameters

• **contracts** *extends* readonly `unknown`[]

• **allowFailure** *extends* `boolean` = `true`

#### Parameters

• **args**: `MulticallParameters`\<`contracts`, `allowFailure`\>

MulticallParameters

#### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

### name

> **name**: `string`

A name for the client.

### op

> **op**: `object`

### op.BATCHER\_HASH

> **BATCHER\_HASH**: `"0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985"`

### op.BATCH\_INBOX

> **BATCH\_INBOX**: `"0xff00000000000000000000000000000011155420"`

### op.CHAIN\_ID

> **CHAIN\_ID**: `10`

### op.DISPUTE\_GAME\_FACTORY\_OWNER

> **DISPUTE\_GAME\_FACTORY\_OWNER**: \`0x$\{string\}\`

### op.DisputeGameFactory

> **DisputeGameFactory**: `Omit`\<`Script`\<`"DisputeGameFactory"`, readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x6901690169016901690169016901690169016901"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6901690169016901690169016901690169016901"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6901690169016901690169016901690169016901"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6901690169016901690169016901690169016901"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.EXPLORER

> **EXPLORER**: `"https://explorer.optimism.io"`

### op.GAS\_LIMIT

> **GAS\_LIMIT**: `30000000n`

### op.GUARDIAN

> **GUARDIAN**: `"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"`

### op.L1CrossDomainMessenger

> **L1CrossDomainMessenger**: `Omit`\<`Script`\<`"L1CrossDomainMessenger"`, readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function MESSAGE_VERSION() view returns (uint16)"`, `"function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)"`, `"function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)"`, `"function OTHER_MESSENGER() view returns (address)"`, `"function PORTAL() view returns (address)"`, `"function RELAY_CALL_OVERHEAD() view returns (uint64)"`, `"function RELAY_CONSTANT_OVERHEAD() view returns (uint64)"`, `"function RELAY_GAS_CHECK_BUFFER() view returns (uint64)"`, `"function RELAY_RESERVED_GAS() view returns (uint64)"`, `"function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)"`, `"function failedMessages(bytes32) view returns (bool)"`, `"function initialize(address _superchainConfig, address _portal)"`, `"function messageNonce() view returns (uint256)"`, `"function otherMessenger() view returns (address)"`, `"function paused() view returns (bool)"`, `"function portal() view returns (address)"`, `"function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable"`, `"function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable"`, `"function successfulMessages(bytes32) view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"function xDomainMessageSender() view returns (address)"`, `"event FailedRelayedMessage(bytes32 indexed msgHash)"`, `"event Initialized(uint8 version)"`, `"event RelayedMessage(bytes32 indexed msgHash)"`, `"event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)"`, `"event SentMessageExtension1(address indexed sender, uint256 value)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.L1Erc721Bridge

> **L1Erc721Bridge**: `Omit`\<`Script`\<`"L1ERC721Bridge"`, readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)"`, `"function deposits(address, address, uint256) view returns (bool)"`, `"function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.L1StandardBridge

> **L1StandardBridge**: `Omit`\<`Script`\<`"L1StandardBridge"`, readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"receive() external payable"`, `"function MESSENGER() view returns (address)"`, `"function OTHER_BRIDGE() view returns (address)"`, `"function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)"`, `"function depositETH(uint32 _minGasLimit, bytes _extraData) payable"`, `"function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable"`, `"function deposits(address, address) view returns (uint256)"`, `"function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)"`, `"function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable"`, `"function initialize(address _messenger, address _superchainConfig)"`, `"function l2TokenBridge() view returns (address)"`, `"function messenger() view returns (address)"`, `"function otherBridge() view returns (address)"`, `"function paused() view returns (bool)"`, `"function superchainConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"`, `"event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)"`, `"event Initialized(uint8 version)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.L2OutputOracle

> **L2OutputOracle**: `Omit`\<`Script`\<`"L2OutputOracle"`, readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.OVERHEAD

> **OVERHEAD**: `188n`

### op.OptimismMintableERC20Factory

> **OptimismMintableERC20Factory**: `Omit`\<`Script`\<`"OptimismMintableERC20Factory"`, readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x75505a97BD334E7BD3C476893285569C4136Fa0F"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.OptimismPortal2

> **OptimismPortal2**: `Omit`\<`Script`\<`"OptimismPortal2"`, readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.PUBLIC\_RPC

> **PUBLIC\_RPC**: `"https://mainnet.optimism.io"`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG

> **RESOURCE\_METERING\_RESOURCE\_CONFIG**: `object`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.baseFeeMaxChangeDenominator

> `readonly` **baseFeeMaxChangeDenominator**: `8` = `8`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.elasticityMultiplier

> `readonly` **elasticityMultiplier**: `10` = `10`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maxResourceLimit

> `readonly` **maxResourceLimit**: `20000000` = `20000000`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.maximumBaseFee

> `readonly` **maximumBaseFee**: `340282366920938463463374607431768211455n`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.minimumBaseFee

> `readonly` **minimumBaseFee**: `1000000000` = `1000000000`

### op.RESOURCE\_METERING\_RESOURCE\_CONFIG.systemTxMaxGas

> `readonly` **systemTxMaxGas**: `1000000` = `1000000`

### op.SCALAR

> **SCALAR**: `684000n`

### op.SEQUENCER\_RPC

> **SEQUENCER\_RPC**: `"https://mainnet-sequencer.optimism.io"`

### op.SYSTEM\_CONFIG\_OWNER

> **SYSTEM\_CONFIG\_OWNER**: `"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"`

### op.SuperchainConfig

> **SuperchainConfig**: `Omit`\<`Script`\<`"SuperchainConfig"`, readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x6902690269026902690269026902690269026902"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6902690269026902690269026902690269026902"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6902690269026902690269026902690269026902"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x6902690269026902690269026902690269026902"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.SystemConfig

> **SystemConfig**: `Omit`\<`Script`\<`"SystemConfig"`, readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

#### Type declaration

##### address

> **address**: `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`

The deployed contract address

##### events

> **events**: `EventActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>

Action creators for events. Can be used to create event filters in a typesafe way

###### Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

##### read

> **read**: `ReadActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>

Action creators for contract view and pure functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

##### write

> **write**: `WriteActionCreator`\<readonly [`"constructor()"`, `"function BATCH_INBOX_SLOT() view returns (bytes32)"`, `"function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)"`, `"function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)"`, `"function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)"`, `"function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)"`, `"function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)"`, `"function OPTIMISM_PORTAL_SLOT() view returns (bytes32)"`, `"function START_BLOCK_SLOT() view returns (bytes32)"`, `"function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function batchInbox() view returns (address addr_)"`, `"function batcherHash() view returns (bytes32)"`, `"function gasLimit() view returns (uint64)"`, `"function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)"`, `"function l1CrossDomainMessenger() view returns (address addr_)"`, `"function l1ERC721Bridge() view returns (address addr_)"`, `"function l1StandardBridge() view returns (address addr_)"`, `"function l2OutputOracle() view returns (address addr_)"`, `"function minimumGasLimit() view returns (uint64)"`, `"function optimismMintableERC20Factory() view returns (address addr_)"`, `"function optimismPortal() view returns (address addr_)"`, `"function overhead() view returns (uint256)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))"`, `"function scalar() view returns (uint256)"`, `"function setBatcherHash(bytes32 _batcherHash)"`, `"function setGasConfig(uint256 _overhead, uint256 _scalar)"`, `"function setGasLimit(uint64 _gasLimit)"`, `"function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)"`, `"function setUnsafeBlockSigner(address _unsafeBlockSigner)"`, `"function startBlock() view returns (uint256 startBlock_)"`, `"function transferOwnership(address newOwner)"`, `"function unsafeBlockSigner() view returns (address addr_)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`], \`0x$\{string\}\`, \`0x$\{string\}\`, `"0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"`\>

Action creators for contract payable and nonpayable functions

###### Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### op.UNSAFE\_BLOCK\_SIGNER

> **UNSAFE\_BLOCK\_SIGNER**: `"0xAAAA45d9549EDA09E70937013520214382Ffc4A2"`

### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

### prepareTransactionRequest()

> **prepareTransactionRequest**: \<`TRequest`, `TChainOverride`, `TAccountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "nonce" \| "chainId" \| "type" \| "gas" \| "blobVersionedHashes" \| "fees"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

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

#### Type parameters

• **TRequest** *extends* `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> \| `Omit`\<`object`, `"from"`\> & `object` & `object`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **TAccountOverride** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

#### Parameters

• **args**: `PrepareTransactionRequestParameters`\<`undefined` \| `Chain`, `undefined` \| `Account`, `TChainOverride`, `TAccountOverride`, `TRequest`\>

PrepareTransactionRequestParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<UnionOmit\<(...), (...)\> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever\<(...)\> extends true ? unknown : ExactPartial\<(...)\>\> & Object, ParameterTypeToParameters\<TRequest\["parameters"\] extends readonly PrepareTransactionRequestParameterType\[\] ? any\[any\]\[number\] : "nonce" \| "chainId" \| "type" \| "gas" \| "blobVersionedHashes" \| "fees"\>\> & (unknown extends TRequest\["kzg"\] ? Object : Pick\<TRequest, "kzg"\>))\[K\] \}\>

### readContract()

> **readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/reading-contracts

#### Remarks

A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

#### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { readContract } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.readContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
// 424122n
```

#### Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

• **args**: `ReadContractParameters`\<`abi`, `functionName`, `args`\>

ReadContractParameters

#### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

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

### sendRawTransaction()

> **sendRawTransaction**: (`args`) => `Promise`\<\`0x$\{string\}\`\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

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

#### Parameters

• **args**: `SendRawTransactionParameters`

#### Returns

`Promise`\<\`0x$\{string\}\`\>

### sendUnsignedTransaction()

> **sendUnsignedTransaction**: \<`TChain`\>(`args`) => `Promise`\<\`0x$\{string\}\`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

#### Example

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const hash = await client.sendUnsignedTransaction({
  from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
})
```

#### Type parameters

• **TChain** *extends* `undefined` \| `Chain`

#### Parameters

• **args**: `SendUnsignedTransactionParameters`\<`TChain`\>

– SendUnsignedTransactionParameters

#### Returns

`Promise`\<\`0x$\{string\}\`\>

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

### simulateContract()

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts

#### Remarks

This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.simulateContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32) view returns (uint32)']),
  functionName: 'mint',
  args: ['69420'],
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### Type parameters

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

### tevmCall

> **tevmCall**: `CallHandler`

### tevmContract

> **tevmContract**: `ContractHandler`

### tevmDeploy

> **tevmDeploy**: `DeployHandler`

### tevmDumpState

> **tevmDumpState**: `DumpStateHandler`

### tevmForkUrl?

> `optional` **tevmForkUrl**: `string`

### tevmGetAccount

> **tevmGetAccount**: `GetAccountHandler`

### tevmLoadState

> **tevmLoadState**: `LoadStateHandler`

### tevmMine

> **tevmMine**: `MineHandler`

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### tevmScript

> **tevmScript**: `ScriptHandler`

### tevmSetAccount

> **tevmSetAccount**: `SetAccountHandler`

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

Destroys a Filter that was created from one of the following Actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

- Docs: https://viem.sh/docs/actions/public/uninstallFilter
- JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

#### Parameters

• **args**: `UninstallFilterParameters`

UninstallFilterParameters

#### Returns

`Promise`\<`boolean`\>

### verifyMessage()

> **verifyMessage**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**: `VerifyMessageParameters`

#### Returns

`Promise`\<`boolean`\>

### verifyTypedData()

> **verifyTypedData**: (`args`) => `Promise`\<`boolean`\>

#### Parameters

• **args**: `VerifyTypedDataParameters`

#### Returns

`Promise`\<`boolean`\>

### waitForTransactionReceipt()

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

#### Remarks

The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).

Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.

There are 3 types of Transaction Replacement reasons:

- `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
- `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
- `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.waitForTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

#### Parameters

• **args**: `WaitForTransactionReceiptParameters`\<`undefined` \| `Chain`\>

WaitForTransactionReceiptParameters

#### Returns

`Promise`\<`TransactionReceipt`\>

### watchBlockNumber()

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlockNumber({
  onBlockNumber: (blockNumber) => console.log(blockNumber),
})
```

#### Parameters

• **args**: `WatchBlockNumberParameters`

WatchBlockNumberParameters

#### Returns

`WatchBlockNumberReturnType`

### watchBlocks()

> **watchBlocks**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlocks({
  onBlock: (block) => console.log(block),
})
```

#### Type parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

• **TBlockTag** *extends* `BlockTag` = `"latest"`

#### Parameters

• **args**: `WatchBlocksParameters`\<`Transport`, `undefined` \| `Chain`, `TIncludeTransactions`, `TBlockTag`\>

WatchBlocksParameters

#### Returns

`WatchBlocksReturnType`

### watchContractEvent()

> **watchContractEvent**: \<`TAbi`, `TEventName`, `TStrict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

#### Remarks

This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).

`watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

#### Example

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchContractEvent({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
  eventName: 'Transfer',
  args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
  onLogs: (logs) => console.log(logs),
})
```

#### Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `string`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchContractEventParameters`\<`TAbi`, `TEventName`, `TStrict`, `Transport`\>

WatchContractEventParameters

#### Returns

`WatchContractEventReturnType`

### watchEvent()

> **watchEvent**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

#### Remarks

This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).

`watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchEvent({
  onLogs: (logs) => console.log(logs),
})
```

#### Type parameters

• **TAbiEvent** *extends* `undefined` \| `AbiEvent` = `undefined`

• **TAbiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly `AbiEvent`[] = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`\<`TAbiEvent`\>] : `undefined`

• **TStrict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

• **args**: `WatchEventParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `Transport`\>

WatchEventParameters

#### Returns

`WatchEventReturnType`

### watchPendingTransactions()

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

#### Remarks

This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchPendingTransactions({
  onTransactions: (hashes) => console.log(hashes),
})
```

#### Parameters

• **args**: `WatchPendingTransactionsParameters`\<`Transport`\>

WatchPendingTransactionsParameters

#### Returns

`WatchPendingTransactionsReturnType`

## Source

[extensions/opstack/src/createL1Client.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/createL1Client.ts#L22)
