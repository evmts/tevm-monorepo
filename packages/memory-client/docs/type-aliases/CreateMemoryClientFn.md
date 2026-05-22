[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn

> **CreateMemoryClientFn** = \{\<`TAccountOrAddress`, `TRpcSchema`\>(`options`): `object`; \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options?`): `object`; \}

Defined in: [packages/memory-client/src/CreateMemoryClientFn.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L27)

Type of [createMemoryClient](../variables/createMemoryClient.md). When `fork` is supplied without `common`, the chain is inferred
from the fork and `TChain` is `undefined`.

## Call Signature

> \<`TAccountOrAddress`, `TRpcSchema`\>(`options`): `object`

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TAccountOrAddress` *extends* `` `0x${string}` `` \| `Account` \| `undefined` | `undefined` |
| `TRpcSchema` *extends* `RpcSchema` \| `undefined` | \[\{ `Method`: `"web3_clientVersion"`; `Parameters?`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`Hash`\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters?`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters?`: `undefined`; `ReturnType`: `Quantity`; \}, \{ `Method`: `"net_version"`; `Parameters?`: `undefined`; `ReturnType`: `Quantity`; \}\] |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `ForkedMemoryClientOptions`\<`TAccountOrAddress`, `TRpcSchema`\> |

### Returns

#### account

> **account**: `account`

The Account of the Client.

#### addChain

> **addChain**: (`args`) => `Promise`\<`void`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/addChain
- JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `AddChainParameters` | AddChainParameters |

##### Returns

`Promise`\<`void`\>

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { optimism } from 'viem/chains'

const client = createWalletClient({
  transport: custom(window.ethereum),
})
await client.addChain({ chain: optimism })
```

#### batch?

> `optional` **batch?**: `ClientConfig`\[`"batch"`\]

Flags for batch settings.

#### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

#### call

> **call**: (`parameters`) => `Promise`\<`CallReturnType`\>

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `CallParameters`\<`chain`\> |

##### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

##### Example

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

#### ccipRead?

> `optional` **ccipRead?**: `ClientConfig`\[`"ccipRead"`\]

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

#### chain

> **chain**: `chain`

Chain for the client.

#### createAccessList

> **createAccessList**: (`parameters`) => `Promise`\<`CreateAccessListReturnType`\>

Creates an EIP-2930 access list that you can include in a transaction.

- Docs: https://viem.sh/docs/actions/public/createAccessList
- JSON-RPC Methods: `eth_createAccessList`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `CreateAccessListParameters`\<`chain`\> |

##### Returns

`Promise`\<`CreateAccessListReturnType`\>

The call data. CreateAccessListReturnType

##### Example

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

#### createBlockFilter

> **createBlockFilter**: () => `Promise`\<`CreateBlockFilterReturnType`\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

##### Returns

`Promise`\<`CreateBlockFilterReturnType`\>

Filter. CreateBlockFilterReturnType

##### Example

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

#### createContractEventFilter

> **createContractEventFilter**: \<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` | - |
| `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `CreateContractEventFilterParameters`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\> | CreateContractEventFilterParameters |

##### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

##### Example

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

#### createEventFilter

> **createEventFilter**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>(`args?`) => `Promise`\<`CreateEventFilterReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `_EventName` *extends* `string` \| `undefined` | `MaybeAbiEventName`\<`abiEvent`\> |
| `_Args` *extends* `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_EventName`\> \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `CreateEventFilterParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\> | CreateEventFilterParameters |

##### Returns

`Promise`\<`CreateEventFilterReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateEventFilterReturnType

##### Example

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

#### createPendingTransactionFilter

> **createPendingTransactionFilter**: () => `Promise`\<`CreatePendingTransactionFilterReturnType`\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

##### Returns

`Promise`\<`CreatePendingTransactionFilterReturnType`\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateBlockFilterReturnType

##### Example

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

#### dataSuffix?

> `optional` **dataSuffix?**: `DataSuffix`

Data suffix to append to transaction data.

#### deployContract

> **deployContract**: \<`abi`, `chainOverride`\>(`args`) => `Promise`\<`DeployContractReturnType`\>

Deploys a contract to the network, given bytecode and constructor arguments.

- Docs: https://viem.sh/docs/contract/deployContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts

##### Type Parameters

| Type Parameter |
| ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `chainOverride` *extends* `Chain` \| `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `DeployContractParameters`\<`abi`, `chain`, `account`, `chainOverride`\> | DeployContractParameters |

##### Returns

`Promise`\<`DeployContractReturnType`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. DeployContractReturnType

##### Example

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

#### dropTransaction

> **dropTransaction**: (`args`) => `Promise`\<`void`\>

Removes a transaction from the mempool.

- Docs: https://viem.sh/docs/actions/test/dropTransaction

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `DropTransactionParameters` | DropTransactionParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### dumpState

> **dumpState**: () => `Promise`\<`DumpStateReturnType`\>

Serializes the current state (including contracts code, contract's storage,
accounts properties, etc.) into a savable data blob.

- Docs: https://viem.sh/docs/actions/test/dumpState

##### Returns

`Promise`\<`DumpStateReturnType`\>

##### Example

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

#### estimateContractGas

> **estimateContractGas**: \<`chain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`EstimateContractGasReturnType`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

##### Type Parameters

| Type Parameter |
| ------ |
| `chain` *extends* `Chain` \| `undefined` |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"nonpayable"` \| `"payable"`\> |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"nonpayable"` \| `"payable"`, `functionName`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `chain`\> | EstimateContractGasParameters |

##### Returns

`Promise`\<`EstimateContractGasReturnType`\>

The gas estimate (in wei). EstimateContractGasReturnType

##### Remarks

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### estimateFeesPerGas

> **estimateFeesPerGas**: \<`chainOverride`, `type`\>(`args?`) => `Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `type` *extends* `FeeValuesType` | `"eip1559"` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | `EstimateFeesPerGasParameters`\<`chain`, `chainOverride`, `type`\> |

##### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

##### Example

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

#### estimateGas

> **estimateGas**: (`args`) => `Promise`\<`EstimateGasReturnType`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `EstimateGasParameters`\<`chain`\> | EstimateGasParameters |

##### Returns

`Promise`\<`EstimateGasReturnType`\>

The gas estimate (in wei). EstimateGasReturnType

##### Example

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

#### estimateMaxPriorityFeePerGas

> **estimateMaxPriorityFeePerGas**: \<`chainOverride`\>(`args?`) => `Promise`\<`EstimateMaxPriorityFeePerGasReturnType`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | `EstimateMaxPriorityFeePerGasParameters`\<`chain`, `chainOverride`\> |

##### Returns

`Promise`\<`EstimateMaxPriorityFeePerGasReturnType`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

##### Example

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

#### experimental\_blockTag?

> `optional` **experimental\_blockTag?**: `BlockTag`

Default block tag to use for RPC requests.

#### extend

> **extend**: \<`client`\>(`fn`) => `Client`\<`transport`, `chain`, `account`, `rpcSchema`, `Prettify`\<`client`\> & `extended` *extends* `Extended` ? `extended` : `unknown`\>

##### Type Parameters

| Type Parameter |
| ------ |
| `client` *extends* `Extended` & `ExactPartial`\<`ExtendableProtectedActions`\<`transport`, `chain`, `account`\>\> |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`client`) => `client` |

##### Returns

`Client`\<`transport`, `chain`, `account`, `rpcSchema`, `Prettify`\<`client`\> & `extended` *extends* `Extended` ? `extended` : `unknown`\>

#### fillTransaction

> **fillTransaction**: \<`chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`FillTransactionReturnType`\<`chain`, `chainOverride`\>\>

Fills a transaction request with the necessary fields to be signed over.

- Docs: https://viem.sh/docs/actions/public/fillTransaction

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `FillTransactionParameters`\<`chain`, `account`, `chainOverride`, `accountOverride`\> |

##### Returns

`Promise`\<`FillTransactionReturnType`\<`chain`, `chainOverride`\>\>

The filled transaction. FillTransactionReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.fillTransaction({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

#### getAddresses

> **getAddresses**: () => `Promise`\<`GetAddressesReturnType`\>

Returns a list of account addresses owned by the wallet or client.

- Docs: https://viem.sh/docs/actions/wallet/getAddresses
- JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)

##### Returns

`Promise`\<`GetAddressesReturnType`\>

List of account addresses owned by the wallet or client. GetAddressesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.getAddresses()
```

#### getAutomine

> **getAutomine**: () => `Promise`\<`GetAutomineReturnType`\>

Returns the automatic mining status of the node.

- Docs: https://viem.sh/docs/actions/test/getAutomine

##### Returns

`Promise`\<`GetAutomineReturnType`\>

Whether or not the node is auto mining. GetAutomineReturnType

##### Example

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

#### getBalance

> **getBalance**: (`args`) => `Promise`\<`GetBalanceReturnType`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetBalanceParameters` | GetBalanceParameters |

##### Returns

`Promise`\<`GetBalanceReturnType`\>

The balance of the address in wei. GetBalanceReturnType

##### Remarks

You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).

```ts
const balance = await getBalance(client, {
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  blockTag: 'safe'
})
const balanceAsEther = formatEther(balance)
// "6.942"
```

##### Example

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

#### getBlobBaseFee

> **getBlobBaseFee**: () => `Promise`\<`GetBlobBaseFeeReturnType`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

##### Returns

`Promise`\<`GetBlobBaseFeeReturnType`\>

The blob base fee (in wei). GetBlobBaseFeeReturnType

##### Example

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

#### getBlock

> **getBlock**: \<`includeTransactions`, `blockTag`\>(`args?`) => `Promise`\<`GetBlockReturnType`\<`chain`, `includeTransactions`, `blockTag`\>\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `includeTransactions` *extends* `boolean` | `false` |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockParameters`\<`includeTransactions`, `blockTag`\> | GetBlockParameters |

##### Returns

`Promise`\<`GetBlockReturnType`\<`chain`, `includeTransactions`, `blockTag`\>\>

Information about the block. GetBlockReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getBlock()
```

#### getBlockNumber

> **getBlockNumber**: (`args?`) => `Promise`\<`GetBlockNumberReturnType`\>

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockNumberParameters` | GetBlockNumberParameters |

##### Returns

`Promise`\<`GetBlockNumberReturnType`\>

The number of the block. GetBlockNumberReturnType

##### Example

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

#### getBlockTransactionCount

> **getBlockTransactionCount**: (`args?`) => `Promise`\<`GetBlockTransactionCountReturnType`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockTransactionCountParameters` | GetBlockTransactionCountParameters |

##### Returns

`Promise`\<`GetBlockTransactionCountReturnType`\>

The block transaction count. GetBlockTransactionCountReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const count = await client.getBlockTransactionCount()
```

#### ~~getBytecode~~

> **getBytecode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetCodeParameters` |

##### Returns

`Promise`\<`GetCodeReturnType`\>

##### Deprecated

Use `getCode` instead.

#### getCallsStatus

> **getCallsStatus**: (`parameters`) => `Promise`\<`GetCallsStatusReturnType`\>

Returns the status of a call batch that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/getCallsStatus
- JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `GetCallsStatusParameters` |

##### Returns

`Promise`\<`GetCallsStatusReturnType`\>

Status of the calls. GetCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const { receipts, status } = await client.getCallsStatus({ id: '0xdeadbeef' })
```

#### getCapabilities

> **getCapabilities**: \<`chainId`\>(`parameters?`) => `Promise`\<`GetCapabilitiesReturnType`\<`chainId`\>\>

Extract capabilities that a connected wallet supports (e.g. paymasters, session keys, etc).

- Docs: https://viem.sh/docs/actions/wallet/getCapabilities
- JSON-RPC Methods: [`wallet_getCapabilities`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter |
| ------ |
| `chainId` *extends* `number` \| `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters?` | `GetCapabilitiesParameters`\<`chainId`\> |

##### Returns

`Promise`\<`GetCapabilitiesReturnType`\<`chainId`\>\>

The wallet's capabilities. GetCapabilitiesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const capabilities = await client.getCapabilities({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### getChainId

> **getChainId**: () => `Promise`\<`GetChainIdReturnType`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

##### Returns

`Promise`\<`GetChainIdReturnType`\>

The current chain ID. GetChainIdReturnType

##### Example

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

#### getCode

> **getCode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getCode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetCodeParameters` | GetBytecodeParameters |

##### Returns

`Promise`\<`GetCodeReturnType`\>

The contract's bytecode. GetBytecodeReturnType

##### Example

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

#### getContractEvents

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` | `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> |

##### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetContractEventsReturnType

##### Example

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

#### getDelegation

> **getDelegation**: (`args`) => `Promise`\<`GetDelegationReturnType`\>

Returns the address that an account has delegated to via EIP-7702.

- Docs: https://viem.sh/docs/actions/public/getDelegation

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetDelegationParameters` | GetDelegationParameters |

##### Returns

`Promise`\<`GetDelegationReturnType`\>

The delegated address, or undefined if not delegated. GetDelegationReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const delegation = await client.getDelegation({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### getEip712Domain

> **getEip712Domain**: (`args`) => `Promise`\<`GetEip712DomainReturnType`\>

Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetEip712DomainParameters` |

##### Returns

`Promise`\<`GetEip712DomainReturnType`\>

The EIP-712 domain, fields, and extensions. GetEip712DomainReturnType

##### Example

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

#### getEnsAddress

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsAddressParameters` | GetEnsAddressParameters |

##### Returns

`Promise`\<`GetEnsAddressReturnType`\>

Address for ENS name or `null` if not found. GetEnsAddressReturnType

##### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsAvatar

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsAvatarParameters` | GetEnsAvatarParameters |

##### Returns

`Promise`\<`GetEnsAvatarReturnType`\>

Avatar URI or `null` if not found. GetEnsAvatarReturnType

##### Remarks

Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsName

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsNameParameters` | GetEnsNameParameters |

##### Returns

`Promise`\<`GetEnsNameReturnType`\>

Name or `null` if not found. GetEnsNameReturnType

##### Remarks

Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.

##### Example

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

#### getEnsResolver

> **getEnsResolver**: (`args`) => `Promise`\<`GetEnsResolverReturnType`\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsResolverParameters` | GetEnsResolverParameters |

##### Returns

`Promise`\<`GetEnsResolverReturnType`\>

Address for ENS resolver. GetEnsResolverReturnType

##### Remarks

Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsText

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsTextParameters` | GetEnsTextParameters |

##### Returns

`Promise`\<`GetEnsTextReturnType`\>

Address for ENS resolver. GetEnsTextReturnType

##### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getFeeHistory

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFeeHistoryParameters` | GetFeeHistoryParameters |

##### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

The gas estimate (in wei). GetFeeHistoryReturnType

##### Example

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

#### getFilterChanges

> **getFilterChanges**: \<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `filterType` *extends* `FilterType` | - |
| `abi` *extends* `Abi` \| readonly `unknown`[] \| `undefined` | - |
| `eventName` *extends* `string` \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFilterChangesParameters`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> | GetFilterChangesParameters |

##### Returns

`Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

##### Remarks

A Filter can be created from the following actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

Depending on the type of filter, the return value will be different:

- If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
- If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
- If the filter was created with `createBlockFilter`, it returns a list of block hashes.

##### Examples

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

#### getFilterLogs

> **getFilterLogs**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] \| `undefined` | - |
| `eventName` *extends* `string` \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFilterLogsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> | GetFilterLogsParameters |

##### Returns

`Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetFilterLogsReturnType

##### Remarks

`getFilterLogs` is only compatible with **event filters**.

##### Example

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

#### getGasPrice

> **getGasPrice**: () => `Promise`\<`GetGasPriceReturnType`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

##### Returns

`Promise`\<`GetGasPriceReturnType`\>

The gas price (in wei). GetGasPriceReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasPrice = await client.getGasPrice()
```

#### getLogs

> **getLogs**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>(`args?`) => `Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetLogsParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\> | GetLogsParameters |

##### Returns

`Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetLogsReturnType

##### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getLogs()
```

#### getPermissions

> **getPermissions**: () => `Promise`\<`GetPermissionsReturnType`\>

Gets the wallets current permissions.

- Docs: https://viem.sh/docs/actions/wallet/getPermissions
- JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

##### Returns

`Promise`\<`GetPermissionsReturnType`\>

The wallet permissions. GetPermissionsReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const permissions = await client.getPermissions()
```

#### getProof

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetProofParameters` |

##### Returns

`Promise`\<`GetProofReturnType`\>

Proof data. GetProofReturnType

##### Example

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

#### getStorageAt

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetStorageAtParameters` | GetStorageAtParameters |

##### Returns

`Promise`\<`GetStorageAtReturnType`\>

The value of the storage slot. GetStorageAtReturnType

##### Example

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

#### getTransaction

> **getTransaction**: \<`blockTag`\>(`args`) => `Promise`\<`GetTransactionReturnType`\<`chain`, `blockTag`\>\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionParameters`\<`blockTag`\> | GetTransactionParameters |

##### Returns

`Promise`\<`GetTransactionReturnType`\<`chain`, `blockTag`\>\>

The transaction information. GetTransactionReturnType

##### Example

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

#### getTransactionConfirmations

> **getTransactionConfirmations**: (`args`) => `Promise`\<`GetTransactionConfirmationsReturnType`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionConfirmationsParameters`\<`chain`\> | GetTransactionConfirmationsParameters |

##### Returns

`Promise`\<`GetTransactionConfirmationsReturnType`\>

The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. GetTransactionConfirmationsReturnType

##### Example

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

#### getTransactionCount

> **getTransactionCount**: (`args`) => `Promise`\<`GetTransactionCountReturnType`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionCountParameters` | GetTransactionCountParameters |

##### Returns

`Promise`\<`GetTransactionCountReturnType`\>

The number of transactions an account has sent. GetTransactionCountReturnType

##### Example

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

#### getTransactionReceipt

> **getTransactionReceipt**: (`args`) => `Promise`\<`GetTransactionReceiptReturnType`\<`chain`\>\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionReceiptParameters` | GetTransactionReceiptParameters |

##### Returns

`Promise`\<`GetTransactionReceiptReturnType`\<`chain`\>\>

The transaction receipt. GetTransactionReceiptReturnType

##### Example

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

#### getTxpoolContent

> **getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

##### Returns

`Promise`\<`GetTxpoolContentReturnType`\>

Transaction pool content. GetTxpoolContentReturnType

##### Example

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

#### getTxpoolStatus

> **getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolStatus

##### Returns

`Promise`\<`GetTxpoolStatusReturnType`\>

Transaction pool status. GetTxpoolStatusReturnType

##### Example

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

#### impersonateAccount

> **impersonateAccount**: (`args`) => `Promise`\<`void`\>

Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.

- Docs: https://viem.sh/docs/actions/test/impersonateAccount

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ImpersonateAccountParameters` | ImpersonateAccountParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### increaseTime

> **increaseTime**: (`args`) => `Promise`\<`Quantity`\>

Jump forward in time by the given amount of time, in seconds.

- Docs: https://viem.sh/docs/actions/test/increaseTime

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `IncreaseTimeParameters` | – IncreaseTimeParameters |

##### Returns

`Promise`\<`Quantity`\>

##### Example

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

#### inspectTxpool

> **inspectTxpool**: () => `Promise`\<`InspectTxpoolReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/inspectTxpool

##### Returns

`Promise`\<`InspectTxpoolReturnType`\>

Transaction pool inspection data. InspectTxpoolReturnType

##### Example

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

#### key

> **key**: `string`

A key for the client.

#### loadState

> **loadState**: (`args`) => `Promise`\<`LoadStateReturnType`\>

Adds state previously dumped with `dumpState` to the current chain.

- Docs: https://viem.sh/docs/actions/test/loadState

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `LoadStateParameters` |

##### Returns

`Promise`\<`LoadStateReturnType`\>

##### Example

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

#### mine

> **mine**: (`args`) => `Promise`\<`void`\>

Mine a specified number of blocks.

- Docs: https://viem.sh/docs/actions/test/mine

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `MineParameters` | – MineParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### multicall

> **multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `contracts` *extends* readonly `unknown`[] | - |
| `allowFailure` *extends* `boolean` | `true` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `MulticallParameters`\<`contracts`, `allowFailure`\> | MulticallParameters |

##### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

An array of results with accompanying status. MulticallReturnType

##### Example

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

#### name

> **name**: `string`

A name for the client.

#### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

#### prepareAuthorization

> **prepareAuthorization**: (`parameters`) => `Promise`\<`PrepareAuthorizationReturnType`\>

Prepares an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object for signing.
This Action will fill the required fields of the Authorization object if they are not provided (e.g. `nonce` and `chainId`).

With the prepared Authorization object, you can use [`signAuthorization`](https://viem.sh/docs/eip7702/signAuthorization) to sign over the Authorization object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `PrepareAuthorizationParameters`\<`account`\> | PrepareAuthorizationParameters |

##### Returns

`Promise`\<`PrepareAuthorizationReturnType`\>

The prepared Authorization object. PrepareAuthorizationReturnType

##### Examples

```ts
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const authorization = await client.prepareAuthorization({
  account: privateKeyToAccount('0x..'),
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
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

const authorization = await client.prepareAuthorization({
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### prepareTransactionRequest

> **prepareTransactionRequest**: \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`PrepareTransactionRequestReturnType`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\>\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `PrepareTransactionRequestRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `PrepareTransactionRequestParameters`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\> | PrepareTransactionRequestParameters |

##### Returns

`Promise`\<`PrepareTransactionRequestReturnType`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\>\>

The transaction request. PrepareTransactionRequestReturnType

##### Examples

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

#### readContract

> **readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts

##### Type Parameters

| Type Parameter |
| ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"pure"` \| `"view"`\> |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"pure"` \| `"view"`, `functionName`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ReadContractParameters`\<`abi`, `functionName`, `args`\> | ReadContractParameters |

##### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

The response from the contract. Type is inferred. ReadContractReturnType

##### Remarks

A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### removeBlockTimestampInterval

> **removeBlockTimestampInterval**: () => `Promise`\<`void`\>

Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.

- Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval

##### Returns

`Promise`\<`void`\>

##### Example

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

#### request

> **request**: `EIP1193RequestFn`\<`rpcSchema` *extends* `undefined` ? `EIP1474Methods` : `rpcSchema`\>

Request function wrapped with friendly error handling

#### requestAddresses

> **requestAddresses**: () => `Promise`\<`RequestAddressesReturnType`\>

Requests a list of accounts managed by a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestAddresses
- JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)

Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).

This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.

##### Returns

`Promise`\<`RequestAddressesReturnType`\>

List of accounts managed by a wallet RequestAddressesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.requestAddresses()
```

#### requestPermissions

> **requestPermissions**: (`args`) => `Promise`\<`RequestPermissionsReturnType`\>

Requests permissions for a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestPermissions
- JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `RequestPermissionsParameters` | RequestPermissionsParameters |

##### Returns

`Promise`\<`RequestPermissionsReturnType`\>

The wallet permissions. RequestPermissionsReturnType

##### Example

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

#### reset

> **reset**: (`args?`) => `Promise`\<`void`\>

Resets fork back to its original state.

- Docs: https://viem.sh/docs/actions/test/reset

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `ResetParameters` | – ResetParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### revert

> **revert**: (`args`) => `Promise`\<`void`\>

Revert the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/revert

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `RevertParameters` | – RevertParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### sendCalls

> **sendCalls**: \<`calls`, `chainOverride`\>(`parameters`) => `Promise`\<`SendCallsReturnType`\>

Requests the connected wallet to send a batch of calls.

- Docs: https://viem.sh/docs/actions/wallet/sendCalls
- JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `calls` *extends* readonly `unknown`[] | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `SendCallsParameters`\<`chain`, `account`, `chainOverride`, `calls`\> |

##### Returns

`Promise`\<`SendCallsReturnType`\>

Transaction identifier. SendCallsReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const id = await client.sendCalls({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  calls: [
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 69420n,
    },
  ],
})
```

#### sendCallsSync

> **sendCallsSync**: \<`calls`, `chainOverride`\>(`parameters`) => `Promise`\<`SendCallsSyncReturnType`\>

Requests the connected wallet to send a batch of calls, and waits for the calls to be included in a block.

- Docs: https://viem.sh/docs/actions/wallet/sendCallsSync
- JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `calls` *extends* readonly `unknown`[] | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `SendCallsSyncParameters`\<`chain`, `account`, `chainOverride`, `calls`\> |

##### Returns

`Promise`\<`SendCallsSyncReturnType`\>

Calls status. SendCallsSyncReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const status = await client.sendCallsSync({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  calls: [
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 69420n,
    },
  ],
})
```

#### sendRawTransaction

> **sendRawTransaction**: (`args`) => `Promise`\<`SendRawTransactionReturnType`\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SendRawTransactionParameters` |

##### Returns

`Promise`\<`SendRawTransactionReturnType`\>

The transaction hash. SendRawTransactionReturnType

##### Example

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

#### sendRawTransactionSync

> **sendRawTransactionSync**: (`args`) => `Promise`\<`SendRawTransactionSyncReturnType`\<`chain`\>\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransactionSync
- JSON-RPC Method: [`eth_sendRawTransactionSync`](https://eips.ethereum.org/EIPS/eip-7966)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SendRawTransactionSyncParameters` |

##### Returns

`Promise`\<`SendRawTransactionSyncReturnType`\<`chain`\>\>

The transaction receipt. SendRawTransactionSyncReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { sendRawTransactionSync } from 'viem/wallet'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const receipt = await client.sendRawTransactionSync({
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
})
```

#### sendTransaction

> **sendTransaction**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<`SendTransactionReturnType`\>

Creates, signs, and sends a new transaction to the network.

- Docs: https://viem.sh/docs/actions/wallet/sendTransaction
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
  - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `SendTransactionRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendTransactionParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SendTransactionParameters |

##### Returns

`Promise`\<`SendTransactionReturnType`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. SendTransactionReturnType

##### Examples

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

#### sendTransactionSync

> **sendTransactionSync**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<`SendTransactionSyncReturnType`\<`chain`\>\>

Creates, signs, and sends a new transaction to the network synchronously.
Returns the transaction receipt.

- Docs: https://viem.sh/docs/actions/wallet/sendTransactionSync
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
  - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `SendTransactionSyncRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendTransactionSyncParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SendTransactionParameters |

##### Returns

`Promise`\<`SendTransactionSyncReturnType`\<`chain`\>\>

The transaction receipt. SendTransactionReturnType

##### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const receipt = await client.sendTransactionSync({
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
const receipt = await client.sendTransactionSync({
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
})
```

#### sendUnsignedTransaction

> **sendUnsignedTransaction**: \<`chain`\>(`args`) => `Promise`\<`SendUnsignedTransactionReturnType`\>

Executes a transaction regardless of the signature.

- Docs: https://viem.sh/docs/actions/test/sendUnsignedTransaction

##### Type Parameters

| Type Parameter |
| ------ |
| `chain` *extends* `Chain` \| `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendUnsignedTransactionParameters`\<`chain`\> | – SendUnsignedTransactionParameters |

##### Returns

`Promise`\<`SendUnsignedTransactionReturnType`\>

The transaction hash. SendUnsignedTransactionReturnType

##### Example

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

#### setAutomine

> **setAutomine**: (`args`) => `Promise`\<`void`\>

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

- Docs: https://viem.sh/docs/actions/test/setAutomine

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `boolean` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBalance

> **setBalance**: (`args`) => `Promise`\<`void`\>

Modifies the balance of an account.

- Docs: https://viem.sh/docs/actions/test/setBalance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBalanceParameters` | – SetBalanceParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBlockGasLimit

> **setBlockGasLimit**: (`args`) => `Promise`\<`void`\>

Sets the block's gas limit.

- Docs: https://viem.sh/docs/actions/test/setBlockGasLimit

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBlockGasLimitParameters` | – SetBlockGasLimitParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBlockTimestampInterval

> **setBlockTimestampInterval**: (`args`) => `Promise`\<`void`\>

Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

- Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBlockTimestampIntervalParameters` | – SetBlockTimestampIntervalParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setCode

> **setCode**: (`args`) => `Promise`\<`void`\>

Modifies the bytecode stored at an account's address.

- Docs: https://viem.sh/docs/actions/test/setCode

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetCodeParameters` | – SetCodeParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setCoinbase

> **setCoinbase**: (`args`) => `Promise`\<`void`\>

Sets the coinbase address to be used in new blocks.

- Docs: https://viem.sh/docs/actions/test/setCoinbase

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetCoinbaseParameters` | – SetCoinbaseParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setIntervalMining

> **setIntervalMining**: (`args`) => `Promise`\<`void`\>

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.

- Docs: https://viem.sh/docs/actions/test/setIntervalMining

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetIntervalMiningParameters` | – SetIntervalMiningParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setLoggingEnabled

> **setLoggingEnabled**: (`args`) => `Promise`\<`void`\>

Enable or disable logging on the test node network.

- Docs: https://viem.sh/docs/actions/test/setLoggingEnabled

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `boolean` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setMinGasPrice

> **setMinGasPrice**: (`args`) => `Promise`\<`void`\>

Change the minimum gas price accepted by the network (in wei).

- Docs: https://viem.sh/docs/actions/test/setMinGasPrice

Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetMinGasPriceParameters` | – SetBlockGasLimitParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNextBlockBaseFeePerGas

> **setNextBlockBaseFeePerGas**: (`args`) => `Promise`\<`void`\>

Sets the next block's base fee per gas.

- Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNextBlockBaseFeePerGasParameters` | – SetNextBlockBaseFeePerGasParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNextBlockTimestamp

> **setNextBlockTimestamp**: (`args`) => `Promise`\<`void`\>

Sets the next block's timestamp.

- Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNextBlockTimestampParameters` | – SetNextBlockTimestampParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNonce

> **setNonce**: (`args`) => `Promise`\<`void`\>

Modifies (overrides) the nonce of an account.

- Docs: https://viem.sh/docs/actions/test/setNonce

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNonceParameters` | – SetNonceParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setRpcUrl

> **setRpcUrl**: (`args`) => `Promise`\<`void`\>

Sets the backend RPC URL.

- Docs: https://viem.sh/docs/actions/test/setRpcUrl

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `string` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setStorageAt

> **setStorageAt**: (`args`) => `Promise`\<`void`\>

Writes to a slot of an account's storage.

- Docs: https://viem.sh/docs/actions/test/setStorageAt

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetStorageAtParameters` | – SetStorageAtParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### showCallsStatus

> **showCallsStatus**: (`parameters`) => `Promise`\<`ShowCallsStatusReturnType`\>

Requests for the wallet to show information about a call batch
that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/showCallsStatus
- JSON-RPC Methods: [`wallet_showCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `ShowCallsStatusParameters` |

##### Returns

`Promise`\<`ShowCallsStatusReturnType`\>

Displays status of the calls in wallet. ShowCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

await client.showCallsStatus({ id: '0xdeadbeef' })
```

#### signAuthorization

> **signAuthorization**: (`parameters`) => `Promise`\<`SignAuthorizationReturnType`\>

Signs an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object.

With the calculated signature, you can:
- use [`verifyAuthorization`](https://viem.sh/docs/eip7702/verifyAuthorization) to verify the signed Authorization object,
- use [`recoverAuthorizationAddress`](https://viem.sh/docs/eip7702/recoverAuthorizationAddress) to recover the signing address from the signed Authorization object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `SignAuthorizationParameters`\<`account`\> | SignAuthorizationParameters |

##### Returns

`Promise`\<`SignAuthorizationReturnType`\>

The signed Authorization object. SignAuthorizationReturnType

##### Examples

```ts
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const signature = await client.signAuthorization({
  account: privateKeyToAccount('0x..'),
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
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

const signature = await client.signAuthorization({
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### signMessage

> **signMessage**: (`args`) => `Promise`\<`SignMessageReturnType`\>

Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signMessage
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
  - Local Accounts: Signs locally. No JSON-RPC request.

With the calculated signature, you can:
- use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
- use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignMessageParameters`\<`account`\> | SignMessageParameters |

##### Returns

`Promise`\<`SignMessageReturnType`\>

The signed message. SignMessageReturnType

##### Examples

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

#### signTransaction

> **signTransaction**: \<`chainOverride`, `request`\>(`args`) => `Promise`\<`SignTransactionReturnType`\<`request`\>\>

Signs a transaction.

- Docs: https://viem.sh/docs/actions/wallet/signTransaction
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
  - Local Accounts: Signs locally. No JSON-RPC request.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | - |
| `request` *extends* `SignTransactionRequest`\<`chain`, `chainOverride`\> | `SignTransactionRequest`\<`chain`, `chainOverride`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignTransactionParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SignTransactionParameters |

##### Returns

`Promise`\<`SignTransactionReturnType`\<`request`\>\>

The signed message. SignTransactionReturnType

##### Examples

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

#### signTypedData

> **signTypedData**: \<`typedData`, `primaryType`\>(`args`) => `Promise`\<`SignTypedDataReturnType`\>

Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signTypedData
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
  - Local Accounts: Signs locally. No JSON-RPC request.

##### Type Parameters

| Type Parameter |
| ------ |
| `typedData` *extends* `TypedData` \| \{\[`key`: `string`\]: `unknown`; \} |
| `primaryType` *extends* `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignTypedDataParameters`\<`typedData`, `primaryType`, `account`\> | SignTypedDataParameters |

##### Returns

`Promise`\<`SignTypedDataReturnType`\>

The signed data. SignTypedDataReturnType

##### Examples

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

#### ~~simulate~~

> **simulate**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateBlocksParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

##### Deprecated

Use `simulateBlocks` instead.

#### simulateBlocks

> **simulateBlocks**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulates a set of calls on block(s) with optional block and state overrides.

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateBlocksParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulated blocks. SimulateReturnType

##### Example

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

#### simulateCalls

> **simulateCalls**: \<`calls`\>(`args`) => `Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Simulates a set of calls.

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateCallsParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Results. SimulateCallsReturnType

##### Example

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

#### simulateContract

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"nonpayable"` \| `"payable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"nonpayable"` \| `"payable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | - |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SimulateContractParameters`\<`abi`, `functionName`, `args`, `chain`, `chainOverride`, `accountOverride`\> | SimulateContractParameters |

##### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

##### Remarks

This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### snapshot

> **snapshot**: () => `Promise`\<`Quantity`\>

Snapshot the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/snapshot

##### Returns

`Promise`\<`Quantity`\>

##### Example

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

#### stopImpersonatingAccount

> **stopImpersonatingAccount**: (`args`) => `Promise`\<`void`\>

Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).

- Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `StopImpersonatingAccountParameters` | – StopImpersonatingAccountParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### switchChain

> **switchChain**: (`args`) => `Promise`\<`void`\>

Switch the target chain in a wallet.

- Docs: https://viem.sh/docs/actions/wallet/switchChain
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SwitchChainParameters` | SwitchChainParameters |

##### Returns

`Promise`\<`void`\>

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet, optimism } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
await client.switchChain({ id: optimism.id })
```

#### tevmCall

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

Low-level call/transaction API. To send a transaction (rather than a call), pass `createTransaction: true`
and mine the result (or use `miningConfig: { type: 'auto' }`). Supports impersonation (`from`/`caller`/`origin`),
`depth`, `createTrace`, `createAccessList`, and more.

##### See

 - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
 - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/)

#### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

Higher-level contract call: handles ABI encoding/decoding and revert messages. Same options as
`tevmCall` apply (impersonation, tracing, access list, `createTransaction`).

##### See

 - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)
 - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/)

