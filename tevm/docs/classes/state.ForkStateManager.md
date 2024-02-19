[tevm](../README.md) / [Modules](../modules.md) / [state](../modules/state.md) / ForkStateManager

# Class: ForkStateManager

[state](../modules/state.md).ForkStateManager

State manager that forks state from an external provider.
Any state fetched from external provider is cached locally.
The block number is held constant at the block number provided in the constructor.
The state manager can be reset by providing a new block number.

**`Example`**

```ts
import { ForkStateManager } from '@tevm/state'
import { createMemoryClient } from 'tevm/vm'

const stateManager = new ForkStateManager({
  url: 'https://mainnet.optimism.io',
  blockTag: 'latest'
})
```

**`See`**

 - [ForkStateManagerOpts](../interfaces/index.ForkStateManagerOpts.md) for configuration options
 - NormalStateManager for a state manager that does not fork state
 - ProxyStateManager for a provider that uses latest state rather than creating a fork

## Implements

- [`TevmStateManagerInterface`](../interfaces/state.TevmStateManagerInterface.md)

## Table of contents

### Constructors

- [constructor](state.ForkStateManager.md#constructor)

### Properties

- [\_accountCache](state.ForkStateManager.md#_accountcache)
- [\_blockTag](state.ForkStateManager.md#_blocktag)
- [\_contractCache](state.ForkStateManager.md#_contractcache)
- [\_storageCache](state.ForkStateManager.md#_storagecache)
- [client](state.ForkStateManager.md#client)
- [dumpCanonicalGenesis](state.ForkStateManager.md#dumpcanonicalgenesis)
- [generateCanonicalGenesis](state.ForkStateManager.md#generatecanonicalgenesis)
- [getAccountAddresses](state.ForkStateManager.md#getaccountaddresses)
- [getStateRoot](state.ForkStateManager.md#getstateroot)
- [hasStateRoot](state.ForkStateManager.md#hasstateroot)
- [opts](state.ForkStateManager.md#opts)
- [originalStorageCache](state.ForkStateManager.md#originalstoragecache)
- [setStateRoot](state.ForkStateManager.md#setstateroot)

### Methods

- [accountExists](state.ForkStateManager.md#accountexists)
- [checkpoint](state.ForkStateManager.md#checkpoint)
- [clearCaches](state.ForkStateManager.md#clearcaches)
- [clearContractStorage](state.ForkStateManager.md#clearcontractstorage)
- [commit](state.ForkStateManager.md#commit)
- [deepCopy](state.ForkStateManager.md#deepcopy)
- [deleteAccount](state.ForkStateManager.md#deleteaccount)
- [dumpStorage](state.ForkStateManager.md#dumpstorage)
- [dumpStorageRange](state.ForkStateManager.md#dumpstoragerange)
- [flush](state.ForkStateManager.md#flush)
- [getAccount](state.ForkStateManager.md#getaccount)
- [getAccountFromProvider](state.ForkStateManager.md#getaccountfromprovider)
- [getContractCode](state.ForkStateManager.md#getcontractcode)
- [getContractStorage](state.ForkStateManager.md#getcontractstorage)
- [getProof](state.ForkStateManager.md#getproof)
- [modifyAccountFields](state.ForkStateManager.md#modifyaccountfields)
- [putAccount](state.ForkStateManager.md#putaccount)
- [putContractCode](state.ForkStateManager.md#putcontractcode)
- [putContractStorage](state.ForkStateManager.md#putcontractstorage)
- [revert](state.ForkStateManager.md#revert)
- [shallowCopy](state.ForkStateManager.md#shallowcopy)

## Constructors

### constructor

• **new ForkStateManager**(`opts`): [`ForkStateManager`](state.ForkStateManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`ForkStateManagerOpts`](../interfaces/index.ForkStateManagerOpts.md) |

#### Returns

[`ForkStateManager`](state.ForkStateManager.md)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:45

## Properties

### \_accountCache

• `Protected` **\_accountCache**: `AccountCache`

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:37

___

### \_blockTag

• `Protected` **\_blockTag**: \{ `blockNumber`: `bigint`  } \| \{ `blockTag`: [`BlockTag`](../modules/index.md#blocktag)  }

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:38

___

### \_contractCache

• `Protected` **\_contractCache**: `Map`\<`string`, `Uint8Array`\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:35

___

### \_storageCache

• `Protected` **\_storageCache**: `StorageCache`

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:36

___

### client

• `Protected` **client**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `undefined` | The Account of the Client. |
| `batch?` | \{ `multicall?`: `boolean` \| \{ `batchSize?`: `number` ; `wait?`: `number`  }  } | Flags for batch settings. |
| `batch.multicall?` | `boolean` \| \{ `batchSize?`: `number` ; `wait?`: `number`  } | Toggle to enable `eth_call` multicall aggregation. |
| `cacheTime` | `number` | Time (in ms) that cached data will remain in memory. |
| `call` | (`parameters`: `CallParameters`\<`undefined` \| `Chain`\>) => `Promise`\<`CallReturnType`\> | Executes a new message call immediately without submitting a transaction to the network. - Docs: https://viem.sh/docs/actions/public/call - JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const data = await client.call({ account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', }) ``` |
| `chain` | `undefined` \| `Chain` | Chain for the client. |
| `createBlockFilter` | () => `Promise`\<\{ `id`: \`0x$\{string}\` ; `request`: `EIP1193RequestFn`\<readonly [\{ `Method`: ``"eth_getFilterChanges"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: \`0x$\{string}\`[] \| `RpcLog`[]  }, \{ `Method`: ``"eth_getFilterLogs"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: `RpcLog`[]  }, \{ `Method`: ``"eth_uninstallFilter"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: `boolean`  }]\> ; `type`: ``"block"``  }\> | Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges). - Docs: https://viem.sh/docs/actions/public/createBlockFilter - JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter) **`Example`** ```ts import { createPublicClient, createBlockFilter, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await createBlockFilter(client) // { id: "0x345a6572337856574a76364e457a4366", type: 'block' } ``` |
| `createContractEventFilter` | \<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock\>(`args`: `CreateContractEventFilterParameters`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>) => `Promise`\<`CreateContractEventFilterReturnType`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>\> | Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs). - Docs: https://viem.sh/docs/contract/createContractEventFilter **`Example`** ```ts import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createContractEventFilter({ abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']), }) ``` |
| `createEventFilter` | \<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock, _EventName, _Args\>(`args?`: [`CreateEventFilterParameters`](../modules/index.md#createeventfilterparameters)\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>) => `Promise`\<\{ [K in string \| number \| symbol]: Filter\<"event", TAbiEvents, \_EventName, \_Args, TStrict, TFromBlock, TToBlock\>[K] }\> | Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges). - Docs: https://viem.sh/docs/actions/public/createEventFilter - JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createEventFilter({ address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2', }) ``` |
| `createPendingTransactionFilter` | () => `Promise`\<\{ `id`: \`0x$\{string}\` ; `request`: `EIP1193RequestFn`\<readonly [\{ `Method`: ``"eth_getFilterChanges"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: \`0x$\{string}\`[] \| `RpcLog`[]  }, \{ `Method`: ``"eth_getFilterLogs"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: `RpcLog`[]  }, \{ `Method`: ``"eth_uninstallFilter"`` ; `Parameters`: [filterId: \`0x$\{string}\`] ; `ReturnType`: `boolean`  }]\> ; `type`: ``"transaction"``  }\> | Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges). - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter - JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createPendingTransactionFilter() // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' } ``` |
| `estimateContractGas` | \<TChain, abi, functionName, args\>(`args`: `EstimateContractGasParameters`\<`abi`, `functionName`, `args`, `TChain`\>) => `Promise`\<`bigint`\> | Estimates the gas required to successfully execute a contract write function call. - Docs: https://viem.sh/docs/contract/estimateContractGas **`Remarks`** Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData). **`Example`** ```ts import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const gas = await client.estimateContractGas({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi: parseAbi(['function mint() public']), functionName: 'mint', account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', }) ``` |
| `estimateFeesPerGas` | \<TChainOverride, TType\>(`args?`: `EstimateFeesPerGasParameters`\<`undefined` \| `Chain`, `TChainOverride`, `TType`\>) => `Promise`\<`EstimateFeesPerGasReturnType`\> | Returns an estimate for the fees per gas for a transaction to be included in the next block. - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const maxPriorityFeePerGas = await client.estimateFeesPerGas() // { maxFeePerGas: ..., maxPriorityFeePerGas: ... } ``` |
| `estimateGas` | (`args`: `EstimateGasParameters`\<`undefined` \| `Chain`\>) => `Promise`\<`bigint`\> | Estimates the gas necessary to complete a transaction without submitting it to the network. - Docs: https://viem.sh/docs/actions/public/estimateGas - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas) **`Example`** ```ts import { createPublicClient, http, parseEther } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const gasEstimate = await client.estimateGas({ account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: parseEther('1'), }) ``` |
| `estimateMaxPriorityFeePerGas` | \<TChainOverride\>(`args?`: \{ `chain`: ``null`` \| `TChainOverride`  }) => `Promise`\<`bigint`\> | Returns an estimate for the max priority fee per gas (in wei) for a transaction to be included in the next block. - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas() // 10000000n ``` |
| `extend` | \<client\>(`fn`: (`client`: `Client`\<`Transport`, `undefined` \| `Chain`, `undefined`, `PublicRpcSchema`, `PublicActions`\<`Transport`, `undefined` \| `Chain`\>\>) => `client`) => `Client`\<`Transport`, `undefined` \| `Chain`, `undefined`, `PublicRpcSchema`, \{ [K in string \| number \| symbol]: client[K] } & `PublicActions`\<`Transport`, `undefined` \| `Chain`\>\> | - |
| `getBalance` | (`args`: `GetBalanceParameters`) => `Promise`\<`bigint`\> | Returns the balance of an address in wei. - Docs: https://viem.sh/docs/actions/public/getBalance - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance) **`Remarks`** You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther). ```ts const balance = await getBalance(client, { address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', blockTag: 'safe' }) const balanceAsEther = formatEther(balance) // "6.942" ``` **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const balance = await client.getBalance({ address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', }) // 10000000000000000000000n (wei) ``` |
| `getBlock` | \<TIncludeTransactions, TBlockTag\>(`args?`: `GetBlockParameters`\<`TIncludeTransactions`, `TBlockTag`\>) => `Promise`\<\{ `baseFeePerGas`: ``null`` \| `bigint` ; `blobGasUsed`: `bigint` ; `difficulty`: `bigint` ; `excessBlobGas`: `bigint` ; `extraData`: \`0x$\{string}\` ; `gasLimit`: `bigint` ; `gasUsed`: `bigint` ; `hash`: `TBlockTag` extends ``"pending"`` ? ``null`` : \`0x$\{string}\` ; `logsBloom`: `TBlockTag` extends ``"pending"`` ? ``null`` : \`0x$\{string}\` ; `miner`: \`0x$\{string}\` ; `mixHash`: \`0x$\{string}\` ; `nonce`: `TBlockTag` extends ``"pending"`` ? ``null`` : \`0x$\{string}\` ; `number`: `TBlockTag` extends ``"pending"`` ? ``null`` : `bigint` ; `parentHash`: \`0x$\{string}\` ; `receiptsRoot`: \`0x$\{string}\` ; `sealFields`: \`0x$\{string}\`[] ; `sha3Uncles`: \`0x$\{string}\` ; `size`: `bigint` ; `stateRoot`: \`0x$\{string}\` ; `timestamp`: `bigint` ; `totalDifficulty`: ``null`` \| `bigint` ; `transactions`: `TIncludeTransactions` extends ``true`` ? (\{ `accessList?`: `undefined` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId?`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice`: `bigint` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"legacy"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity?`: `undefined`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice`: `bigint` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip2930"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice?`: `undefined` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas`: `bigint` ; `maxPriorityFeePerGas`: `bigint` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip1559"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes`: \`0x$\{string}\`[] ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice?`: `undefined` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas`: `bigint` ; `maxFeePerGas`: `bigint` ; `maxPriorityFeePerGas`: `bigint` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip4844"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  })[] : \`0x$\{string}\`[] ; `transactionsRoot`: \`0x$\{string}\` ; `uncles`: \`0x$\{string}\`[] ; `withdrawals?`: `Withdrawal`[] ; `withdrawalsRoot?`: \`0x$\{string}\`  }\> | Returns information about a block at a block number, hash, or tag. - Docs: https://viem.sh/docs/actions/public/getBlock - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks - JSON-RPC Methods: - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`. - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const block = await client.getBlock() ``` |
| `getBlockNumber` | (`args?`: `GetBlockNumberParameters`) => `Promise`\<`bigint`\> | Returns the number of the most recent block seen. - Docs: https://viem.sh/docs/actions/public/getBlockNumber - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks - JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const blockNumber = await client.getBlockNumber() // 69420n ``` |
| `getBlockTransactionCount` | (`args?`: `GetBlockTransactionCountParameters`) => `Promise`\<`number`\> | Returns the number of Transactions at a block number, hash, or tag. - Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount - JSON-RPC Methods: - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`. - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const count = await client.getBlockTransactionCount() ``` |
| `getBytecode` | (`args`: `GetBytecodeParameters`) => `Promise`\<`GetBytecodeReturnType`\> | Retrieves the bytecode at an address. - Docs: https://viem.sh/docs/contract/getBytecode - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const code = await client.getBytecode({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', }) ``` |
| `getChainId` | () => `Promise`\<`number`\> | Returns the chain ID associated with the current network. - Docs: https://viem.sh/docs/actions/public/getChainId - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const chainId = await client.getChainId() // 1 ``` |
| `getContractEvents` | \<abi, eventName, strict, fromBlock, toBlock\>(`args`: `GetContractEventsParameters`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\> | Returns a list of event logs emitted by a contract. - Docs: https://viem.sh/docs/actions/public/getContractEvents - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { wagmiAbi } from './abi' const client = createPublicClient({ chain: mainnet, transport: http(), }) const logs = await client.getContractEvents(client, { address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi: wagmiAbi, eventName: 'Transfer' }) ``` |
| `getEnsAddress` | (`args`: \{ `blockNumber?`: `bigint` ; `blockTag?`: [`BlockTag`](../modules/index.md#blocktag) ; `coinType?`: `number` ; `gatewayUrls?`: `string`[] ; `name`: `string` ; `strict?`: `boolean` ; `universalResolverAddress?`: \`0x$\{string}\`  }) => `Promise`\<`GetEnsAddressReturnType`\> | Gets address for ENS name. - Docs: https://viem.sh/docs/ens/actions/getEnsAddress - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens **`Remarks`** Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract. Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { normalize } from 'viem/ens' const client = createPublicClient({ chain: mainnet, transport: http(), }) const ensAddress = await client.getEnsAddress({ name: normalize('wevm.eth'), }) // '0xd2135CfB216b74109775236E36d4b433F1DF507B' ``` |
| `getEnsAvatar` | (`args`: \{ `assetGatewayUrls?`: `AssetGatewayUrls` ; `blockNumber?`: `bigint` ; `blockTag?`: [`BlockTag`](../modules/index.md#blocktag) ; `gatewayUrls?`: `string`[] ; `name`: `string` ; `strict?`: `boolean` ; `universalResolverAddress?`: \`0x$\{string}\`  }) => `Promise`\<`GetEnsAvatarReturnType`\> | Gets the avatar of an ENS name. - Docs: https://viem.sh/docs/ens/actions/getEnsAvatar - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens **`Remarks`** Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`. Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { normalize } from 'viem/ens' const client = createPublicClient({ chain: mainnet, transport: http(), }) const ensAvatar = await client.getEnsAvatar({ name: normalize('wevm.eth'), }) // 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio' ``` |
| `getEnsName` | (`args`: \{ `address`: \`0x$\{string}\` ; `blockNumber?`: `bigint` ; `blockTag?`: [`BlockTag`](../modules/index.md#blocktag) ; `gatewayUrls?`: `string`[] ; `strict?`: `boolean` ; `universalResolverAddress?`: \`0x$\{string}\`  }) => `Promise`\<`GetEnsNameReturnType`\> | Gets primary name for specified address. - Docs: https://viem.sh/docs/ens/actions/getEnsName - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens **`Remarks`** Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const ensName = await client.getEnsName({ address: '0xd2135CfB216b74109775236E36d4b433F1DF507B', }) // 'wevm.eth' ``` |
| `getEnsResolver` | (`args`: \{ `blockNumber?`: `bigint` ; `blockTag?`: [`BlockTag`](../modules/index.md#blocktag) ; `name`: `string` ; `universalResolverAddress?`: \`0x$\{string}\`  }) => `Promise`\<\`0x$\{string}\`\> | Gets resolver for ENS name. - Docs: https://viem.sh/docs/ens/actions/getEnsResolver - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens **`Remarks`** Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name. Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { normalize } from 'viem/ens' const client = createPublicClient({ chain: mainnet, transport: http(), }) const resolverAddress = await client.getEnsResolver({ name: normalize('wevm.eth'), }) // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41' ``` |
| `getEnsText` | (`args`: \{ `blockNumber?`: `bigint` ; `blockTag?`: [`BlockTag`](../modules/index.md#blocktag) ; `gatewayUrls?`: `string`[] ; `key`: `string` ; `name`: `string` ; `strict?`: `boolean` ; `universalResolverAddress?`: \`0x$\{string}\`  }) => `Promise`\<`GetEnsTextReturnType`\> | Gets a text record for specified ENS name. - Docs: https://viem.sh/docs/ens/actions/getEnsResolver - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens **`Remarks`** Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract. Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { normalize } from 'viem/ens' const client = createPublicClient({ chain: mainnet, transport: http(), }) const twitterRecord = await client.getEnsText({ name: normalize('wevm.eth'), key: 'com.twitter', }) // 'wagmi_sh' ``` |
| `getFeeHistory` | (`args`: `GetFeeHistoryParameters`) => `Promise`\<`GetFeeHistoryReturnType`\> | Returns a collection of historical gas information. - Docs: https://viem.sh/docs/actions/public/getFeeHistory - JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const feeHistory = await client.getFeeHistory({ blockCount: 4, rewardPercentiles: [25, 75], }) ``` |
| `getFilterChanges` | \<TFilterType, TAbi, TEventName, TStrict, TFromBlock, TToBlock\>(`args`: `GetFilterChangesParameters`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>) => `Promise`\<`GetFilterChangesReturnType`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\> | Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called. - Docs: https://viem.sh/docs/actions/public/getFilterChanges - JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges) **`Remarks`** A Filter can be created from the following actions: - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter) - [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter) - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter) - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter) Depending on the type of filter, the return value will be different: - If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs. - If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes. - If the filter was created with `createBlockFilter`, it returns a list of block hashes. **`Example`** ```ts // Blocks import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createBlockFilter() const hashes = await client.getFilterChanges({ filter }) ``` **`Example`** ```ts // Contract Events import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createContractEventFilter({ address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']), eventName: 'Transfer', }) const logs = await client.getFilterChanges({ filter }) ``` **`Example`** ```ts // Raw Events import { createPublicClient, http, parseAbiItem } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createEventFilter({ address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'), }) const logs = await client.getFilterChanges({ filter }) ``` **`Example`** ```ts // Transactions import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createPendingTransactionFilter() const hashes = await client.getFilterChanges({ filter }) ``` |
| `getFilterLogs` | \<TAbi, TEventName, TStrict, TFromBlock, TToBlock\>(`args`: `GetFilterLogsParameters`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>) => `Promise`\<`GetFilterLogsReturnType`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\> | Returns a list of event logs since the filter was created. - Docs: https://viem.sh/docs/actions/public/getFilterLogs - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs) **`Remarks`** `getFilterLogs` is only compatible with **event filters**. **`Example`** ```ts import { createPublicClient, http, parseAbiItem } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const filter = await client.createEventFilter({ address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'), }) const logs = await client.getFilterLogs({ filter }) ``` |
| `getGasPrice` | () => `Promise`\<`bigint`\> | Returns the current price of gas (in wei). - Docs: https://viem.sh/docs/actions/public/getGasPrice - JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const gasPrice = await client.getGasPrice() ``` |
| `getLogs` | \<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock\>(`args?`: `GetLogsParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>) => `Promise`\<`GetLogsReturnType`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>\> | Returns a list of event logs matching the provided parameters. - Docs: https://viem.sh/docs/actions/public/getLogs - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/filters-and-logs/event-logs - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) **`Example`** ```ts import { createPublicClient, http, parseAbiItem } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const logs = await client.getLogs() ``` |
| `getProof` | (`args`: `GetProofParameters`) => `Promise`\<`GetProofReturnType`\> | Returns the account and storage values of the specified account including the Merkle-proof. - Docs: https://viem.sh/docs/actions/public/getProof - JSON-RPC Methods: - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const block = await client.getProof({ address: '0x...', storageKeys: ['0x...'], }) ``` |
| `getStorageAt` | (`args`: `GetStorageAtParameters`) => `Promise`\<`GetStorageAtReturnType`\> | Returns the value from a storage slot at a given address. - Docs: https://viem.sh/docs/contract/getStorageAt - JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { getStorageAt } from 'viem/contract' const client = createPublicClient({ chain: mainnet, transport: http(), }) const code = await client.getStorageAt({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', slot: toHex(0), }) ``` |
| `getTransaction` | \<TBlockTag\>(`args`: `GetTransactionParameters`\<`TBlockTag`\>) => `Promise`\<\{ `accessList?`: `undefined` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId?`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice`: `bigint` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"legacy"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity?`: `undefined`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice`: `bigint` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip2930"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes?`: `undefined` ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice?`: `undefined` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas?`: `undefined` ; `maxFeePerGas`: `bigint` ; `maxPriorityFeePerGas`: `bigint` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip1559"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  } \| \{ `accessList`: `AccessList` ; `blobVersionedHashes`: \`0x$\{string}\`[] ; `blockHash`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : \`0x$\{string}\` ; `blockNumber`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `bigint` ; `chainId`: `number` ; `from`: \`0x$\{string}\` ; `gas`: `bigint` ; `gasPrice?`: `undefined` ; `hash`: \`0x$\{string}\` ; `input`: \`0x$\{string}\` ; `maxFeePerBlobGas`: `bigint` ; `maxFeePerGas`: `bigint` ; `maxPriorityFeePerGas`: `bigint` ; `nonce`: `number` ; `r`: \`0x$\{string}\` ; `s`: \`0x$\{string}\` ; `to`: ``null`` \| \`0x$\{string}\` ; `transactionIndex`: `TBlockTag` extends ``"pending"`` ? ``true`` : ``false`` extends ``true`` ? ``null`` : `number` ; `type`: ``"eip4844"`` ; `typeHex`: ``null`` \| \`0x$\{string}\` ; `v`: `bigint` ; `value`: `bigint` ; `yParity`: `number`  }\> | Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier. - Docs: https://viem.sh/docs/actions/public/getTransaction - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions - JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const transaction = await client.getTransaction({ hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d', }) ``` |
| `getTransactionConfirmations` | (`args`: `GetTransactionConfirmationsParameters`\<`undefined` \| `Chain`\>) => `Promise`\<`bigint`\> | Returns the number of blocks passed (confirmations) since the transaction was processed on a block. - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions - JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const confirmations = await client.getTransactionConfirmations({ hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d', }) ``` |
| `getTransactionCount` | (`args`: `GetTransactionCountParameters`) => `Promise`\<`number`\> | Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent. - Docs: https://viem.sh/docs/actions/public/getTransactionCount - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const transactionCount = await client.getTransactionCount({ address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', }) ``` |
| `getTransactionReceipt` | (`args`: `GetTransactionReceiptParameters`) => `Promise`\<`TransactionReceipt`\> | Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. - Docs: https://viem.sh/docs/actions/public/getTransactionReceipt - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions - JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const transactionReceipt = await client.getTransactionReceipt({ hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d', }) ``` |
| `key` | `string` | A key for the client. |
| `multicall` | \<contracts, allowFailure\>(`args`: `MulticallParameters`\<`contracts`, `allowFailure`\>) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\> | Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall). - Docs: https://viem.sh/docs/contract/multicall **`Example`** ```ts import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const abi = parseAbi([ 'function balanceOf(address) view returns (uint256)', 'function totalSupply() view returns (uint256)', ]) const result = await client.multicall({ contracts: [ { address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi, functionName: 'balanceOf', args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'], }, { address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi, functionName: 'totalSupply', }, ], }) // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }] ``` |
| `name` | `string` | A name for the client. |
| `pollingInterval` | `number` | Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds. |
| `prepareTransactionRequest` | \<TParameterType, TChainOverride, TAccountOverride\>(`args`: `PrepareTransactionRequestParameters`\<`undefined` \| `Chain`, `undefined` \| [`Account`](../modules/index.md#account), `TChainOverride`, `TAccountOverride`, `TParameterType`\>) => `Promise`\<`PrepareTransactionRequestReturnType`\<`Chain`, `undefined` \| [`Account`](../modules/index.md#account), `TChainOverride`, `TAccountOverride`, `TParameterType`\>\> | Prepares a transaction request for signing. - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest **`Example`** ```ts import { createWalletClient, custom } from 'viem' import { mainnet } from 'viem/chains' const client = createWalletClient({ chain: mainnet, transport: custom(window.ethereum), }) const request = await client.prepareTransactionRequest({ account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', to: '0x0000000000000000000000000000000000000000', value: 1n, }) ``` **`Example`** ```ts // Account Hoisting import { createWalletClient, http } from 'viem' import { privateKeyToAccount } from 'viem/accounts' import { mainnet } from 'viem/chains' const client = createWalletClient({ account: privateKeyToAccount('0x…'), chain: mainnet, transport: custom(window.ethereum), }) const request = await client.prepareTransactionRequest({ to: '0x0000000000000000000000000000000000000000', value: 1n, }) ``` |
| `readContract` | \<abi, functionName, args\>(`args`: `ReadContractParameters`\<`abi`, `functionName`, `args`\>) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\> | Calls a read-only function on a contract, and returns the response. - Docs: https://viem.sh/docs/contract/readContract - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/reading-contracts **`Remarks`** A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas. Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData). **`Example`** ```ts import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' import { readContract } from 'viem/contract' const client = createPublicClient({ chain: mainnet, transport: http(), }) const result = await client.readContract({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi: parseAbi(['function balanceOf(address) view returns (uint256)']), functionName: 'balanceOf', args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'], }) // 424122n ``` |
| `request` | `EIP1193RequestFn`\<`PublicRpcSchema`\> | Request function wrapped with friendly error handling |
| `sendRawTransaction` | (`args`: `SendRawTransactionParameters`) => `Promise`\<\`0x$\{string}\`\> | Sends a **signed** transaction to the network - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts import { createWalletClient, custom } from 'viem' import { mainnet } from 'viem/chains' import { sendRawTransaction } from 'viem/wallet' const client = createWalletClient({ chain: mainnet, transport: custom(window.ethereum), }) const hash = await client.sendRawTransaction({ serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33' }) ``` |
| `simulateContract` | \<abi, functionName, args, chainOverride, accountOverride\>(`args`: `SimulateContractParameters`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `chainOverride`, `accountOverride`\>) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `undefined` \| [`Account`](../modules/index.md#account), `chainOverride`, `accountOverride`\>\> | Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions. - Docs: https://viem.sh/docs/contract/simulateContract - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts **`Remarks`** This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions. Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData). **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const result = await client.simulateContract({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi: parseAbi(['function mint(uint32) view returns (uint32)']), functionName: 'mint', args: ['69420'], account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', }) ``` |
| `transport` | `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\> | The RPC transport |
| `type` | `string` | The type of client. |
| `uid` | `string` | A unique ID for the client. |
| `uninstallFilter` | (`args`: `UninstallFilterParameters`) => `Promise`\<`boolean`\> | Destroys a Filter that was created from one of the following Actions: - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter) - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter) - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter) - Docs: https://viem.sh/docs/actions/public/uninstallFilter - JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' import { createPendingTransactionFilter, uninstallFilter } from 'viem/public' const filter = await client.createPendingTransactionFilter() const uninstalled = await client.uninstallFilter({ filter }) // true ``` |
| `verifyMessage` | (`args`: `VerifyMessageParameters`) => `Promise`\<`boolean`\> | - |
| `verifyTypedData` | (`args`: `VerifyTypedDataParameters`) => `Promise`\<`boolean`\> | - |
| `waitForTransactionReceipt` | (`args`: `WaitForTransactionReceiptParameters`\<`undefined` \| `Chain`\>) => `Promise`\<`TransactionReceipt`\> | Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error. - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions - JSON-RPC Methods: - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed. - If a Transaction has been replaced: - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions - Checks if one of the Transactions is a replacement - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt). **`Remarks`** The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions). Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce. There are 3 types of Transaction Replacement reasons: - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`) - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`) - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`) **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const transactionReceipt = await client.waitForTransactionReceipt({ hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d', }) ``` |
| `watchBlockNumber` | (`args`: `WatchBlockNumberParameters`) => `WatchBlockNumberReturnType` | Watches and returns incoming block numbers. - Docs: https://viem.sh/docs/actions/public/watchBlockNumber - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks - JSON-RPC Methods: - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval. - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const unwatch = await client.watchBlockNumber({ onBlockNumber: (blockNumber) => console.log(blockNumber), }) ``` |
| `watchBlocks` | \<TIncludeTransactions, TBlockTag\>(`args`: `WatchBlocksParameters`\<`Transport`, `undefined` \| `Chain`, `TIncludeTransactions`, `TBlockTag`\>) => `WatchBlocksReturnType` | Watches and returns information for incoming blocks. - Docs: https://viem.sh/docs/actions/public/watchBlocks - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks - JSON-RPC Methods: - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval. - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const unwatch = await client.watchBlocks({ onBlock: (block) => console.log(block), }) ``` |
| `watchContractEvent` | \<TAbi, TEventName, TStrict\>(`args`: `WatchContractEventParameters`\<`TAbi`, `TEventName`, `TStrict`, `Transport`\>) => `WatchContractEventReturnType` | Watches and returns emitted contract event logs. - Docs: https://viem.sh/docs/contract/watchContractEvent **`Remarks`** This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs). `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead. **`Example`** ```ts import { createPublicClient, http, parseAbi } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const unwatch = client.watchContractEvent({ address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']), eventName: 'Transfer', args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' }, onLogs: (logs) => console.log(logs), }) ``` |
| `watchEvent` | \<TAbiEvent, TAbiEvents, TStrict\>(`args`: `WatchEventParameters`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `Transport`\>) => `WatchEventReturnType` | Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log). - Docs: https://viem.sh/docs/actions/public/watchEvent - JSON-RPC Methods: - **RPC Provider supports `eth_newFilter`:** - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize). - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges). - **RPC Provider does not support `eth_newFilter`:** - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval. **`Remarks`** This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs). `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead. **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const unwatch = client.watchEvent({ onLogs: (logs) => console.log(logs), }) ``` |
| `watchPendingTransactions` | (`args`: `WatchPendingTransactionsParameters`\<`Transport`\>) => `WatchPendingTransactionsReturnType` | Watches and returns pending transaction hashes. - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions - JSON-RPC Methods: - When `poll: true` - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter. - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval. - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event. **`Remarks`** This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions). **`Example`** ```ts import { createPublicClient, http } from 'viem' import { mainnet } from 'viem/chains' const client = createPublicClient({ chain: mainnet, transport: http(), }) const unwatch = await client.watchPendingTransactions({ onTransactions: (hashes) => console.log(hashes), }) ``` |

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:44

___

### dumpCanonicalGenesis

• **dumpCanonicalGenesis**: () => `Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

Dumps the state of the state manager as a [SerializableTevmState](../modules/index.md#serializabletevmstate)

#### Type declaration

▸ (): `Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

Dumps the state of the state manager as a [SerializableTevmState](../modules/index.md#serializabletevmstate)

##### Returns

`Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:188

___

### generateCanonicalGenesis

• **generateCanonicalGenesis**: (`state`: [`SerializableTevmState`](../modules/index.md#serializabletevmstate)) => `Promise`\<`void`\>

Loads a [SerializableTevmState](../modules/index.md#serializabletevmstate) into the state manager

#### Type declaration

▸ (`state`): `Promise`\<`void`\>

Loads a [SerializableTevmState](../modules/index.md#serializabletevmstate) into the state manager

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SerializableTevmState`](../modules/index.md#serializabletevmstate) |

##### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[generateCanonicalGenesis](../interfaces/state.TevmStateManagerInterface.md#generatecanonicalgenesis)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:184

___

### getAccountAddresses

• **getAccountAddresses**: () => \`0x$\{string}\`[]

#### Type declaration

▸ (): \`0x$\{string}\`[]

##### Returns

\`0x$\{string}\`[]

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getAccountAddresses](../interfaces/state.TevmStateManagerInterface.md#getaccountaddresses)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:180

___

### getStateRoot

• **getStateRoot**: () => `Promise`\<`Uint8Array`\>

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Type declaration

▸ (): `Promise`\<`Uint8Array`\>

##### Returns

`Promise`\<`Uint8Array`\>

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getStateRoot](../interfaces/state.TevmStateManagerInterface.md#getstateroot)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:171

___

### hasStateRoot

• **hasStateRoot**: () => `never`

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Type declaration

▸ (): `never`

##### Returns

`never`

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[hasStateRoot](../interfaces/state.TevmStateManagerInterface.md#hasstateroot)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:179

___

### opts

• `Readonly` **opts**: [`ForkStateManagerOpts`](../interfaces/index.ForkStateManagerOpts.md)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:34

___

### originalStorageCache

• **originalStorageCache**: [`Cache`](state.Cache.md)

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[originalStorageCache](../interfaces/state.TevmStateManagerInterface.md#originalstoragecache)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:43

___

### setStateRoot

• **setStateRoot**: (`_root`: `Uint8Array`) => `Promise`\<`void`\>

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Type declaration

▸ (`_root`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `_root` | `Uint8Array` |

##### Returns

`Promise`\<`void`\>

**`Deprecated`**

This method is not used by the Fork State Manager and is a stub required by the State Manager interface

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[setStateRoot](../interfaces/state.TevmStateManagerInterface.md#setstateroot)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:175

## Methods

### accountExists

▸ **accountExists**(`address`): `Promise`\<`boolean`\>

Checks if an `account` exists at `address`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the `account` to check |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:110

___

### checkpoint

▸ **checkpoint**(): `Promise`\<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

Partial implementation, called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[checkpoint](../interfaces/state.TevmStateManagerInterface.md#checkpoint)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:152

___

### clearCaches

▸ **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:57

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`\<`void`\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to clear the storage of |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[clearContractStorage](../interfaces/state.TevmStateManagerInterface.md#clearcontractstorage)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:96

___

### commit

▸ **commit**(): `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[commit](../interfaces/state.TevmStateManagerInterface.md#commit)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:159

___

### deepCopy

▸ **deepCopy**(): `Promise`\<[`ForkStateManager`](state.ForkStateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`ForkStateManager`](state.ForkStateManager.md)\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:49

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account which should be deleted |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[deleteAccount](../interfaces/state.TevmStateManagerInterface.md#deleteaccount)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:137

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | The address of the `account` to return storage for |

#### Returns

`Promise`\<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[dumpStorage](../interfaces/state.TevmStateManagerInterface.md#dumpstorage)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:104

___

### dumpStorageRange

▸ **dumpStorageRange**(`_address`, `_startKey`, `_limit`): `Promise`\<`StorageRange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | [`EthjsAddress`](utils.EthjsAddress.md) |
| `_startKey` | `bigint` |
| `_limit` | `number` |

#### Returns

`Promise`\<`StorageRange`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[dumpStorageRange](../interfaces/state.TevmStateManagerInterface.md#dumpstoragerange)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:105

___

### flush

▸ **flush**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:167

___

### getAccount

▸ **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](utils.EthjsAccount.md)\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](utils.EthjsAccount.md)\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getAccount](../interfaces/state.TevmStateManagerInterface.md#getaccount)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:114

___

### getAccountFromProvider

▸ **getAccountFromProvider**(`address`): `Promise`\<[`EthjsAccount`](utils.EthjsAccount.md)\>

Retrieves an account from the provider and stores in the local trie

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of account to be retrieved from provider |

#### Returns

`Promise`\<[`EthjsAccount`](utils.EthjsAccount.md)\>

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:120

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to get the `code` for |

#### Returns

`Promise`\<`Uint8Array`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getContractCode](../interfaces/state.TevmStateManagerInterface.md#getcontractcode)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:64

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account to get the storage for |
| `key` | `Uint8Array` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`\<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getContractStorage](../interfaces/state.TevmStateManagerInterface.md#getcontractstorage)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:81

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | address to get proof of |
| `storageSlots?` | `Uint8Array`[] | storage slots to get proof of |

#### Returns

`Promise`\<`Proof`\>

an EIP-1186 formatted proof

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getProof](../interfaces/state.TevmStateManagerInterface.md#getproof)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:144

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account to modify |
| `accountFields` | `Partial`\<`Pick`\<[`EthjsAccount`](utils.EthjsAccount.md), ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> | Object containing account fields and values to modify |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[modifyAccountFields](../interfaces/state.TevmStateManagerInterface.md#modifyaccountfields)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:132

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`\<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |
| `account` | `undefined` \| [`EthjsAccount`](utils.EthjsAccount.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putAccount](../interfaces/state.TevmStateManagerInterface.md#putaccount)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:124

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the `account` to add the `code` for |
| `value` | `Uint8Array` | The value of the `code` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putContractCode](../interfaces/state.TevmStateManagerInterface.md#putcontractcode)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:71

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to set a storage value for |
| `key` | `Uint8Array` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Uint8Array` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is empty or filled with zeros, deletes the value. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putContractStorage](../interfaces/state.TevmStateManagerInterface.md#putcontractstorage)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:91

___

### revert

▸ **revert**(): `Promise`\<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

Partial implementation , called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[revert](../interfaces/state.TevmStateManagerInterface.md#revert)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:166

___

### shallowCopy

▸ **shallowCopy**(): [`ForkStateManager`](state.ForkStateManager.md)

Returns a new instance of the ForkStateManager with the same opts

#### Returns

[`ForkStateManager`](state.ForkStateManager.md)

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[shallowCopy](../interfaces/state.TevmStateManagerInterface.md#shallowcopy)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:53
