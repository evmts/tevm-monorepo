[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createMemoryClient

# Function: createMemoryClient()

> **createMemoryClient**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?): `object`

Defined in: packages/memory-client/types/createMemoryClient.d.ts:184

Creates a [MemoryClient](../type-aliases/MemoryClient.md) which is a viem client with an in-memory Ethereum client as its transport.
It comes batteries included with all wallet, test, public, and tevm actions.

## Type Parameters

• **TCommon** *extends* `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\> = `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\>

• **TAccountOrAddress** *extends* `undefined` \| `` `0x${string}` `` \| [`Account`](../type-aliases/Account.md) = `undefined`

• **TRpcSchema** *extends* `undefined` \| `RpcSchema` = \[\{ `Method`: `"web3_clientVersion"`; `Parameters`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\]

## Parameters

### options?

[`MemoryClientOptions`](../type-aliases/MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

`object`

### account

> **account**: `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`

The Account of the Client.

### addChain()

> **addChain**: (`args`) => `Promise`\<`void`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/addChain
- JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)

#### Parameters

##### args

`AddChainParameters`

AddChainParameters

#### Returns

`Promise`\<`void`\>

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { optimism } from 'viem/chains'

const client = createWalletClient({
  transport: custom(window.ethereum),
})
await client.addChain({ chain: optimism })
```

### batch?

> `optional` **batch**: `object`

Flags for batch settings.

#### batch.multicall?

> `optional` **multicall**: `boolean` \| \{ `batchSize`: `number`; `wait`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

##### Type declaration

`boolean`

\{ `batchSize`: `number`; `wait`: `number`; \}

### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

### call()

> **call**: (`parameters`) => `Promise`\<`CallReturnType`\>

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

#### Parameters

##### parameters

`CallParameters`\<`TCommon`\>

#### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

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

### ccipRead?

> `optional` **ccipRead**: `false` \| \{ `request`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

#### Type declaration

`false`

\{ `request`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

### chain

> **chain**: `TCommon`

Chain for the client.

### createAccessList()

> **createAccessList**: (`parameters`) => `Promise`\<\{ `accessList`: `AccessList`; `gasUsed`: `bigint`; \}\>

Creates an EIP-2930 access list that you can include in a transaction.

- Docs: https://viem.sh/docs/actions/public/createAccessList
- JSON-RPC Methods: `eth_createAccessList`

#### Parameters

##### parameters

`CreateAccessListParameters`\<`TCommon`\>

#### Returns

`Promise`\<\{ `accessList`: `AccessList`; `gasUsed`: `bigint`; \}\>

The call data. CreateAccessListReturnType

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const data = await client.createAccessList({
  data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
})
```

### createBlockFilter()

> **createBlockFilter**: () => `Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"block"`; \}\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

#### Returns

`Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"block"`; \}\>

Filter. CreateBlockFilterReturnType

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

### createContractEventFilter()

> **createContractEventFilter**: \<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **args** *extends* `undefined` \| readonly `unknown`[] \| `Record`\<`string`, `unknown`\>

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

#### Parameters

##### args

`CreateContractEventFilterParameters`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>

CreateContractEventFilterParameters

#### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

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

### createEventFilter()

> **createEventFilter**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: EthjsFilter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

#### Type Parameters

• **abiEvent** *extends* `undefined` \| [`AbiEvent`](../type-aliases/AbiEvent.md) = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly [`AbiEvent`](../type-aliases/AbiEvent.md)[] = `abiEvent` *extends* [`AbiEvent`](../type-aliases/AbiEvent.md) ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **_EventName** *extends* `undefined` \| `string` = `MaybeAbiEventName`\<`abiEvent`\>

• **_Args** *extends* `undefined` \| readonly `unknown`[] \| `Record`\<`string`, `unknown`\> = `undefined`

#### Parameters

##### args?

[`CreateEventFilterParameters`](../type-aliases/CreateEventFilterParameters.md)\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>

[CreateEventFilterParameters](../type-aliases/CreateEventFilterParameters.md)

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: EthjsFilter\<"event", abiEvents, \_EventName, \_Args, strict, fromBlock, toBlock\>\[K\] \}\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateEventFilterReturnType

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

### createPendingTransactionFilter()

> **createPendingTransactionFilter**: () => `Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"transaction"`; \}\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

#### Returns

`Promise`\<\{ `id`: `` `0x${string}` ``; `request`: `EIP1193RequestFn`\<readonly \[\{ `Method`: `"eth_getFilterChanges"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `` `0x${string}` ``[] \| `RpcLog`[]; \}, \{ `Method`: `"eth_getFilterLogs"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcLog`[]; \}, \{ `Method`: `"eth_uninstallFilter"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `boolean`; \}\]\>; `type`: `"transaction"`; \}\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateBlockFilterReturnType

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

### deployContract()

> **deployContract**: \<`abi`, `chainOverride`\>(`args`) => `Promise`\<`` `0x${string}` ``\>

Deploys a contract to the network, given bytecode and constructor arguments.

- Docs: https://viem.sh/docs/contract/deployContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **chainOverride** *extends* `undefined` \| `Chain`

#### Parameters

##### args

`DeployContractParameters`\<`abi`, `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`\>

DeployContractParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. DeployContractReturnType

#### Example

```ts
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  account: privateKeyToAccount('0x…'),
  chain: mainnet,
  transport: http(),
})
const hash = await client.deployContract({
  abi: [],
  account: '0x…,
  bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
})
```

### dropTransaction()

> **dropTransaction**: (`args`) => `Promise`\<`void`\>

Removes a transaction from the mempool.

- Docs: https://viem.sh/docs/actions/test/dropTransaction

#### Parameters

##### args

`DropTransactionParameters`

DropTransactionParameters

#### Returns

`Promise`\<`void`\>

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

### dumpState()

> **dumpState**: () => `Promise`\<`` `0x${string}` ``\>

Serializes the current state (including contracts code, contract's storage,
accounts properties, etc.) into a savable data blob.

- Docs: https://viem.sh/docs/actions/test/dumpState

#### Returns

`Promise`\<`` `0x${string}` ``\>

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

### estimateContractGas()

> **estimateContractGas**: \<`chain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

#### Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

##### args

`EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `chain`\>

EstimateContractGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateContractGasReturnType

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

### estimateFeesPerGas()

> **estimateFeesPerGas**: \<`chainOverride`, `type`\>(`args`?) => `Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

• **type** *extends* `FeeValuesType` = `"eip1559"`

#### Parameters

##### args?

`EstimateFeesPerGasParameters`\<`TCommon`, `chainOverride`, `type`\>

#### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

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

### estimateGas()

> **estimateGas**: (`args`) => `Promise`\<`bigint`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

#### Parameters

##### args

`EstimateGasParameters`\<`TCommon`\>

EstimateGasParameters

#### Returns

`Promise`\<`bigint`\>

The gas estimate (in wei). EstimateGasReturnType

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

### estimateMaxPriorityFeePerGas()

> **estimateMaxPriorityFeePerGas**: \<`chainOverride`\>(`args`?) => `Promise`\<`bigint`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

##### args?

`GetChainParameter`\<`TCommon`, `chainOverride`\>

#### Returns

`Promise`\<`bigint`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

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

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, \[\{ `Method`: `"web3_clientVersion"`; `Parameters`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\], \{ \[K in string \| number \| symbol\]: client\[K\] \} & [`TevmActions`](../type-aliases/TevmActions.md) & `PublicActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\> & `WalletActions`\<`TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\> & `TestActions`\>

#### Type Parameters

• **client** *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\>\>

#### Parameters

##### fn

(`client`) => `client`

#### Returns

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, \[\{ `Method`: `"web3_clientVersion"`; `Parameters`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\], \{ \[K in string \| number \| symbol\]: client\[K\] \} & [`TevmActions`](../type-aliases/TevmActions.md) & `PublicActions`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\> & `WalletActions`\<`TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\> & `TestActions`\>