#### tevmDeal

> **tevmDeal**: `TevmActionsApi`\[`"deal"`\]

Convenience wrapper over `tevmSetAccount` for setting ETH or ERC20 balances.

##### See

 - [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/)
 - [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/)

##### Example

```typescript
await client.tevmDeal({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000n,
})
```

#### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

Deploys a contract with encoded constructor arguments. Inherits all `tevmCall` options.

##### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/)
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/)

#### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

Dumps the EVM state as a JSON-serializable object for persistence.

#### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

Reads an account's state. Storage is only included if `returnStorage: true`, and in fork mode only
already-cached slots are returned.

##### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/)
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/)

#### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

Loads a previously dumped state into the EVM.

#### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

Mines pending transactions into a new block. Required in manual mining mode to advance canonical state.

#### tevmReady

> **tevmReady**: () => `Promise`\<`true`\>

Resolves when the TEVM is ready. All other actions await this implicitly. Equivalent to `client.transport.tevm.ready()`.

##### Returns

`Promise`\<`true`\>

#### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

Directly sets any property of an account (balance, nonce, deployedBytecode, storage).

##### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/)
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/)

#### transport

> **transport**: `ReturnType`\<`transport`\>\[`"config"`\] & `ReturnType`\<`transport`\>\[`"value"`\]

The RPC transport