### getAddresses()

> **getAddresses**: () => `Promise`\<`GetAddressesReturnType`\>

Returns a list of account addresses owned by the wallet or client.

- Docs: https://viem.sh/docs/actions/wallet/getAddresses
- JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)

#### Returns

`Promise`\<`GetAddressesReturnType`\>

List of account addresses owned by the wallet or client. GetAddressesReturnType

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.getAddresses()
```

### getAutomine()

> **getAutomine**: () => `Promise`\<`boolean`\>

Returns the automatic mining status of the node.

- Docs: https://viem.sh/docs/actions/test/getAutomine

#### Returns

`Promise`\<`boolean`\>

Whether or not the node is auto mining. GetAutomineReturnType

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

### getBalance()

> **getBalance**: (`args`) => `Promise`\<`bigint`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

#### Parameters

##### args

`GetBalanceParameters`

GetBalanceParameters

#### Returns

`Promise`\<`bigint`\>

The balance of the address in wei. GetBalanceReturnType

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

### getBlobBaseFee()

> **getBlobBaseFee**: () => `Promise`\<`bigint`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

#### Returns

`Promise`\<`bigint`\>

The blob base fee (in wei). GetBlobBaseFeeReturnType

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

### getBlock()

> **getBlock**: \<`includeTransactions`, `blockTag`\>(`args`?) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, includeTransactions, blockTag\>\[K\] \}\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

#### Type Parameters

• **includeTransactions** *extends* `boolean` = `false`

• **blockTag** *extends* [`BlockTag`](../type-aliases/BlockTag.md) = `"latest"`

#### Parameters

##### args?

`GetBlockParameters`\<`includeTransactions`, `blockTag`\>

GetBlockParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedBlock\<TCommon, includeTransactions, blockTag\>\[K\] \}\>

Information about the block. GetBlockReturnType

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

### getBlockNumber()

> **getBlockNumber**: (`args`?) => `Promise`\<`bigint`\>

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

#### Parameters

##### args?

`GetBlockNumberParameters`

GetBlockNumberParameters

#### Returns

`Promise`\<`bigint`\>

The number of the block. GetBlockNumberReturnType

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

### getBlockTransactionCount()

> **getBlockTransactionCount**: (`args`?) => `Promise`\<`number`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

#### Parameters

##### args?

`GetBlockTransactionCountParameters`

GetBlockTransactionCountParameters

#### Returns

`Promise`\<`number`\>

The block transaction count. GetBlockTransactionCountReturnType

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

### ~~getBytecode()~~

> **getBytecode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

#### Parameters

##### args

`GetCodeParameters`

#### Returns

`Promise`\<`GetCodeReturnType`\>

#### Deprecated

Use `getCode` instead.

### getChainId

> **getChainId**: () => `Promise`\<`number`\> & () => `Promise`\<`number`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

#### Returns

The current chain ID. GetChainIdReturnType

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

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getCode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

#### Parameters

##### args

`GetCodeParameters`

GetBytecodeParameters

#### Returns

`Promise`\<`GetCodeReturnType`\>

The contract's bytecode. GetBytecodeReturnType

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getCode({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
})
```

### getContractEvents()

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string` = `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

#### Parameters

##### args

`GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

#### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetContractEventsReturnType

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

### getEip712Domain()

> **getEip712Domain**: (`args`) => `Promise`\<`GetEip712DomainReturnType`\>

Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.

#### Parameters

##### args

`GetEip712DomainParameters`

#### Returns

`Promise`\<`GetEip712DomainReturnType`\>

The EIP-712 domain, fields, and extensions. GetEip712DomainReturnType

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const domain = await client.getEip712Domain({
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
})
// {
//   domain: {
//     name: 'ExampleContract',
//     version: '1',
//     chainId: 1,
//     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//   },
//   fields: '0x0f',
//   extensions: [],
// }
```

### getEnsAddress()

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Parameters

##### args

GetEnsAddressParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### coinType?

`number`

ENSIP-9 compliant coinType used to resolve addresses for other chains

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### name

`string`

Name to get the address for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsAddressReturnType`\>

Address for ENS name or `null` if not found. GetEnsAddressReturnType

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

### getEnsAvatar()

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Parameters

##### args

GetEnsAvatarParameters

###### assetGatewayUrls?

`AssetGatewayUrls`

Gateway urls to resolve IPFS and/or Arweave assets.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### name

`string`

ENS name to get Text for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsAvatarReturnType`\>

Avatar URI or `null` if not found. GetEnsAvatarReturnType

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

### getEnsName()

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Parameters

##### args

GetEnsNameParameters

###### address

`` `0x${string}` ``

Address to get ENS name for.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsNameReturnType`\>

Name or `null` if not found. GetEnsNameReturnType

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

### getEnsResolver()

> **getEnsResolver**: (`args`) => `Promise`\<`` `0x${string}` ``\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Parameters

##### args

GetEnsResolverParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### name

`string`

Name to get the address for.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`` `0x${string}` ``\>

Address for ENS resolver. GetEnsResolverReturnType

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

### getEnsText()

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

#### Parameters

##### args

GetEnsTextParameters

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### gatewayUrls?

`string`[]

Universal Resolver gateway URLs to use for resolving CCIP-read requests.

###### key

`string`

Text record to retrieve.

###### name

`string`

ENS name to get Text for.

###### strict?

`boolean`

Whether or not to throw errors propagated from the ENS Universal Resolver Contract.

###### universalResolverAddress?

`` `0x${string}` ``

Address of ENS Universal Resolver Contract.

#### Returns

`Promise`\<`GetEnsTextReturnType`\>

Address for ENS resolver. GetEnsTextReturnType

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
// 'wevm_dev'
```

### getFeeHistory()

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

#### Parameters

##### args

`GetFeeHistoryParameters`

GetFeeHistoryParameters

#### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

The gas estimate (in wei). GetFeeHistoryReturnType

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

### getFilterChanges()

> **getFilterChanges**: \<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

#### Type Parameters

• **filterType** *extends* `FilterType`