#### type

> **type**: `string`

The type of client.

#### uid

> **uid**: `string`

A unique ID for the client.

#### uninstallFilter

> **uninstallFilter**: (`args`) => `Promise`\<`UninstallFilterReturnType`\>

Destroys a Filter that was created from one of the following Actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

- Docs: https://viem.sh/docs/actions/public/uninstallFilter
- JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `UninstallFilterParameters` | UninstallFilterParameters |

##### Returns

`Promise`\<`UninstallFilterReturnType`\>

A boolean indicating if the Filter was successfully uninstalled. UninstallFilterReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

#### verifyHash

> **verifyHash**: (`args`) => `Promise`\<`VerifyHashReturnType`\>

Verify that a hash was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyHash](https://viem.sh/docs/actions/public/verifyHash)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyHashParameters` |

##### Returns

`Promise`\<`VerifyHashReturnType`\>

Whether or not the signature is valid. VerifyHashReturnType

#### verifyMessage

> **verifyMessage**: (`args`) => `Promise`\<`VerifyMessageReturnType`\>

Verify that a message was signed by the provided address.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/actions/public/verifyMessage](https://viem.sh/docs/actions/public/verifyMessage)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyMessageParameters` |

##### Returns

`Promise`\<`VerifyMessageReturnType`\>

Whether or not the signature is valid. VerifyMessageReturnType

#### verifySiweMessage

> **verifySiweMessage**: (`args`) => `Promise`\<`VerifySiweMessageReturnType`\>

Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/siwe/actions/verifySiweMessage](https://viem.sh/docs/siwe/actions/verifySiweMessage)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifySiweMessageParameters` |

##### Returns

`Promise`\<`VerifySiweMessageReturnType`\>

Whether or not the signature is valid. VerifySiweMessageReturnType

#### verifyTypedData

> **verifyTypedData**: (`args`) => `Promise`\<`VerifyTypedDataReturnType`\>

Verify that typed data was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyTypedData](https://viem.sh/docs/actions/public/verifyTypedData)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyTypedDataParameters` |

##### Returns

`Promise`\<`VerifyTypedDataReturnType`\>

Whether or not the signature is valid. VerifyTypedDataReturnType

#### waitForCallsStatus

> **waitForCallsStatus**: (`parameters`) => `Promise`\<`WaitForCallsStatusReturnType`\>

Waits for the status & receipts of a call bundle that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/waitForCallsStatus
- JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `WaitForCallsStatusParameters` | WaitForCallsStatusParameters |

##### Returns

`Promise`\<`WaitForCallsStatusReturnType`\>

Status & receipts of the call bundle. WaitForCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const { receipts, status } = await waitForCallsStatus(client, { id: '0xdeadbeef' })
```

#### waitForTransactionReceipt

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`WaitForTransactionReceiptReturnType`\<`chain`\>\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WaitForTransactionReceiptParameters`\<`chain`\> | WaitForTransactionReceiptParameters |

##### Returns

`Promise`\<`WaitForTransactionReceiptReturnType`\<`chain`\>\>

The transaction receipt. WaitForTransactionReceiptReturnType

##### Remarks

The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).

Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.

There are 3 types of Transaction Replacement reasons:

- `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
- `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
- `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)

##### Example

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

#### watchAsset

> **watchAsset**: (`args`) => `Promise`\<`WatchAssetReturnType`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/watchAsset
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchAssetParameters` | WatchAssetParameters |

##### Returns

`Promise`\<`WatchAssetReturnType`\>

Boolean indicating if the token was successfully added. WatchAssetReturnType

##### Example

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

#### watchBlockNumber

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchBlockNumberParameters` | WatchBlockNumberParameters |

##### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

##### Example

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

#### watchBlocks

> **watchBlocks**: \<`includeTransactions`, `blockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `includeTransactions` *extends* `boolean` | `false` |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchBlocksParameters`\<`transport`, `chain`, `includeTransactions`, `blockTag`\> | WatchBlocksParameters |

##### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

##### Example

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

#### watchContractEvent

> **watchContractEvent**: \<`abi`, `eventName`, `strict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchContractEventParameters`\<`abi`, `eventName`, `strict`, `transport`\> | WatchContractEventParameters |

##### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

##### Remarks

This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).

`watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

##### Example

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

#### watchEvent

> **watchEvent**: \<`abiEvent`, `abiEvents`, `strict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchEventParameters`\<`abiEvent`, `abiEvents`, `strict`, `transport`\> | WatchEventParameters |

##### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

##### Remarks

This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).

`watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

##### Example

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

#### watchPendingTransactions

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchPendingTransactionsParameters`\<`transport`\> | WatchPendingTransactionsParameters |

##### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

##### Remarks

This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).

##### Example

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

#### writeContract

> **writeContract**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<`WriteContractReturnType`\>

Executes a write function on a contract.

- Docs: https://viem.sh/docs/contract/writeContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.

Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

__Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"payable"` \| `"nonpayable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"payable"` \| `"nonpayable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteContractParameters`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`\> | WriteContractParameters |

##### Returns

`Promise`\<`WriteContractReturnType`\>

A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). WriteContractReturnType

##### Examples

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

#### writeContractSync

> **writeContractSync**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<`WriteContractSyncReturnType`\>

Executes a write function on a contract synchronously.
Returns the transaction receipt.

- Docs: https://viem.sh/docs/contract/writeContract

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.

Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

__Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"payable"` \| `"nonpayable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"payable"` \| `"nonpayable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteContractSyncParameters`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`\> | WriteContractSyncParameters |

##### Returns

`Promise`\<`WriteContractSyncReturnType`\>