• **abi** *extends* `undefined` \| [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

#### Parameters

##### args

`GetFilterChangesParameters`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterChangesParameters

#### Returns

`Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

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

### getFilterLogs()

> **getFilterLogs**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

#### Type Parameters

• **abi** *extends* `undefined` \| [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

#### Parameters

##### args

`GetFilterLogsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>

GetFilterLogsParameters

#### Returns

`Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetFilterLogsReturnType

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

### getGasPrice()

> **getGasPrice**: () => `Promise`\<`bigint`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

#### Returns

`Promise`\<`bigint`\>

The gas price (in wei). GetGasPriceReturnType

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

### getLogs()

> **getLogs**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>(`args`?) => `Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

#### Type Parameters

• **abiEvent** *extends* `undefined` \| [`AbiEvent`](../type-aliases/AbiEvent.md) = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly [`AbiEvent`](../type-aliases/AbiEvent.md)[] = `abiEvent` *extends* [`AbiEvent`](../type-aliases/AbiEvent.md) ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

• **fromBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

• **toBlock** *extends* `undefined` \| `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md) = `undefined`

#### Parameters

##### args?

`GetLogsParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>

GetLogsParameters

#### Returns

`Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetLogsReturnType

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

### getPermissions()

> **getPermissions**: () => `Promise`\<`GetPermissionsReturnType`\>

Gets the wallets current permissions.

- Docs: https://viem.sh/docs/actions/wallet/getPermissions
- JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

#### Returns

`Promise`\<`GetPermissionsReturnType`\>

The wallet permissions. GetPermissionsReturnType

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const permissions = await client.getPermissions()
```

### getProof()

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

#### Parameters

##### args

`GetProofParameters`

#### Returns

`Promise`\<`GetProofReturnType`\>

Proof data. GetProofReturnType

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

### getStorageAt()

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

#### Parameters

##### args

`GetStorageAtParameters`

GetStorageAtParameters

#### Returns

`Promise`\<`GetStorageAtReturnType`\>

The value of the storage slot. GetStorageAtReturnType

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

### getTransaction()

> **getTransaction**: \<`blockTag`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, blockTag\>\[K\] \}\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

#### Type Parameters

• **blockTag** *extends* [`BlockTag`](../type-aliases/BlockTag.md) = `"latest"`

#### Parameters

##### args

`GetTransactionParameters`\<`blockTag`\>

GetTransactionParameters

#### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: FormattedTransaction\<TCommon, blockTag\>\[K\] \}\>

The transaction information. GetTransactionReturnType

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

### getTransactionConfirmations()

> **getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

#### Parameters

##### args

`GetTransactionConfirmationsParameters`\<`TCommon`\>

GetTransactionConfirmationsParameters

#### Returns

`Promise`\<`bigint`\>

The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. GetTransactionConfirmationsReturnType

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

### getTransactionCount()

> **getTransactionCount**: (`args`) => `Promise`\<`number`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

#### Parameters

##### args

`GetTransactionCountParameters`

GetTransactionCountParameters

#### Returns

`Promise`\<`number`\>

The number of transactions an account has sent. GetTransactionCountReturnType

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

### getTransactionReceipt()

> **getTransactionReceipt**: (`args`) => `Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

#### Parameters

##### args

`GetTransactionReceiptParameters`

GetTransactionReceiptParameters

#### Returns

`Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

The transaction receipt. GetTransactionReceiptReturnType

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

### getTxpoolContent()

> **getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

#### Returns

`Promise`\<`GetTxpoolContentReturnType`\>

Transaction pool content. GetTxpoolContentReturnType

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

### getTxpoolStatus()

> **getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolStatus

#### Returns

`Promise`\<`GetTxpoolStatusReturnType`\>

Transaction pool status. GetTxpoolStatusReturnType

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

### impersonateAccount()

> **impersonateAccount**: (`args`) => `Promise`\<`void`\>

Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.

- Docs: https://viem.sh/docs/actions/test/impersonateAccount

#### Parameters

##### args

`ImpersonateAccountParameters`

ImpersonateAccountParameters

#### Returns

`Promise`\<`void`\>

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

### increaseTime()

> **increaseTime**: (`args`) => `Promise`\<`` `0x${string}` ``\>

Jump forward in time by the given amount of time, in seconds.

- Docs: https://viem.sh/docs/actions/test/increaseTime

#### Parameters

##### args

`IncreaseTimeParameters`

– IncreaseTimeParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

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

### inspectTxpool()

> **inspectTxpool**: () => `Promise`\<`InspectTxpoolReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/inspectTxpool

#### Returns

`Promise`\<`InspectTxpoolReturnType`\>

Transaction pool inspection data. InspectTxpoolReturnType

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

### key

> **key**: `string`

A key for the client.

### loadState()

> **loadState**: (`args`) => `Promise`\<`void`\>

Adds state previously dumped with `dumpState` to the current chain.

- Docs: https://viem.sh/docs/actions/test/loadState

#### Parameters

##### args

`LoadStateParameters`

#### Returns

`Promise`\<`void`\>

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

### mine()

> **mine**: (`args`) => `Promise`\<`void`\>

Mine a specified number of blocks.

- Docs: https://viem.sh/docs/actions/test/mine

#### Parameters

##### args

`MineParameters`

– MineParameters

#### Returns

`Promise`\<`void`\>

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

### multicall()

> **multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

#### Type Parameters

• **contracts** *extends* readonly `unknown`[]

• **allowFailure** *extends* `boolean` = `true`

#### Parameters

##### args

`MulticallParameters`\<`contracts`, `allowFailure`\>

MulticallParameters

#### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

An array of results with accompanying status. MulticallReturnType

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

### name

> **name**: `string`

A name for the client.

### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

### prepareTransactionRequest

> **prepareTransactionRequest**: \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<(...) & (...) & (...), (...) extends (...) ? (...) : (...)\> & \{ chainId?: (...) \| (...) \}, ParameterTypeToParameters\<(...)\[(...)\] extends readonly (...)\[\] ? (...)\[(...)\] : (...) \| (...) \| (...) \| (...) \| (...) \| (...)\>\> & (unknown extends request\["kzg"\] ? \{\} : Pick\<request, "kzg"\>))\[K\] \}\> & \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionRequiredBy\<Extract\<(...) & (...) & (...), (...) extends (...) ? (...) : (...)\> & \{ chainId?: (...) \| (...) \}, ParameterTypeToParameters\<(...)\[(...)\] extends readonly (...)\[\] ? (...)\[(...)\] : (...) \| (...) \| (...) \| (...) \| (...) \| (...)\>\> & (unknown extends request\["kzg"\] ? \{\} : Pick\<request, "kzg"\>))\[K\] \}\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

#### Param

PrepareTransactionRequestParameters

#### Returns

The transaction request. PrepareTransactionRequestReturnType

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

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

#### Parameters

##### args

`ReadContractParameters`\<`abi`, `functionName`, `args`\>

ReadContractParameters

#### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

The response from the contract. Type is inferred. ReadContractReturnType

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

### removeBlockTimestampInterval()

> **removeBlockTimestampInterval**: () => `Promise`\<`void`\>

Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.

- Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval

#### Returns

`Promise`\<`void`\>

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

### request

> **request**: `EIP1193RequestFn`\<\[\{ `Method`: `"web3_clientVersion"`; `Parameters`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\]\>

Request function wrapped with friendly error handling

### requestAddresses()

> **requestAddresses**: () => `Promise`\<`RequestAddressesReturnType`\>

Requests a list of accounts managed by a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestAddresses
- JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)

Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).

This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.

#### Returns

`Promise`\<`RequestAddressesReturnType`\>

List of accounts managed by a wallet RequestAddressesReturnType

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.requestAddresses()
```

### requestPermissions()

> **requestPermissions**: (`args`) => `Promise`\<`RequestPermissionsReturnType`\>

Requests permissions for a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestPermissions
- JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

#### Parameters

##### args

RequestPermissionsParameters

###### eth_accounts

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`RequestPermissionsReturnType`\>