A [Transaction Receipt](https://viem.sh/docs/glossary/terms#receipt). WriteContractSyncReturnType

##### Example

```ts
import { createWalletClient, custom, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const receipt = await client.writeContractSync({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
})
```

## Call Signature

> \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options?`): `object`

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TCommon` *extends* `object` & `object` & `ChainConfig`\<`ChainFormatters` \| `undefined`, `Record`\<`string`, `unknown`\> \| `undefined`\> | `object` & `object` & `ChainConfig`\<`ChainFormatters` \| `undefined`, `Record`\<`string`, `unknown`\> \| `undefined`\> |
| `TAccountOrAddress` *extends* `` `0x${string}` `` \| `Account` \| `undefined` | `undefined` |
| `TRpcSchema` *extends* `RpcSchema` \| `undefined` | \[\{ `Method`: `"web3_clientVersion"`; `Parameters?`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`Hash`\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters?`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters?`: `undefined`; `ReturnType`: `Quantity`; \}, \{ `Method`: `"net_version"`; `Parameters?`: `undefined`; `ReturnType`: `Quantity`; \}\] |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\> |

### Returns

#### account

> **account**: `account`

The Account of the Client.

#### addChain

> **addChain**: (`args`) => `Promise`\<`void`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/addChain
- JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `AddChainParameters` | AddChainParameters |

##### Returns

`Promise`\<`void`\>

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { optimism } from 'viem/chains'

const client = createWalletClient({
  transport: custom(window.ethereum),
})
await client.addChain({ chain: optimism })
```

#### batch?

> `optional` **batch?**: `ClientConfig`\[`"batch"`\]

Flags for batch settings.

#### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

#### call

> **call**: (`parameters`) => `Promise`\<`CallReturnType`\>

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `CallParameters`\<`chain`\> |

##### Returns

`Promise`\<`CallReturnType`\>

The call data. CallReturnType

##### Example

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

#### ccipRead?

> `optional` **ccipRead?**: `ClientConfig`\[`"ccipRead"`\]

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

#### chain

> **chain**: `chain`

Chain for the client.

#### createAccessList

> **createAccessList**: (`parameters`) => `Promise`\<`CreateAccessListReturnType`\>

Creates an EIP-2930 access list that you can include in a transaction.

- Docs: https://viem.sh/docs/actions/public/createAccessList
- JSON-RPC Methods: `eth_createAccessList`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `CreateAccessListParameters`\<`chain`\> |

##### Returns

`Promise`\<`CreateAccessListReturnType`\>

The call data. CreateAccessListReturnType

##### Example

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

#### createBlockFilter

> **createBlockFilter**: () => `Promise`\<`CreateBlockFilterReturnType`\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

##### Returns

`Promise`\<`CreateBlockFilterReturnType`\>

Filter. CreateBlockFilterReturnType

##### Example

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

#### createContractEventFilter

> **createContractEventFilter**: \<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` | - |
| `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `CreateContractEventFilterParameters`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\> | CreateContractEventFilterParameters |

##### Returns

`Promise`\<`CreateContractEventFilterReturnType`\<`abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateContractEventFilterReturnType

##### Example

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

#### createEventFilter

> **createEventFilter**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>(`args?`) => `Promise`\<`CreateEventFilterReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `_EventName` *extends* `string` \| `undefined` | `MaybeAbiEventName`\<`abiEvent`\> |
| `_Args` *extends* `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_EventName`\> \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `CreateEventFilterParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\> | CreateEventFilterParameters |

##### Returns

`Promise`\<`CreateEventFilterReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_EventName`, `_Args`\>\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateEventFilterReturnType

##### Example

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

#### createPendingTransactionFilter

> **createPendingTransactionFilter**: () => `Promise`\<`CreatePendingTransactionFilterReturnType`\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

##### Returns

`Promise`\<`CreatePendingTransactionFilterReturnType`\>

[`Filter`](https://viem.sh/docs/glossary/types#filter). CreateBlockFilterReturnType

##### Example

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

#### dataSuffix?

> `optional` **dataSuffix?**: `DataSuffix`

Data suffix to append to transaction data.

#### deployContract

> **deployContract**: \<`abi`, `chainOverride`\>(`args`) => `Promise`\<`DeployContractReturnType`\>

Deploys a contract to the network, given bytecode and constructor arguments.

- Docs: https://viem.sh/docs/contract/deployContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts

##### Type Parameters

| Type Parameter |
| ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `chainOverride` *extends* `Chain` \| `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `DeployContractParameters`\<`abi`, `chain`, `account`, `chainOverride`\> | DeployContractParameters |

##### Returns

`Promise`\<`DeployContractReturnType`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. DeployContractReturnType

##### Example

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

#### dropTransaction

> **dropTransaction**: (`args`) => `Promise`\<`void`\>

Removes a transaction from the mempool.

- Docs: https://viem.sh/docs/actions/test/dropTransaction

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `DropTransactionParameters` | DropTransactionParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### dumpState

> **dumpState**: () => `Promise`\<`DumpStateReturnType`\>

Serializes the current state (including contracts code, contract's storage,
accounts properties, etc.) into a savable data blob.

- Docs: https://viem.sh/docs/actions/test/dumpState

##### Returns

`Promise`\<`DumpStateReturnType`\>

##### Example

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

#### estimateContractGas

> **estimateContractGas**: \<`chain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`EstimateContractGasReturnType`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

##### Type Parameters

| Type Parameter |
| ------ |
| `chain` *extends* `Chain` \| `undefined` |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"nonpayable"` \| `"payable"`\> |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"nonpayable"` \| `"payable"`, `functionName`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `chain`\> | EstimateContractGasParameters |

##### Returns

`Promise`\<`EstimateContractGasReturnType`\>

The gas estimate (in wei). EstimateContractGasReturnType

##### Remarks

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### estimateFeesPerGas

> **estimateFeesPerGas**: \<`chainOverride`, `type`\>(`args?`) => `Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `type` *extends* `FeeValuesType` | `"eip1559"` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | `EstimateFeesPerGasParameters`\<`chain`, `chainOverride`, `type`\> |

##### Returns

`Promise`\<`EstimateFeesPerGasReturnType`\<`type`\>\>

An estimate (in wei) for the fees per gas. EstimateFeesPerGasReturnType

##### Example

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

#### estimateGas

> **estimateGas**: (`args`) => `Promise`\<`EstimateGasReturnType`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `EstimateGasParameters`\<`chain`\> | EstimateGasParameters |

##### Returns

`Promise`\<`EstimateGasReturnType`\>

The gas estimate (in wei). EstimateGasReturnType

##### Example

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

#### estimateMaxPriorityFeePerGas

> **estimateMaxPriorityFeePerGas**: \<`chainOverride`\>(`args?`) => `Promise`\<`EstimateMaxPriorityFeePerGasReturnType`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | `EstimateMaxPriorityFeePerGasParameters`\<`chain`, `chainOverride`\> |

##### Returns

`Promise`\<`EstimateMaxPriorityFeePerGasReturnType`\>

An estimate (in wei) for the max priority fee per gas. EstimateMaxPriorityFeePerGasReturnType

##### Example

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

#### experimental\_blockTag?

> `optional` **experimental\_blockTag?**: `BlockTag`

Default block tag to use for RPC requests.

#### extend

> **extend**: \<`client`\>(`fn`) => `Client`\<`transport`, `chain`, `account`, `rpcSchema`, `Prettify`\<`client`\> & `extended` *extends* `Extended` ? `extended` : `unknown`\>

##### Type Parameters

| Type Parameter |
| ------ |
| `client` *extends* `Extended` & `ExactPartial`\<`ExtendableProtectedActions`\<`transport`, `chain`, `account`\>\> |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`client`) => `client` |

##### Returns

`Client`\<`transport`, `chain`, `account`, `rpcSchema`, `Prettify`\<`client`\> & `extended` *extends* `Extended` ? `extended` : `unknown`\>

#### fillTransaction

> **fillTransaction**: \<`chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`FillTransactionReturnType`\<`chain`, `chainOverride`\>\>

Fills a transaction request with the necessary fields to be signed over.

- Docs: https://viem.sh/docs/actions/public/fillTransaction

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `FillTransactionParameters`\<`chain`, `account`, `chainOverride`, `accountOverride`\> |

##### Returns

`Promise`\<`FillTransactionReturnType`\<`chain`, `chainOverride`\>\>

The filled transaction. FillTransactionReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.fillTransaction({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

#### getAddresses

> **getAddresses**: () => `Promise`\<`GetAddressesReturnType`\>

Returns a list of account addresses owned by the wallet or client.

- Docs: https://viem.sh/docs/actions/wallet/getAddresses
- JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)

##### Returns

`Promise`\<`GetAddressesReturnType`\>

List of account addresses owned by the wallet or client. GetAddressesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.getAddresses()
```

#### getAutomine

> **getAutomine**: () => `Promise`\<`GetAutomineReturnType`\>

Returns the automatic mining status of the node.

- Docs: https://viem.sh/docs/actions/test/getAutomine

##### Returns

`Promise`\<`GetAutomineReturnType`\>

Whether or not the node is auto mining. GetAutomineReturnType

##### Example

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

#### getBalance

> **getBalance**: (`args`) => `Promise`\<`GetBalanceReturnType`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetBalanceParameters` | GetBalanceParameters |

##### Returns

`Promise`\<`GetBalanceReturnType`\>

The balance of the address in wei. GetBalanceReturnType

##### Remarks

You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).

```ts
const balance = await getBalance(client, {
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  blockTag: 'safe'
})
const balanceAsEther = formatEther(balance)
// "6.942"
```

##### Example

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

#### getBlobBaseFee

> **getBlobBaseFee**: () => `Promise`\<`GetBlobBaseFeeReturnType`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

##### Returns

`Promise`\<`GetBlobBaseFeeReturnType`\>

The blob base fee (in wei). GetBlobBaseFeeReturnType

##### Example

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

#### getBlock

> **getBlock**: \<`includeTransactions`, `blockTag`\>(`args?`) => `Promise`\<`GetBlockReturnType`\<`chain`, `includeTransactions`, `blockTag`\>\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `includeTransactions` *extends* `boolean` | `false` |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockParameters`\<`includeTransactions`, `blockTag`\> | GetBlockParameters |

##### Returns

`Promise`\<`GetBlockReturnType`\<`chain`, `includeTransactions`, `blockTag`\>\>

Information about the block. GetBlockReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getBlock()
```

#### getBlockNumber

> **getBlockNumber**: (`args?`) => `Promise`\<`GetBlockNumberReturnType`\>

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockNumberParameters` | GetBlockNumberParameters |

##### Returns

`Promise`\<`GetBlockNumberReturnType`\>

The number of the block. GetBlockNumberReturnType

##### Example

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

#### getBlockTransactionCount

> **getBlockTransactionCount**: (`args?`) => `Promise`\<`GetBlockTransactionCountReturnType`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetBlockTransactionCountParameters` | GetBlockTransactionCountParameters |

##### Returns

`Promise`\<`GetBlockTransactionCountReturnType`\>

The block transaction count. GetBlockTransactionCountReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const count = await client.getBlockTransactionCount()
```

#### ~~getBytecode~~

> **getBytecode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetCodeParameters` |

##### Returns

`Promise`\<`GetCodeReturnType`\>

##### Deprecated

Use `getCode` instead.

#### getCallsStatus

> **getCallsStatus**: (`parameters`) => `Promise`\<`GetCallsStatusReturnType`\>

Returns the status of a call batch that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/getCallsStatus
- JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `GetCallsStatusParameters` |

##### Returns

`Promise`\<`GetCallsStatusReturnType`\>

Status of the calls. GetCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const { receipts, status } = await client.getCallsStatus({ id: '0xdeadbeef' })
```

#### getCapabilities

> **getCapabilities**: \<`chainId`\>(`parameters?`) => `Promise`\<`GetCapabilitiesReturnType`\<`chainId`\>\>

Extract capabilities that a connected wallet supports (e.g. paymasters, session keys, etc).

- Docs: https://viem.sh/docs/actions/wallet/getCapabilities
- JSON-RPC Methods: [`wallet_getCapabilities`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter |
| ------ |
| `chainId` *extends* `number` \| `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters?` | `GetCapabilitiesParameters`\<`chainId`\> |

##### Returns

`Promise`\<`GetCapabilitiesReturnType`\<`chainId`\>\>

The wallet's capabilities. GetCapabilitiesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const capabilities = await client.getCapabilities({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### getChainId

> **getChainId**: () => `Promise`\<`GetChainIdReturnType`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

##### Returns

`Promise`\<`GetChainIdReturnType`\>

The current chain ID. GetChainIdReturnType

##### Example

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

#### getCode

> **getCode**: (`args`) => `Promise`\<`GetCodeReturnType`\>

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getCode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetCodeParameters` | GetBytecodeParameters |

##### Returns

`Promise`\<`GetCodeReturnType`\>

The contract's bytecode. GetBytecodeReturnType

##### Example

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

#### getContractEvents

> **getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` | `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> |

##### Returns

`Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetContractEventsReturnType

##### Example

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

#### getDelegation

> **getDelegation**: (`args`) => `Promise`\<`GetDelegationReturnType`\>

Returns the address that an account has delegated to via EIP-7702.

- Docs: https://viem.sh/docs/actions/public/getDelegation

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetDelegationParameters` | GetDelegationParameters |

##### Returns

`Promise`\<`GetDelegationReturnType`\>

The delegated address, or undefined if not delegated. GetDelegationReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const delegation = await client.getDelegation({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### getEip712Domain

> **getEip712Domain**: (`args`) => `Promise`\<`GetEip712DomainReturnType`\>

Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetEip712DomainParameters` |

##### Returns

`Promise`\<`GetEip712DomainReturnType`\>

The EIP-712 domain, fields, and extensions. GetEip712DomainReturnType

##### Example

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

#### getEnsAddress

> **getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsAddressParameters` | GetEnsAddressParameters |

##### Returns

`Promise`\<`GetEnsAddressReturnType`\>

Address for ENS name or `null` if not found. GetEnsAddressReturnType

##### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsAvatar

> **getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsAvatarParameters` | GetEnsAvatarParameters |

##### Returns

`Promise`\<`GetEnsAvatarReturnType`\>

Avatar URI or `null` if not found. GetEnsAvatarReturnType

##### Remarks

Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsName

> **getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsNameParameters` | GetEnsNameParameters |

##### Returns

`Promise`\<`GetEnsNameReturnType`\>

Name or `null` if not found. GetEnsNameReturnType

##### Remarks

Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.

##### Example

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

#### getEnsResolver

> **getEnsResolver**: (`args`) => `Promise`\<`GetEnsResolverReturnType`\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsResolverParameters` | GetEnsResolverParameters |

##### Returns

`Promise`\<`GetEnsResolverReturnType`\>

Address for ENS resolver. GetEnsResolverReturnType

##### Remarks

Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getEnsText

> **getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetEnsTextParameters` | GetEnsTextParameters |

##### Returns

`Promise`\<`GetEnsTextReturnType`\>

Address for ENS resolver. GetEnsTextReturnType

##### Remarks

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

##### Example

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

#### getFeeHistory

> **getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFeeHistoryParameters` | GetFeeHistoryParameters |

##### Returns

`Promise`\<`GetFeeHistoryReturnType`\>

The gas estimate (in wei). GetFeeHistoryReturnType

##### Example

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

#### getFilterChanges

> **getFilterChanges**: \<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `filterType` *extends* `FilterType` | - |
| `abi` *extends* `Abi` \| readonly `unknown`[] \| `undefined` | - |
| `eventName` *extends* `string` \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFilterChangesParameters`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> | GetFilterChangesParameters |

##### Returns

`Promise`\<`GetFilterChangesReturnType`\<`filterType`, `abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Logs or hashes. GetFilterChangesReturnType

##### Remarks

A Filter can be created from the following actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

Depending on the type of filter, the return value will be different:

- If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
- If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
- If the filter was created with `createBlockFilter`, it returns a list of block hashes.

##### Examples

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

#### getFilterLogs

> **getFilterLogs**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] \| `undefined` | - |
| `eventName` *extends* `string` \| `undefined` | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetFilterLogsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\> | GetFilterLogsParameters |

##### Returns

`Promise`\<`GetFilterLogsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetFilterLogsReturnType

##### Remarks

`getFilterLogs` is only compatible with **event filters**.

##### Example

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

#### getGasPrice

> **getGasPrice**: () => `Promise`\<`GetGasPriceReturnType`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

##### Returns

`Promise`\<`GetGasPriceReturnType`\>

The gas price (in wei). GetGasPriceReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasPrice = await client.getGasPrice()
```

#### getLogs

> **getLogs**: \<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>(`args?`) => `Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |
| `toBlock` *extends* `BlockNumber` \| `BlockTag` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `GetLogsParameters`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\> | GetLogsParameters |

##### Returns

`Promise`\<`GetLogsReturnType`\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`\>\>

A list of event logs. GetLogsReturnType

##### Example

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getLogs()
```

#### getPermissions

> **getPermissions**: () => `Promise`\<`GetPermissionsReturnType`\>

Gets the wallets current permissions.

- Docs: https://viem.sh/docs/actions/wallet/getPermissions
- JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

##### Returns

`Promise`\<`GetPermissionsReturnType`\>

The wallet permissions. GetPermissionsReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const permissions = await client.getPermissions()
```

#### getProof

> **getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `GetProofParameters` |

##### Returns

`Promise`\<`GetProofReturnType`\>

Proof data. GetProofReturnType

##### Example

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

#### getStorageAt

> **getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetStorageAtParameters` | GetStorageAtParameters |

##### Returns

`Promise`\<`GetStorageAtReturnType`\>

The value of the storage slot. GetStorageAtReturnType

##### Example

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

#### getTransaction

> **getTransaction**: \<`blockTag`\>(`args`) => `Promise`\<`GetTransactionReturnType`\<`chain`, `blockTag`\>\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionParameters`\<`blockTag`\> | GetTransactionParameters |

##### Returns

`Promise`\<`GetTransactionReturnType`\<`chain`, `blockTag`\>\>

The transaction information. GetTransactionReturnType

##### Example

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

#### getTransactionConfirmations

> **getTransactionConfirmations**: (`args`) => `Promise`\<`GetTransactionConfirmationsReturnType`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionConfirmationsParameters`\<`chain`\> | GetTransactionConfirmationsParameters |

##### Returns

`Promise`\<`GetTransactionConfirmationsReturnType`\>

The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. GetTransactionConfirmationsReturnType

##### Example

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

#### getTransactionCount

> **getTransactionCount**: (`args`) => `Promise`\<`GetTransactionCountReturnType`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionCountParameters` | GetTransactionCountParameters |

##### Returns

`Promise`\<`GetTransactionCountReturnType`\>

The number of transactions an account has sent. GetTransactionCountReturnType

##### Example

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

#### getTransactionReceipt

> **getTransactionReceipt**: (`args`) => `Promise`\<`GetTransactionReceiptReturnType`\<`chain`\>\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `GetTransactionReceiptParameters` | GetTransactionReceiptParameters |

##### Returns

`Promise`\<`GetTransactionReceiptReturnType`\<`chain`\>\>

The transaction receipt. GetTransactionReceiptReturnType

##### Example

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

#### getTxpoolContent

> **getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

##### Returns

`Promise`\<`GetTxpoolContentReturnType`\>

Transaction pool content. GetTxpoolContentReturnType

##### Example

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

#### getTxpoolStatus

> **getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolStatus

##### Returns

`Promise`\<`GetTxpoolStatusReturnType`\>

Transaction pool status. GetTxpoolStatusReturnType

##### Example

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

#### impersonateAccount

> **impersonateAccount**: (`args`) => `Promise`\<`void`\>

Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.

- Docs: https://viem.sh/docs/actions/test/impersonateAccount

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ImpersonateAccountParameters` | ImpersonateAccountParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### increaseTime

> **increaseTime**: (`args`) => `Promise`\<`Quantity`\>

Jump forward in time by the given amount of time, in seconds.

- Docs: https://viem.sh/docs/actions/test/increaseTime

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `IncreaseTimeParameters` | – IncreaseTimeParameters |

##### Returns

`Promise`\<`Quantity`\>

##### Example

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

#### inspectTxpool

> **inspectTxpool**: () => `Promise`\<`InspectTxpoolReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/inspectTxpool

##### Returns

`Promise`\<`InspectTxpoolReturnType`\>

Transaction pool inspection data. InspectTxpoolReturnType

##### Example

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

#### key

> **key**: `string`

A key for the client.

#### loadState

> **loadState**: (`args`) => `Promise`\<`LoadStateReturnType`\>

Adds state previously dumped with `dumpState` to the current chain.

- Docs: https://viem.sh/docs/actions/test/loadState

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `LoadStateParameters` |

##### Returns

`Promise`\<`LoadStateReturnType`\>

##### Example

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

#### mine

> **mine**: (`args`) => `Promise`\<`void`\>

Mine a specified number of blocks.

- Docs: https://viem.sh/docs/actions/test/mine

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `MineParameters` | – MineParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### multicall

> **multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `contracts` *extends* readonly `unknown`[] | - |
| `allowFailure` *extends* `boolean` | `true` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `MulticallParameters`\<`contracts`, `allowFailure`\> | MulticallParameters |

##### Returns

`Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

An array of results with accompanying status. MulticallReturnType

##### Example

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

#### name

> **name**: `string`

A name for the client.

#### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

#### prepareAuthorization

> **prepareAuthorization**: (`parameters`) => `Promise`\<`PrepareAuthorizationReturnType`\>

Prepares an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object for signing.
This Action will fill the required fields of the Authorization object if they are not provided (e.g. `nonce` and `chainId`).

With the prepared Authorization object, you can use [`signAuthorization`](https://viem.sh/docs/eip7702/signAuthorization) to sign over the Authorization object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `PrepareAuthorizationParameters`\<`account`\> | PrepareAuthorizationParameters |

##### Returns

`Promise`\<`PrepareAuthorizationReturnType`\>

The prepared Authorization object. PrepareAuthorizationReturnType

##### Examples

```ts
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const authorization = await client.prepareAuthorization({
  account: privateKeyToAccount('0x..'),
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
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

const authorization = await client.prepareAuthorization({
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### prepareTransactionRequest

> **prepareTransactionRequest**: \<`request`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`PrepareTransactionRequestReturnType`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\>\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `PrepareTransactionRequestRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `PrepareTransactionRequestParameters`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\> | PrepareTransactionRequestParameters |

##### Returns

`Promise`\<`PrepareTransactionRequestReturnType`\<`chain`, `account`, `chainOverride`, `accountOverride`, `request`\>\>

The transaction request. PrepareTransactionRequestReturnType

##### Examples

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

#### readContract

> **readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts

##### Type Parameters

| Type Parameter |
| ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"pure"` \| `"view"`\> |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"pure"` \| `"view"`, `functionName`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ReadContractParameters`\<`abi`, `functionName`, `args`\> | ReadContractParameters |

##### Returns

`Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

The response from the contract. Type is inferred. ReadContractReturnType

##### Remarks

A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### removeBlockTimestampInterval

> **removeBlockTimestampInterval**: () => `Promise`\<`void`\>

Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.

- Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval

##### Returns

`Promise`\<`void`\>

##### Example

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

#### request

> **request**: `EIP1193RequestFn`\<`rpcSchema` *extends* `undefined` ? `EIP1474Methods` : `rpcSchema`\>

Request function wrapped with friendly error handling

#### requestAddresses

> **requestAddresses**: () => `Promise`\<`RequestAddressesReturnType`\>

Requests a list of accounts managed by a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestAddresses
- JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)

Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).

This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.

##### Returns

`Promise`\<`RequestAddressesReturnType`\>

List of accounts managed by a wallet RequestAddressesReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const accounts = await client.requestAddresses()
```

#### requestPermissions

> **requestPermissions**: (`args`) => `Promise`\<`RequestPermissionsReturnType`\>

Requests permissions for a wallet.

- Docs: https://viem.sh/docs/actions/wallet/requestPermissions
- JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `RequestPermissionsParameters` | RequestPermissionsParameters |

##### Returns

`Promise`\<`RequestPermissionsReturnType`\>

The wallet permissions. RequestPermissionsReturnType

##### Example

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

#### reset

> **reset**: (`args?`) => `Promise`\<`void`\>

Resets fork back to its original state.

- Docs: https://viem.sh/docs/actions/test/reset

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args?` | `ResetParameters` | – ResetParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### revert

> **revert**: (`args`) => `Promise`\<`void`\>

Revert the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/revert

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `RevertParameters` | – RevertParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### sendCalls

> **sendCalls**: \<`calls`, `chainOverride`\>(`parameters`) => `Promise`\<`SendCallsReturnType`\>

Requests the connected wallet to send a batch of calls.

- Docs: https://viem.sh/docs/actions/wallet/sendCalls
- JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `calls` *extends* readonly `unknown`[] | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `SendCallsParameters`\<`chain`, `account`, `chainOverride`, `calls`\> |

##### Returns

`Promise`\<`SendCallsReturnType`\>

Transaction identifier. SendCallsReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const id = await client.sendCalls({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  calls: [
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 69420n,
    },
  ],
})
```

#### sendCallsSync

> **sendCallsSync**: \<`calls`, `chainOverride`\>(`parameters`) => `Promise`\<`SendCallsSyncReturnType`\>

Requests the connected wallet to send a batch of calls, and waits for the calls to be included in a block.

- Docs: https://viem.sh/docs/actions/wallet/sendCallsSync
- JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `calls` *extends* readonly `unknown`[] | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `SendCallsSyncParameters`\<`chain`, `account`, `chainOverride`, `calls`\> |

##### Returns

`Promise`\<`SendCallsSyncReturnType`\>

Calls status. SendCallsSyncReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const status = await client.sendCallsSync({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  calls: [
    {
      data: '0xdeadbeef',
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 69420n,
    },
  ],
})
```

#### sendRawTransaction

> **sendRawTransaction**: (`args`) => `Promise`\<`SendRawTransactionReturnType`\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SendRawTransactionParameters` |

##### Returns

`Promise`\<`SendRawTransactionReturnType`\>

The transaction hash. SendRawTransactionReturnType

##### Example

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

#### sendRawTransactionSync

> **sendRawTransactionSync**: (`args`) => `Promise`\<`SendRawTransactionSyncReturnType`\<`chain`\>\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransactionSync
- JSON-RPC Method: [`eth_sendRawTransactionSync`](https://eips.ethereum.org/EIPS/eip-7966)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SendRawTransactionSyncParameters` |

##### Returns

`Promise`\<`SendRawTransactionSyncReturnType`\<`chain`\>\>

The transaction receipt. SendRawTransactionSyncReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { sendRawTransactionSync } from 'viem/wallet'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const receipt = await client.sendRawTransactionSync({
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
})
```

#### sendTransaction

> **sendTransaction**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<`SendTransactionReturnType`\>

Creates, signs, and sends a new transaction to the network.

- Docs: https://viem.sh/docs/actions/wallet/sendTransaction
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
  - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `SendTransactionRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendTransactionParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SendTransactionParameters |

##### Returns

`Promise`\<`SendTransactionReturnType`\>

The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. SendTransactionReturnType

##### Examples

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

#### sendTransactionSync

> **sendTransactionSync**: \<`request`, `chainOverride`\>(`args`) => `Promise`\<`SendTransactionSyncReturnType`\<`chain`\>\>

Creates, signs, and sends a new transaction to the network synchronously.
Returns the transaction receipt.

- Docs: https://viem.sh/docs/actions/wallet/sendTransactionSync
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
  - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `request` *extends* `SendTransactionSyncRequest`\<`chain`, `chainOverride`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendTransactionSyncParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SendTransactionParameters |

##### Returns

`Promise`\<`SendTransactionSyncReturnType`\<`chain`\>\>

The transaction receipt. SendTransactionReturnType

##### Examples

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const receipt = await client.sendTransactionSync({
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
const receipt = await client.sendTransactionSync({
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
})
```

#### sendUnsignedTransaction

> **sendUnsignedTransaction**: \<`chain`\>(`args`) => `Promise`\<`SendUnsignedTransactionReturnType`\>

Executes a transaction regardless of the signature.

- Docs: https://viem.sh/docs/actions/test/sendUnsignedTransaction

##### Type Parameters

| Type Parameter |
| ------ |
| `chain` *extends* `Chain` \| `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SendUnsignedTransactionParameters`\<`chain`\> | – SendUnsignedTransactionParameters |

##### Returns

`Promise`\<`SendUnsignedTransactionReturnType`\>

The transaction hash. SendUnsignedTransactionReturnType

##### Example

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

#### setAutomine

> **setAutomine**: (`args`) => `Promise`\<`void`\>

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

- Docs: https://viem.sh/docs/actions/test/setAutomine

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `boolean` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBalance

> **setBalance**: (`args`) => `Promise`\<`void`\>

Modifies the balance of an account.

- Docs: https://viem.sh/docs/actions/test/setBalance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBalanceParameters` | – SetBalanceParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBlockGasLimit

> **setBlockGasLimit**: (`args`) => `Promise`\<`void`\>

Sets the block's gas limit.

- Docs: https://viem.sh/docs/actions/test/setBlockGasLimit

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBlockGasLimitParameters` | – SetBlockGasLimitParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setBlockTimestampInterval

> **setBlockTimestampInterval**: (`args`) => `Promise`\<`void`\>

Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

- Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetBlockTimestampIntervalParameters` | – SetBlockTimestampIntervalParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setCode

> **setCode**: (`args`) => `Promise`\<`void`\>

Modifies the bytecode stored at an account's address.

- Docs: https://viem.sh/docs/actions/test/setCode

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetCodeParameters` | – SetCodeParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setCoinbase

> **setCoinbase**: (`args`) => `Promise`\<`void`\>

Sets the coinbase address to be used in new blocks.

- Docs: https://viem.sh/docs/actions/test/setCoinbase

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetCoinbaseParameters` | – SetCoinbaseParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setIntervalMining

> **setIntervalMining**: (`args`) => `Promise`\<`void`\>

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.

- Docs: https://viem.sh/docs/actions/test/setIntervalMining

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetIntervalMiningParameters` | – SetIntervalMiningParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setLoggingEnabled

> **setLoggingEnabled**: (`args`) => `Promise`\<`void`\>

Enable or disable logging on the test node network.

- Docs: https://viem.sh/docs/actions/test/setLoggingEnabled

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `boolean` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setMinGasPrice

> **setMinGasPrice**: (`args`) => `Promise`\<`void`\>

Change the minimum gas price accepted by the network (in wei).

- Docs: https://viem.sh/docs/actions/test/setMinGasPrice

Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetMinGasPriceParameters` | – SetBlockGasLimitParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNextBlockBaseFeePerGas

> **setNextBlockBaseFeePerGas**: (`args`) => `Promise`\<`void`\>

Sets the next block's base fee per gas.

- Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNextBlockBaseFeePerGasParameters` | – SetNextBlockBaseFeePerGasParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNextBlockTimestamp

> **setNextBlockTimestamp**: (`args`) => `Promise`\<`void`\>

Sets the next block's timestamp.

- Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNextBlockTimestampParameters` | – SetNextBlockTimestampParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setNonce

> **setNonce**: (`args`) => `Promise`\<`void`\>

Modifies (overrides) the nonce of an account.

- Docs: https://viem.sh/docs/actions/test/setNonce

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetNonceParameters` | – SetNonceParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setRpcUrl

> **setRpcUrl**: (`args`) => `Promise`\<`void`\>

Sets the backend RPC URL.

- Docs: https://viem.sh/docs/actions/test/setRpcUrl

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `string` |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### setStorageAt

> **setStorageAt**: (`args`) => `Promise`\<`void`\>

Writes to a slot of an account's storage.

- Docs: https://viem.sh/docs/actions/test/setStorageAt

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SetStorageAtParameters` | – SetStorageAtParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### showCallsStatus

> **showCallsStatus**: (`parameters`) => `Promise`\<`ShowCallsStatusReturnType`\>

Requests for the wallet to show information about a call batch
that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/showCallsStatus
- JSON-RPC Methods: [`wallet_showCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `ShowCallsStatusParameters` |

##### Returns

`Promise`\<`ShowCallsStatusReturnType`\>

Displays status of the calls in wallet. ShowCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

await client.showCallsStatus({ id: '0xdeadbeef' })
```

#### signAuthorization

> **signAuthorization**: (`parameters`) => `Promise`\<`SignAuthorizationReturnType`\>

Signs an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object.

With the calculated signature, you can:
- use [`verifyAuthorization`](https://viem.sh/docs/eip7702/verifyAuthorization) to verify the signed Authorization object,
- use [`recoverAuthorizationAddress`](https://viem.sh/docs/eip7702/recoverAuthorizationAddress) to recover the signing address from the signed Authorization object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `SignAuthorizationParameters`\<`account`\> | SignAuthorizationParameters |

##### Returns

`Promise`\<`SignAuthorizationReturnType`\>

The signed Authorization object. SignAuthorizationReturnType

##### Examples

```ts
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const signature = await client.signAuthorization({
  account: privateKeyToAccount('0x..'),
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
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

const signature = await client.signAuthorization({
  contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

#### signMessage

> **signMessage**: (`args`) => `Promise`\<`SignMessageReturnType`\>

Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signMessage
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
  - Local Accounts: Signs locally. No JSON-RPC request.

With the calculated signature, you can:
- use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
- use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignMessageParameters`\<`account`\> | SignMessageParameters |

##### Returns

`Promise`\<`SignMessageReturnType`\>

The signed message. SignMessageReturnType

##### Examples

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

#### signTransaction

> **signTransaction**: \<`chainOverride`, `request`\>(`args`) => `Promise`\<`SignTransactionReturnType`\<`request`\>\>

Signs a transaction.

- Docs: https://viem.sh/docs/actions/wallet/signTransaction
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
  - Local Accounts: Signs locally. No JSON-RPC request.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `chainOverride` *extends* `Chain` \| `undefined` | - |
| `request` *extends* `SignTransactionRequest`\<`chain`, `chainOverride`\> | `SignTransactionRequest`\<`chain`, `chainOverride`\> |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignTransactionParameters`\<`chain`, `account`, `chainOverride`, `request`\> | SignTransactionParameters |

##### Returns

`Promise`\<`SignTransactionReturnType`\<`request`\>\>

The signed message. SignTransactionReturnType

##### Examples

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

#### signTypedData

> **signTypedData**: \<`typedData`, `primaryType`\>(`args`) => `Promise`\<`SignTypedDataReturnType`\>

Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.

- Docs: https://viem.sh/docs/actions/wallet/signTypedData
- JSON-RPC Methods:
  - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
  - Local Accounts: Signs locally. No JSON-RPC request.

##### Type Parameters

| Type Parameter |
| ------ |
| `typedData` *extends* `TypedData` \| \{\[`key`: `string`\]: `unknown`; \} |
| `primaryType` *extends* `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SignTypedDataParameters`\<`typedData`, `primaryType`, `account`\> | SignTypedDataParameters |

##### Returns

`Promise`\<`SignTypedDataReturnType`\>

The signed data. SignTypedDataReturnType

##### Examples

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

#### ~~simulate~~

> **simulate**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateBlocksParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

##### Deprecated

Use `simulateBlocks` instead.

#### simulateBlocks

> **simulateBlocks**: \<`calls`\>(`args`) => `Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulates a set of calls on block(s) with optional block and state overrides.

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateBlocksParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateBlocksReturnType`\<`calls`\>\>

Simulated blocks. SimulateReturnType

##### Example

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

#### simulateCalls

> **simulateCalls**: \<`calls`\>(`args`) => `Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Simulates a set of calls.

##### Type Parameters

| Type Parameter |
| ------ |
| `calls` *extends* readonly `unknown`[] |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `SimulateCallsParameters`\<`calls`\> |

##### Returns

`Promise`\<`SimulateCallsReturnType`\<`calls`\>\>

Results. SimulateCallsReturnType

##### Example

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

#### simulateContract

> **simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"nonpayable"` \| `"payable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"nonpayable"` \| `"payable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | - |
| `accountOverride` *extends* `Account` \| `Address` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SimulateContractParameters`\<`abi`, `functionName`, `args`, `chain`, `chainOverride`, `accountOverride`\> | SimulateContractParameters |

##### Returns

`Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`, `accountOverride`\>\>

The simulation result and write request. SimulateContractReturnType

##### Remarks

This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

##### Example

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

#### snapshot

> **snapshot**: () => `Promise`\<`Quantity`\>

Snapshot the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/snapshot

##### Returns

`Promise`\<`Quantity`\>

##### Example

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

#### stopImpersonatingAccount

> **stopImpersonatingAccount**: (`args`) => `Promise`\<`void`\>

Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).

- Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `StopImpersonatingAccountParameters` | – StopImpersonatingAccountParameters |

##### Returns

`Promise`\<`void`\>

##### Example

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

#### switchChain

> **switchChain**: (`args`) => `Promise`\<`void`\>

Switch the target chain in a wallet.

- Docs: https://viem.sh/docs/actions/wallet/switchChain
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `SwitchChainParameters` | SwitchChainParameters |

##### Returns

`Promise`\<`void`\>

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet, optimism } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
await client.switchChain({ id: optimism.id })
```

#### tevmCall

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

Low-level call/transaction API. To send a transaction (rather than a call), pass `createTransaction: true`
and mine the result (or use `miningConfig: { type: 'auto' }`). Supports impersonation (`from`/`caller`/`origin`),
`depth`, `createTrace`, `createAccessList`, and more.

##### See

 - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
 - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/)

#### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

Higher-level contract call: handles ABI encoding/decoding and revert messages. Same options as
`tevmCall` apply (impersonation, tracing, access list, `createTransaction`).

##### See

 - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)
 - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/)

#### tevmDeal

> **tevmDeal**: `TevmActionsApi`\[`"deal"`\]

Convenience wrapper over `tevmSetAccount` for setting ETH or ERC20 balances.

##### See

 - [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/)
 - [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/)

##### Example

```typescript
await client.tevmDeal({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000n,
})
```

#### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

Deploys a contract with encoded constructor arguments. Inherits all `tevmCall` options.

##### See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/)
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/)

#### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

Dumps the EVM state as a JSON-serializable object for persistence.

#### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

Reads an account's state. Storage is only included if `returnStorage: true`, and in fork mode only
already-cached slots are returned.

##### See

 - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/)
 - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/)

#### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

Loads a previously dumped state into the EVM.

#### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

Mines pending transactions into a new block. Required in manual mining mode to advance canonical state.

#### tevmReady

> **tevmReady**: () => `Promise`\<`true`\>

Resolves when the TEVM is ready. All other actions await this implicitly. Equivalent to `client.transport.tevm.ready()`.

##### Returns

`Promise`\<`true`\>

#### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

Directly sets any property of an account (balance, nonce, deployedBytecode, storage).

##### See

 - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/)
 - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/)