The wallet permissions. RequestPermissionsReturnType

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const permissions = await client.requestPermissions({
  eth_accounts: {}
})
```

### reset()

> **reset**: (`args`?) => `Promise`\<`void`\>

Resets fork back to its original state.

- Docs: https://viem.sh/docs/actions/test/reset

#### Parameters

##### args?

`ResetParameters`

– ResetParameters

#### Returns

`Promise`\<`void`\>

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

### revert()

> **revert**: (`args`) => `Promise`\<`void`\>

Revert the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/revert

#### Parameters

##### args

`RevertParameters`

– RevertParameters

#### Returns

`Promise`\<`void`\>

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

### sendRawTransaction

> **sendRawTransaction**: (`args`) => `Promise`\<`` `0x${string}` ``\> & (`args`) => `Promise`\<`` `0x${string}` ``\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

#### Param

Client to use

#### Param

SendRawTransactionParameters

#### Returns

The transaction hash. SendRawTransactionReturnType

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

> **sendTransaction**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<`` `0x${string}` ``\>

Creates, signs, and sends a new transaction to the network.

- Docs: https://viem.sh/docs/actions/wallet/sendTransaction
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
  - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)

#### Type Parameters

• **request** *extends* `Omit`\<\{ `accessList`: `undefined`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `undefined`; `maxPriorityFeePerGas`: `undefined`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"legacy"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `undefined`; `maxPriorityFeePerGas`: `undefined`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip2930"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip1559"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `Kzg`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip4844"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `AuthorizationList`\<`number`, `boolean`\>; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip7702"`; `value`: `bigint`; \}, `"from"`\> & `object`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

##### args

`SendTransactionParameters`\<`TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`, `request`\>

SendTransactionParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. SendTransactionReturnType

#### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const hash = await client.sendTransaction({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
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
  transport: http(),
})
const hash = await client.sendTransaction({
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
})
```

### sendUnsignedTransaction()

> **sendUnsignedTransaction**: \<`chain`\>(`args`) => `Promise`\<`` `0x${string}` ``\>

Executes a transaction regardless of the signature.

- Docs: https://viem.sh/docs/actions/test/sendUnsignedTransaction

#### Type Parameters

• **chain** *extends* `undefined` \| `Chain`

#### Parameters

##### args

`SendUnsignedTransactionParameters`\<`chain`\>

– SendUnsignedTransactionParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash. SendUnsignedTransactionReturnType

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

### setAutomine()

> **setAutomine**: (`args`) => `Promise`\<`void`\>

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

- Docs: https://viem.sh/docs/actions/test/setAutomine

#### Parameters

##### args

`boolean`

#### Returns

`Promise`\<`void`\>

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

### setBalance()

> **setBalance**: (`args`) => `Promise`\<`void`\>

Modifies the balance of an account.

- Docs: https://viem.sh/docs/actions/test/setBalance

#### Parameters

##### args

`SetBalanceParameters`

– SetBalanceParameters

#### Returns

`Promise`\<`void`\>

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

### setBlockGasLimit()

> **setBlockGasLimit**: (`args`) => `Promise`\<`void`\>

Sets the block's gas limit.

- Docs: https://viem.sh/docs/actions/test/setBlockGasLimit

#### Parameters

##### args

`SetBlockGasLimitParameters`

– SetBlockGasLimitParameters

#### Returns

`Promise`\<`void`\>

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

### setBlockTimestampInterval()

> **setBlockTimestampInterval**: (`args`) => `Promise`\<`void`\>

Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

- Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval

#### Parameters

##### args

`SetBlockTimestampIntervalParameters`

– SetBlockTimestampIntervalParameters

#### Returns

`Promise`\<`void`\>

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

### setCode()

> **setCode**: (`args`) => `Promise`\<`void`\>

Modifies the bytecode stored at an account's address.

- Docs: https://viem.sh/docs/actions/test/setCode

#### Parameters

##### args

`SetCodeParameters`

– SetCodeParameters

#### Returns

`Promise`\<`void`\>

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

### setCoinbase()

> **setCoinbase**: (`args`) => `Promise`\<`void`\>

Sets the coinbase address to be used in new blocks.

- Docs: https://viem.sh/docs/actions/test/setCoinbase

#### Parameters

##### args

`SetCoinbaseParameters`

– SetCoinbaseParameters

#### Returns

`Promise`\<`void`\>

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

### setIntervalMining()

> **setIntervalMining**: (`args`) => `Promise`\<`void`\>

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.

- Docs: https://viem.sh/docs/actions/test/setIntervalMining

#### Parameters

##### args

`SetIntervalMiningParameters`

– SetIntervalMiningParameters

#### Returns

`Promise`\<`void`\>

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

### setLoggingEnabled()

> **setLoggingEnabled**: (`args`) => `Promise`\<`void`\>

Enable or disable logging on the test node network.

- Docs: https://viem.sh/docs/actions/test/setLoggingEnabled

#### Parameters

##### args

`boolean`

#### Returns

`Promise`\<`void`\>

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

### setMinGasPrice()

> **setMinGasPrice**: (`args`) => `Promise`\<`void`\>

Change the minimum gas price accepted by the network (in wei).

- Docs: https://viem.sh/docs/actions/test/setMinGasPrice

Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.

#### Parameters

##### args

`SetMinGasPriceParameters`

– SetBlockGasLimitParameters

#### Returns

`Promise`\<`void`\>

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

### setNextBlockBaseFeePerGas()

> **setNextBlockBaseFeePerGas**: (`args`) => `Promise`\<`void`\>

Sets the next block's base fee per gas.

- Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas

#### Parameters

##### args

`SetNextBlockBaseFeePerGasParameters`

– SetNextBlockBaseFeePerGasParameters

#### Returns

`Promise`\<`void`\>

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

### setNextBlockTimestamp()

> **setNextBlockTimestamp**: (`args`) => `Promise`\<`void`\>

Sets the next block's timestamp.

- Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp

#### Parameters

##### args

`SetNextBlockTimestampParameters`

– SetNextBlockTimestampParameters

#### Returns

`Promise`\<`void`\>

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

### setNonce()

> **setNonce**: (`args`) => `Promise`\<`void`\>

Modifies (overrides) the nonce of an account.

- Docs: https://viem.sh/docs/actions/test/setNonce

#### Parameters

##### args

`SetNonceParameters`

– SetNonceParameters

#### Returns

`Promise`\<`void`\>

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

### setRpcUrl()

> **setRpcUrl**: (`args`) => `Promise`\<`void`\>

Sets the backend RPC URL.

- Docs: https://viem.sh/docs/actions/test/setRpcUrl

#### Parameters

##### args

`string`

#### Returns

`Promise`\<`void`\>

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

### setStorageAt()

> **setStorageAt**: (`args`) => `Promise`\<`void`\>

Writes to a slot of an account's storage.

- Docs: https://viem.sh/docs/actions/test/setStorageAt

#### Parameters

##### args

`SetStorageAtParameters`

– SetStorageAtParameters

#### Returns

`Promise`\<`void`\>

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

### signMessage()

> **signMessage**: (`args`) => `Promise`\<`` `0x${string}` ``\>

Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signMessage
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
  - Local Accounts: Signs locally. No JSON-RPC request.

With the calculated signature, you can:
- use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
- use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.

#### Parameters

##### args

`SignMessageParameters`\<`TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\>

SignMessageParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

The signed message. SignMessageReturnType

#### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const signature = await client.signMessage({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  message: 'hello world',
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
  transport: http(),
})
const signature = await client.signMessage({
  message: 'hello world',
})
```

### signTransaction()

> **signTransaction**: \<`chainOverride`, `request`\>(`args`) => `Promise`\<`TransactionSerialized`\<`GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\>, `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>\>

Signs a transaction.

- Docs: https://viem.sh/docs/actions/wallet/signTransaction
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
  - Local Accounts: Signs locally. No JSON-RPC request.

#### Type Parameters

• **chainOverride** *extends* `undefined` \| `Chain`

• **request** *extends* `Omit`\<\{ `accessList`: `undefined`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `undefined`; `maxPriorityFeePerGas`: `undefined`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"legacy"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `undefined`; `maxPriorityFeePerGas`: `undefined`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip2930"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip1559"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `Kzg`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip4844"`; `value`: `bigint`; \}, `"from"`\> \| `Omit`\<\{ `accessList`: `AccessList`; `authorizationList`: `AuthorizationList`\<`number`, `boolean`\>; `blobs`: `undefined`; `blobVersionedHashes`: `undefined`; `data`: `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `undefined`; `kzg`: `undefined`; `maxFeePerBlobGas`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `sidecars`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `type`: `"eip7702"`; `value`: `bigint`; \}, `"from"`\> = `UnionOmit`\<`ExtractChainFormatterParameters`\<`DeriveChain`\<`TCommon`, `chainOverride`\>, `"transactionRequest"`, `TransactionRequest`\>, `"from"`\>

#### Parameters

##### args

`SignTransactionParameters`\<`TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`, `request`\>

SignTransactionParameters

#### Returns

`Promise`\<`TransactionSerialized`\<`GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\>, `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `GetTransactionType`\<`request`, `request` *extends* `LegacyProperties` ? `"legacy"` : `never` \| `request` *extends* `EIP1559Properties` ? `"eip1559"` : `never` \| `request` *extends* `EIP2930Properties` ? `"eip2930"` : `never` \| `request` *extends* `EIP4844Properties` ? `"eip4844"` : `never` \| `request` *extends* `EIP7702Properties` ? `"eip7702"` : `never` \| `request`\[`"type"`\] *extends* `undefined` \| `string` ? `Extract`\<`any`\[`any`\], `string`\> : `never`\> *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>\>

The signed message. SignTransactionReturnType

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
const signature = await client.signTransaction(request)
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
const signature = await client.signTransaction(request)
```

### signTypedData()

> **signTypedData**: \<`typedData`, `primaryType`\>(`args`) => `Promise`\<`` `0x${string}` ``\>

Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signTypedData
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
  - Local Accounts: Signs locally. No JSON-RPC request.

#### Type Parameters

• **typedData** *extends* \{ `[key: `uint256[${string}]`]`: `undefined`;  `[key: `uint248[${string}]`]`: `undefined`;  `[key: `uint240[${string}]`]`: `undefined`;  `[key: `uint232[${string}]`]`: `undefined`;  `[key: `uint224[${string}]`]`: `undefined`;  `[key: `uint216[${string}]`]`: `undefined`;  `[key: `uint208[${string}]`]`: `undefined`;  `[key: `uint200[${string}]`]`: `undefined`;  `[key: `uint192[${string}]`]`: `undefined`;  `[key: `uint184[${string}]`]`: `undefined`;  `[key: `uint176[${string}]`]`: `undefined`;  `[key: `uint168[${string}]`]`: `undefined`;  `[key: `uint160[${string}]`]`: `undefined`;  `[key: `uint152[${string}]`]`: `undefined`;  `[key: `uint144[${string}]`]`: `undefined`;  `[key: `uint136[${string}]`]`: `undefined`;  `[key: `uint128[${string}]`]`: `undefined`;  `[key: `uint120[${string}]`]`: `undefined`;  `[key: `uint112[${string}]`]`: `undefined`;  `[key: `uint104[${string}]`]`: `undefined`;  `[key: `uint96[${string}]`]`: `undefined`;  `[key: `uint88[${string}]`]`: `undefined`;  `[key: `uint80[${string}]`]`: `undefined`;  `[key: `uint72[${string}]`]`: `undefined`;  `[key: `uint64[${string}]`]`: `undefined`;  `[key: `uint56[${string}]`]`: `undefined`;  `[key: `uint48[${string}]`]`: `undefined`;  `[key: `uint40[${string}]`]`: `undefined`;  `[key: `uint32[${string}]`]`: `undefined`;  `[key: `uint24[${string}]`]`: `undefined`;  `[key: `uint16[${string}]`]`: `undefined`;  `[key: `uint8[${string}]`]`: `undefined`;  `[key: `uint[${string}]`]`: `undefined`;  `[key: `int256[${string}]`]`: `undefined`;  `[key: `int248[${string}]`]`: `undefined`;  `[key: `int240[${string}]`]`: `undefined`;  `[key: `int232[${string}]`]`: `undefined`;  `[key: `int224[${string}]`]`: `undefined`;  `[key: `int216[${string}]`]`: `undefined`;  `[key: `int208[${string}]`]`: `undefined`;  `[key: `int200[${string}]`]`: `undefined`;  `[key: `int192[${string}]`]`: `undefined`;  `[key: `int184[${string}]`]`: `undefined`;  `[key: `int176[${string}]`]`: `undefined`;  `[key: `int168[${string}]`]`: `undefined`;  `[key: `int160[${string}]`]`: `undefined`;  `[key: `int152[${string}]`]`: `undefined`;  `[key: `int144[${string}]`]`: `undefined`;  `[key: `int136[${string}]`]`: `undefined`;  `[key: `int128[${string}]`]`: `undefined`;  `[key: `int120[${string}]`]`: `undefined`;  `[key: `int112[${string}]`]`: `undefined`;  `[key: `int104[${string}]`]`: `undefined`;  `[key: `int96[${string}]`]`: `undefined`;  `[key: `int88[${string}]`]`: `undefined`;  `[key: `int80[${string}]`]`: `undefined`;  `[key: `int72[${string}]`]`: `undefined`;  `[key: `int64[${string}]`]`: `undefined`;  `[key: `int56[${string}]`]`: `undefined`;  `[key: `int48[${string}]`]`: `undefined`;  `[key: `int40[${string}]`]`: `undefined`;  `[key: `int32[${string}]`]`: `undefined`;  `[key: `int24[${string}]`]`: `undefined`;  `[key: `int16[${string}]`]`: `undefined`;  `[key: `int8[${string}]`]`: `undefined`;  `[key: `int[${string}]`]`: `undefined`;  `[key: `bytes32[${string}]`]`: `undefined`;  `[key: `bytes31[${string}]`]`: `undefined`;  `[key: `bytes30[${string}]`]`: `undefined`;  `[key: `bytes29[${string}]`]`: `undefined`;  `[key: `bytes28[${string}]`]`: `undefined`;  `[key: `bytes27[${string}]`]`: `undefined`;  `[key: `bytes26[${string}]`]`: `undefined`;  `[key: `bytes25[${string}]`]`: `undefined`;  `[key: `bytes24[${string}]`]`: `undefined`;  `[key: `bytes23[${string}]`]`: `undefined`;  `[key: `bytes21[${string}]`]`: `undefined`;  `[key: `bytes20[${string}]`]`: `undefined`;  `[key: `bytes19[${string}]`]`: `undefined`;  `[key: `bytes18[${string}]`]`: `undefined`;  `[key: `bytes17[${string}]`]`: `undefined`;  `[key: `bytes16[${string}]`]`: `undefined`;  `[key: `bytes15[${string}]`]`: `undefined`;  `[key: `bytes14[${string}]`]`: `undefined`;  `[key: `bytes13[${string}]`]`: `undefined`;  `[key: `bytes12[${string}]`]`: `undefined`;  `[key: `bytes11[${string}]`]`: `undefined`;  `[key: `bytes10[${string}]`]`: `undefined`;  `[key: `bytes9[${string}]`]`: `undefined`;  `[key: `bytes8[${string}]`]`: `undefined`;  `[key: `bytes7[${string}]`]`: `undefined`;  `[key: `bytes6[${string}]`]`: `undefined`;  `[key: `bytes5[${string}]`]`: `undefined`;  `[key: `bytes4[${string}]`]`: `undefined`;  `[key: `bytes3[${string}]`]`: `undefined`;  `[key: `bytes22[${string}]`]`: `undefined`;  `[key: `bytes2[${string}]`]`: `undefined`;  `[key: `bytes1[${string}]`]`: `undefined`;  `[key: `bytes[${string}]`]`: `undefined`;  `[key: `bool[${string}]`]`: `undefined`;  `[key: `address[${string}]`]`: `undefined`;  `[key: `function[${string}]`]`: `undefined`;  `[key: `string[${string}]`]`: `undefined`;  `[key: string]`: readonly `TypedDataParameter`[];  `address`: `undefined`; `bool`: `undefined`; `bytes`: `undefined`; `bytes1`: `undefined`; `bytes10`: `undefined`; `bytes11`: `undefined`; `bytes12`: `undefined`; `bytes13`: `undefined`; `bytes14`: `undefined`; `bytes15`: `undefined`; `bytes16`: `undefined`; `bytes17`: `undefined`; `bytes18`: `undefined`; `bytes19`: `undefined`; `bytes2`: `undefined`; `bytes20`: `undefined`; `bytes21`: `undefined`; `bytes22`: `undefined`; `bytes23`: `undefined`; `bytes24`: `undefined`; `bytes25`: `undefined`; `bytes26`: `undefined`; `bytes27`: `undefined`; `bytes28`: `undefined`; `bytes29`: `undefined`; `bytes3`: `undefined`; `bytes30`: `undefined`; `bytes31`: `undefined`; `bytes32`: `undefined`; `bytes4`: `undefined`; `bytes5`: `undefined`; `bytes6`: `undefined`; `bytes7`: `undefined`; `bytes8`: `undefined`; `bytes9`: `undefined`; `int104`: `undefined`; `int112`: `undefined`; `int120`: `undefined`; `int128`: `undefined`; `int136`: `undefined`; `int144`: `undefined`; `int152`: `undefined`; `int16`: `undefined`; `int160`: `undefined`; `int168`: `undefined`; `int176`: `undefined`; `int184`: `undefined`; `int192`: `undefined`; `int200`: `undefined`; `int208`: `undefined`; `int216`: `undefined`; `int224`: `undefined`; `int232`: `undefined`; `int24`: `undefined`; `int240`: `undefined`; `int248`: `undefined`; `int256`: `undefined`; `int32`: `undefined`; `int40`: `undefined`; `int48`: `undefined`; `int56`: `undefined`; `int64`: `undefined`; `int72`: `undefined`; `int8`: `undefined`; `int80`: `undefined`; `int88`: `undefined`; `int96`: `undefined`; `string`: `undefined`; `uint104`: `undefined`; `uint112`: `undefined`; `uint120`: `undefined`; `uint128`: `undefined`; `uint136`: `undefined`; `uint144`: `undefined`; `uint152`: `undefined`; `uint16`: `undefined`; `uint160`: `undefined`; `uint168`: `undefined`; `uint176`: `undefined`; `uint184`: `undefined`; `uint192`: `undefined`; `uint200`: `undefined`; `uint208`: `undefined`; `uint216`: `undefined`; `uint224`: `undefined`; `uint232`: `undefined`; `uint24`: `undefined`; `uint240`: `undefined`; `uint248`: `undefined`; `uint256`: `undefined`; `uint32`: `undefined`; `uint40`: `undefined`; `uint48`: `undefined`; `uint56`: `undefined`; `uint64`: `undefined`; `uint72`: `undefined`; `uint8`: `undefined`; `uint80`: `undefined`; `uint88`: `undefined`; `uint96`: `undefined`; \} \| \{\}

• **primaryType** *extends* `string`

#### Parameters

##### args

`SignTypedDataParameters`\<`typedData`, `primaryType`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`\>

SignTypedDataParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

The signed data. SignTypedDataReturnType

#### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const signature = await client.signTypedData({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  types: {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  },
  primaryType: 'Mail',
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
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
  transport: http(),
})
const signature = await client.signTypedData({
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  types: {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  },
  primaryType: 'Mail',
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
})
```

### ~~simulate()~~

> **simulate**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

#### Type Parameters

• **calls** *extends* readonly `unknown`[]

#### Parameters

##### args

`SimulateBlocksParameters`\<`calls`\>

#### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

#### Deprecated

Use `simulateBlocks` instead.

### simulateBlocks()

> **simulateBlocks**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulates a set of calls on block(s) with optional block and state overrides.

#### Type Parameters

• **calls** *extends* readonly `unknown`[]

#### Parameters

##### args

`SimulateBlocksParameters`\<`calls`\>

#### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulated blocks. SimulateReturnType

#### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const result = await client.simulateBlocks({
  blocks: [{
    blockOverrides: {
      number: 69420n,
    },
    calls: [{
      {
        account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
        data: '0xdeadbeef',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      },
      {
        account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        value: parseEther('1'),
      },
    }],
    stateOverrides: [{
      address: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
      balance: parseEther('10'),
    }],
  }]
})
```

### simulateCalls()

> **simulateCalls**: \<`calls`\>(`args`) => `Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Simulates a set of calls.

#### Type Parameters

• **calls** *extends* readonly `unknown`[]

#### Parameters

##### args

`SimulateCallsParameters`\<`calls`\>

#### Returns

`Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Results. SimulateCallsReturnType

#### Example

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const result = await client.simulateCalls({
  account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
  calls: [{
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: parseEther('1'),
    },
  ]
})
```

### simulateContract()

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

• **chainOverride** *extends* `undefined` \| `Chain`

• **accountOverride** *extends* `undefined` \| `` `0x${string}` `` \| [`Account`](../type-aliases/Account.md) = `undefined`

#### Parameters

##### args

`SimulateContractParameters`\<`abi`, `functionName`, `args`, `TCommon`, `chainOverride`, `accountOverride`\>

SimulateContractParameters

#### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

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

### snapshot()

> **snapshot**: () => `Promise`\<`` `0x${string}` ``\>

Snapshot the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/snapshot

#### Returns

`Promise`\<`` `0x${string}` ``\>

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

### stopImpersonatingAccount()

> **stopImpersonatingAccount**: (`args`) => `Promise`\<`void`\>

Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).

- Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount

#### Parameters

##### args

`StopImpersonatingAccountParameters`

– StopImpersonatingAccountParameters

#### Returns

`Promise`\<`void`\>

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

### switchChain()