#### transport

> **transport**: `ReturnType`\<`transport`\>\[`"config"`\] & `ReturnType`\<`transport`\>\[`"value"`\]

The RPC transport

#### type

> **type**: `string`

The type of client.

#### uid

> **uid**: `string`

A unique ID for the client.

#### uninstallFilter

> **uninstallFilter**: (`args`) => `Promise`\<`UninstallFilterReturnType`\>

Destroys a Filter that was created from one of the following Actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

- Docs: https://viem.sh/docs/actions/public/uninstallFilter
- JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `UninstallFilterParameters` | UninstallFilterParameters |

##### Returns

`Promise`\<`UninstallFilterReturnType`\>

A boolean indicating if the Filter was successfully uninstalled. UninstallFilterReturnType

##### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

#### verifyHash

> **verifyHash**: (`args`) => `Promise`\<`VerifyHashReturnType`\>

Verify that a hash was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyHash](https://viem.sh/docs/actions/public/verifyHash)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyHashParameters` |

##### Returns

`Promise`\<`VerifyHashReturnType`\>

Whether or not the signature is valid. VerifyHashReturnType

#### verifyMessage

> **verifyMessage**: (`args`) => `Promise`\<`VerifyMessageReturnType`\>

Verify that a message was signed by the provided address.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/actions/public/verifyMessage](https://viem.sh/docs/actions/public/verifyMessage)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyMessageParameters` |

##### Returns

`Promise`\<`VerifyMessageReturnType`\>

Whether or not the signature is valid. VerifyMessageReturnType

#### verifySiweMessage

> **verifySiweMessage**: (`args`) => `Promise`\<`VerifySiweMessageReturnType`\>

Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.

Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).