> **switchChain**: (`args`) => `Promise`\<`void`\>

Switch the target chain in a wallet.

- Docs: https://viem.sh/docs/actions/wallet/switchChain
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)

#### Parameters

##### args

`SwitchChainParameters`

SwitchChainParameters

#### Returns

`Promise`\<`void`\>

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

### tevmCall

> **tevmCall**: [`CallHandler`](../../actions/type-aliases/CallHandler.md)

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

> **tevmContract**: [`ContractHandler`](../../actions/type-aliases/ContractHandler.md)

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

> **tevmDeploy**: [`DeployHandler`](../../actions/type-aliases/DeployHandler.md)

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

> **tevmDumpState**: [`DumpStateHandler`](../../actions/type-aliases/DumpStateHandler.md)

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

> **tevmGetAccount**: [`GetAccountHandler`](../../actions/type-aliases/GetAccountHandler.md)

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

> **tevmLoadState**: [`LoadStateHandler`](../../actions/type-aliases/LoadStateHandler.md)

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

> **tevmMine**: [`MineHandler`](../type-aliases/MineHandler.md)

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

#### Returns

`Promise`\<`true`\>

#### Example

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

await client.tevmReady()
```
Same as calling `client.transport.tevm.ready()`

### tevmSetAccount

> **tevmSetAccount**: [`SetAccountHandler`](../../actions/type-aliases/SetAccountHandler.md)

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

> **tevm**: `object` & [`EIP1193Events`](../type-aliases/EIP1193Events.md) & `object` & `object`

###### Type declaration

###### deepCopy()

> `readonly` **deepCopy**: () => `Promise`\<[`TevmNode`](../type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>\>

Copies the current client state into a new client

###### Returns

`Promise`\<[`TevmNode`](../type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>\>

###### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => [`TevmNode`](../type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type Parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

###### Parameters

###### decorator

(`client`) => `TExtension`

###### Returns

[`TevmNode`](../type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

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

> `readonly` **getFilters**: () => `Map`\<`` `0x${string}` ``, [`Filter`](../type-aliases/Filter.md)\>

Gets all registered filters mapped by id

###### Returns

`Map`\<`` `0x${string}` ``, [`Filter`](../type-aliases/Filter.md)\>

###### getImpersonatedAccount()

> `readonly` **getImpersonatedAccount**: () => `undefined` \| `` `0x${string}` ``

The currently impersonated account. This is only used in `fork` mode

###### Returns

`undefined` \| `` `0x${string}` ``

###### getReceiptsManager()

> `readonly` **getReceiptsManager**: () => `Promise`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\>

Interface for querying receipts and historical state

###### Returns

`Promise`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\>

###### getTxPool()

> `readonly` **getTxPool**: () => `Promise`\<[`TxPool`](../../txpool/classes/TxPool.md)\>

Gets the pool of pending transactions to be included in next block

###### Returns

`Promise`\<[`TxPool`](../../txpool/classes/TxPool.md)\>

###### getVm()

> `readonly` **getVm**: () => `Promise`\<[`Vm`](../../vm/type-aliases/Vm.md)\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

###### Returns

`Promise`\<[`Vm`](../../vm/type-aliases/Vm.md)\>

###### logger

> `readonly` **logger**: `Logger`

The logger instance

###### miningConfig

> `readonly` **miningConfig**: [`MiningConfig`](../type-aliases/MiningConfig.md)

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

###### Returns

`Promise`\<`true`\>

###### Example

```ts
const client = createMemoryClient()
await client.ready()
```

###### removeFilter()

> `readonly` **removeFilter**: (`id`) => `void`

Removes a filter by id

###### Parameters

###### id

`` `0x${string}` ``

###### Returns

`void`

###### setFilter()

> `readonly` **setFilter**: (`filter`) => `void`

Creates a new filter to watch for logs events and blocks

###### Parameters

###### filter

[`Filter`](../type-aliases/Filter.md)

###### Returns

`void`

###### setImpersonatedAccount()

> `readonly` **setImpersonatedAccount**: (`address`) => `void`

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

###### Parameters

###### address

`undefined` | `` `0x${string}` ``

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

###### eventName

keyof [`EIP1193EventMap`](../type-aliases/EIP1193EventMap.md)

The event name.

###### args

...`any`[]

Arguments to pass to the event listeners.

###### Returns

`boolean`

True if the event was emitted, false otherwise.

###### Type declaration

###### request

> **request**: [`EIP1193RequestFn`](../type-aliases/EIP1193RequestFn.md)

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

#### Parameters

##### args

`UninstallFilterParameters`

UninstallFilterParameters

#### Returns

`Promise`\<`boolean`\>

A boolean indicating if the Filter was successfully uninstalled. UninstallFilterReturnType

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

### verifyMessage()

> **verifyMessage**: (`args`) => `Promise`\<`boolean`\>

Verify that a message was signed by the provided address.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/actions/public/verifyMessage](https://viem.sh/docs/actions/public/verifyMessage)

#### Parameters

##### args

###### address

`` `0x${string}` ``

The address that signed the original message.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### factory?

`` `0x${string}` ``

###### factoryData?

`` `0x${string}` ``

###### message

`SignableMessage`

The message to be verified.

###### signature

`` `0x${string}` `` \| `ByteArray` \| `Signature`

The signature that was generated by signing the message with the address's private key.

###### universalSignatureVerifierAddress?

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyMessageReturnType

### verifySiweMessage()

> **verifySiweMessage**: (`args`) => `Promise`\<`boolean`\>

Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/siwe/actions/verifySiweMessage](https://viem.sh/docs/siwe/actions/verifySiweMessage)

#### Parameters

##### args

###### address?

`` `0x${string}` ``

Ethereum address to check against.

###### blockNumber?

`bigint`

The balance of the account at a block number.

###### blockTag?

[`BlockTag`](../type-aliases/BlockTag.md)

The balance of the account at a block tag.

**Default**

```ts
'latest'
```

###### domain?

`string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority to check against.

###### message

`string`

EIP-4361 formatted message.

###### nonce?

`string`

Random string to check against.

###### scheme?

`string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme to check against.

###### signature

`` `0x${string}` ``

Signature to check against.

###### time?

`Date`

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

Verify that typed data was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyTypedData](https://viem.sh/docs/actions/public/verifyTypedData)

#### Parameters

##### args

`VerifyTypedDataParameters`

#### Returns

`Promise`\<`boolean`\>

Whether or not the signature is valid. VerifyTypedDataReturnType

### waitForTransactionReceipt()

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

#### Parameters

##### args

`WaitForTransactionReceiptParameters`\<`TCommon`\>

WaitForTransactionReceiptParameters

#### Returns

`Promise`\<`ExtractChainFormatterReturnType`\<`TCommon`, `"transactionReceipt"`, `TransactionReceipt`\>\>

The transaction receipt. WaitForTransactionReceiptReturnType

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

### watchAsset()

> **watchAsset**: (`args`) => `Promise`\<`boolean`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/watchAsset
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)

#### Parameters

##### args

`WatchAssetParams`

WatchAssetParameters

#### Returns

`Promise`\<`boolean`\>

Boolean indicating if the token was successfully added. WatchAssetReturnType

#### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const success = await client.watchAsset({
  type: 'ERC20',
  options: {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    symbol: 'WETH',
  },
})
```

### watchBlockNumber()

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

#### Parameters

##### args

`WatchBlockNumberParameters`

WatchBlockNumberParameters

#### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

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

### watchBlocks()

> **watchBlocks**: \<`includeTransactions`, `blockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

#### Type Parameters

• **includeTransactions** *extends* `boolean` = `false`

• **blockTag** *extends* [`BlockTag`](../type-aliases/BlockTag.md) = `"latest"`

#### Parameters

##### args

`WatchBlocksParameters`\<[`TevmTransport`](../type-aliases/TevmTransport.md), `TCommon`, `includeTransactions`, `blockTag`\>

WatchBlocksParameters

#### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

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

### watchContractEvent()

> **watchContractEvent**: \<`abi`, `eventName`, `strict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `string`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

##### args

`WatchContractEventParameters`\<`abi`, `eventName`, `strict`, [`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchContractEventParameters

#### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

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

### watchEvent()

> **watchEvent**: \<`abiEvent`, `abiEvents`, `strict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

#### Type Parameters

• **abiEvent** *extends* `undefined` \| [`AbiEvent`](../type-aliases/AbiEvent.md) = `undefined`

• **abiEvents** *extends* `undefined` \| readonly `unknown`[] \| readonly [`AbiEvent`](../type-aliases/AbiEvent.md)[] = `abiEvent` *extends* [`AbiEvent`](../type-aliases/AbiEvent.md) ? \[`abiEvent`\<`abiEvent`\>\] : `undefined`

• **strict** *extends* `undefined` \| `boolean` = `undefined`

#### Parameters

##### args

`WatchEventParameters`\<`abiEvent`, `abiEvents`, `strict`, [`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchEventParameters

#### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

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

### watchPendingTransactions()

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

#### Parameters

##### args

`WatchPendingTransactionsParameters`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\>

WatchPendingTransactionsParameters

#### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

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

### writeContract()

> **writeContract**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<`` `0x${string}` ``\>

Executes a write function on a contract.

- Docs: https://viem.sh/docs/contract/writeContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.

Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

__Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__

#### Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **functionName** *extends* `string`

• **args** *extends* `unknown`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

#### Parameters

##### args

`WriteContractParameters`\<`abi`, `functionName`, `args`, `TCommon`, `TAccountOrAddress` *extends* [`Account`](../type-aliases/Account.md) ? [`Account`](../type-aliases/Account.md) : `undefined`, `chainOverride`\>

WriteContractParameters

#### Returns

`Promise`\<`` `0x${string}` ``\>

A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). WriteContractReturnType

#### Examples

```ts
import { createWalletClient, custom, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const hash = await client.writeContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
})
```

```ts
// With Validation
import { createWalletClient, custom, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const { request } = await client.simulateContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
}
const hash = await client.writeContract(request)
```

## Example

```typescript
import { createMemoryClient } from "tevm";

const client = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
  },
});

const blockNumber = await client.getBlockNumber();
console.log(blockNumber);
```

## See

 - [Client Guide](https://tevm.sh/learn/clients/)
 - [Actions Guide](https://tevm.sh/learn/actions/)
 - [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
 - For more information on viem clients, see the [viem client docs](https://viem.sh/docs/clients/introduction)

## Actions API

MemoryClient supports the following viem actions:

- [TEVM actions API](https://tevm.sh/reference/tevm/memory-client/type-aliases/tevmactions/)
```typescript
import { createMemoryClient } from "tevm";

const tevm = createMemoryClient();
await tevm.setAccount({ address: `0x${'01'.repeat(20)}`, balance: 100n });
```
- [Viem public actions API](https://viem.sh/docs/actions/public/introduction) such as [getBlockNumber](https://viem.sh/docs/actions/public/getBlockNumber)
```typescript
import { createMemoryClient } from "tevm";

const tevm = createMemoryClient();
const bn = await tevm.getBlockNumber();
```
- [Test actions](https://viem.sh/docs/actions/test/introduction) are included by default.
```typescript
import { createMemoryClient } from "tevm";

const tevm = createMemoryClient();
await tevm.setBalance({ address: `0x${'01'.repeat(20)}`, balance: 100n });
```

## Forking

To fork an existing network, pass an EIP-1193 transport to the `fork.transport` option with an optional block tag.
When you fork, TEVM will pin the block tag and lazily cache state from the fork transport.
It's highly recommended to pass in a `common` object that matches the chain. This will increase the performance of forking with known values.

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const forkedClient = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
    blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
  },
  common: optimism,
});
```

The `common` object extends the viem chain interface with EVM-specific information. When using TEVM, you should also use `tevm/common` rather than `viem/chains` or use `createCommon` and pass in a viem chain.

Viem clients, including MemoryClient, are themselves EIP-1193 transports. This means you can fork a client with another client.

## Mining Modes

TEVM supports two mining modes:
- Manual: Using `tevm.mine()`
- Auto: Automatically mines a block after every transaction.

TEVM state does not update until blocks are mined.

## Using TEVM over HTTP

TEVM can be run as an HTTP server using `@tevm/server` to handle JSON-RPC requests.

```typescript
import { createServer } from "tevm/server";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();

const server = createServer({
  request: memoryClient.request,
});

server.listen(8545, () => console.log("listening on 8545"));
```

This allows you to use any Ethereum client to communicate with it, including a viem public client.

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
});

console.log(await publicClient.getChainId());
```

## State Persistence (Experimental)

It is possible to persist the TEVM client to a synchronous source using the `persister` option.

```typescript
import { createMemoryClient, createSyncPersister } from "tevm";
import { createMemoryClient } from "tevm/sync-storage-persister";

// Client state will be hydrated and persisted from/to local storage
const clientWithLocalStoragePersistence = createMemoryClient({
  persister: createSyncPersister({
    storage: localStorage,
  }),
});
```

## Network Support

TEVM guarantees support for the following networks:
- Ethereum mainnet
- Standard OP Stack chains

Other EVM chains are likely to work but do not officially carry support. More official chain support will be added in the near future.

Note: Optimism deposit transactions are not currently supported but will be in a future release. TEVM filters out these transactions from blocks.

## Network and Hardfork Support

TEVM supports enabling and disabling different EIPs, but the following EIPs are always turned on:
- 1559
- 4895
- 4844
- 4788

Currently, only EIP-1559 Fee Market transactions are supported.

## Tree Shakeable Actions

TEVM supports tree-shakeable actions using `createTevmNode()` and the `tevm/actions` package. If you are building a UI, you should use tree-shakeable actions to optimize bundle size. These are described in detail in the [actions API guide](https://tevm.sh/learn/actions/).

## Composing with TEVM Contracts and Bundler

MemoryClient can compose with TEVM contracts and the TEVM bundler. For more information, see the [TEVM contracts guide](https://tevm.sh/learn/contracts/) and the [TEVM Solidity imports guide](https://tevm.sh/learn/solidity-imports/).

```typescript
import { createMemoryClient } from "tevm";
import { MyERC721 } from './MyERC721.sol';

const tevm = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
  },
});

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

await tevm.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
);

const balance = await tevm.runContractCall(
  MyERC721.read.balanceOf({
    caller: address,
  }),
);
console.log(balance); // 1n
```