- Docs [https://viem.sh/docs/siwe/actions/verifySiweMessage](https://viem.sh/docs/siwe/actions/verifySiweMessage)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifySiweMessageParameters` |

##### Returns

`Promise`\<`VerifySiweMessageReturnType`\>

Whether or not the signature is valid. VerifySiweMessageReturnType

#### verifyTypedData

> **verifyTypedData**: (`args`) => `Promise`\<`VerifyTypedDataReturnType`\>

Verify that typed data was signed by the provided address.

- Docs [https://viem.sh/docs/actions/public/verifyTypedData](https://viem.sh/docs/actions/public/verifyTypedData)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `VerifyTypedDataParameters` |

##### Returns

`Promise`\<`VerifyTypedDataReturnType`\>

Whether or not the signature is valid. VerifyTypedDataReturnType

#### waitForCallsStatus

> **waitForCallsStatus**: (`parameters`) => `Promise`\<`WaitForCallsStatusReturnType`\>

Waits for the status & receipts of a call bundle that was sent via `sendCalls`.

- Docs: https://viem.sh/docs/actions/wallet/waitForCallsStatus
- JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parameters` | `WaitForCallsStatusParameters` | WaitForCallsStatusParameters |

##### Returns

`Promise`\<`WaitForCallsStatusReturnType`\>

Status & receipts of the call bundle. WaitForCallsStatusReturnType

##### Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const { receipts, status } = await waitForCallsStatus(client, { id: '0xdeadbeef' })
```

#### waitForTransactionReceipt

> **waitForTransactionReceipt**: (`args`) => `Promise`\<`WaitForTransactionReceiptReturnType`\<`chain`\>\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WaitForTransactionReceiptParameters`\<`chain`\> | WaitForTransactionReceiptParameters |

##### Returns

`Promise`\<`WaitForTransactionReceiptReturnType`\<`chain`\>\>

The transaction receipt. WaitForTransactionReceiptReturnType

##### Remarks

The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).

Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.

There are 3 types of Transaction Replacement reasons:

- `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
- `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
- `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)

##### Example

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

#### watchAsset

> **watchAsset**: (`args`) => `Promise`\<`WatchAssetReturnType`\>

Adds an EVM chain to the wallet.

- Docs: https://viem.sh/docs/actions/wallet/watchAsset
- JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchAssetParameters` | WatchAssetParameters |

##### Returns

`Promise`\<`WatchAssetReturnType`\>

Boolean indicating if the token was successfully added. WatchAssetReturnType

##### Example

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

#### watchBlockNumber

> **watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchBlockNumberParameters` | WatchBlockNumberParameters |

##### Returns

`WatchBlockNumberReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlockNumberReturnType

##### Example

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

#### watchBlocks

> **watchBlocks**: \<`includeTransactions`, `blockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `includeTransactions` *extends* `boolean` | `false` |
| `blockTag` *extends* `BlockTag` | `"latest"` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchBlocksParameters`\<`transport`, `chain`, `includeTransactions`, `blockTag`\> | WatchBlocksParameters |

##### Returns

`WatchBlocksReturnType`

A function that can be invoked to stop watching for new block numbers. WatchBlocksReturnType

##### Example

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

#### watchContractEvent

> **watchContractEvent**: \<`abi`, `eventName`, `strict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `eventName` *extends* `ContractEventName`\<`abi`\> | - |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchContractEventParameters`\<`abi`, `eventName`, `strict`, `transport`\> | WatchContractEventParameters |

##### Returns

`WatchContractEventReturnType`

A function that can be invoked to stop watching for new event logs. WatchContractEventReturnType

##### Remarks

This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).

`watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

##### Example

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

#### watchEvent

> **watchEvent**: \<`abiEvent`, `abiEvents`, `strict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abiEvent` *extends* `AbiEvent` \| `undefined` | `undefined` |
| `abiEvents` *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `abiEvent` *extends* `AbiEvent` ? \[`abiEvent`\] : `undefined` |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchEventParameters`\<`abiEvent`, `abiEvents`, `strict`, `transport`\> | WatchEventParameters |

##### Returns

`WatchEventReturnType`

A function that can be invoked to stop watching for new Event Logs. WatchEventReturnType

##### Remarks

This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).

`watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

##### Example

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

#### watchPendingTransactions

> **watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WatchPendingTransactionsParameters`\<`transport`\> | WatchPendingTransactionsParameters |

##### Returns

`WatchPendingTransactionsReturnType`

A function that can be invoked to stop watching for new pending transaction hashes. WatchPendingTransactionsReturnType

##### Remarks

This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).

##### Example

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

#### writeContract

> **writeContract**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<`WriteContractReturnType`\>

Executes a write function on a contract.

- Docs: https://viem.sh/docs/contract/writeContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.

Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

__Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"payable"` \| `"nonpayable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"payable"` \| `"nonpayable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteContractParameters`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`\> | WriteContractParameters |

##### Returns

`Promise`\<`WriteContractReturnType`\>

A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). WriteContractReturnType

##### Examples

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

#### writeContractSync

> **writeContractSync**: \<`abi`, `functionName`, `args`, `chainOverride`\>(`args`) => `Promise`\<`WriteContractSyncReturnType`\>

Executes a write function on a contract synchronously.
Returns the transaction receipt.

- Docs: https://viem.sh/docs/contract/writeContract

A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.

Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

__Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* `Abi` \| readonly `unknown`[] | - |
| `functionName` *extends* `ContractFunctionName`\<`abi`, `"payable"` \| `"nonpayable"`\> | - |
| `args` *extends* `ContractFunctionArgs`\<`abi`, `"payable"` \| `"nonpayable"`, `functionName`\> | - |
| `chainOverride` *extends* `Chain` \| `undefined` | `undefined` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteContractSyncParameters`\<`abi`, `functionName`, `args`, `chain`, `account`, `chainOverride`\> | WriteContractSyncParameters |

##### Returns

`Promise`\<`WriteContractSyncReturnType`\>

A [Transaction Receipt](https://viem.sh/docs/glossary/terms#receipt). WriteContractSyncReturnType

##### Example

```ts
import { createWalletClient, custom, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const receipt = await client.writeContractSync({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
})
```

## Template

The common chain configuration, extending both `Common` and `Chain`.

## Template

The account or address type for the client.

## Template

The RPC schema type, defaults to `TevmRpcSchema`.

## See

 - [MemoryClient](MemoryClient.md)
 - [MemoryClientOptions](MemoryClientOptions.md)
