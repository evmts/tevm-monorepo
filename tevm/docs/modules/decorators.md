[tevm](../README.md) / [Modules](../modules.md) / decorators

# Module: decorators

## Table of contents

### References

- [EIP1193Events](decorators.md#eip1193events)
- [EIP1193RequestFn](decorators.md#eip1193requestfn)
- [Eip1193RequestProvider](decorators.md#eip1193requestprovider)
- [EthActionsApi](decorators.md#ethactionsapi)
- [TevmActionsApi](decorators.md#tevmactionsapi)

### Classes

- [ProviderRpcError](../classes/decorators.ProviderRpcError.md)

### Type Aliases

- [AddEthereumChainParameter](decorators.md#addethereumchainparameter)
- [DerivedRpcSchema](decorators.md#derivedrpcschema)
- [EIP1193EventEmitter](decorators.md#eip1193eventemitter)
- [EIP1193EventMap](decorators.md#eip1193eventmap)
- [EIP1193Parameters](decorators.md#eip1193parameters)
- [EIP1193RequestOptions](decorators.md#eip1193requestoptions)
- [Hash](decorators.md#hash)
- [JsonRpcSchemaPublic](decorators.md#jsonrpcschemapublic)
- [JsonRpcSchemaTevm](decorators.md#jsonrpcschematevm)
- [JsonRpcSchemaWallet](decorators.md#jsonrpcschemawallet)
- [LogTopic](decorators.md#logtopic)
- [NetworkSync](decorators.md#networksync)
- [ProviderConnectInfo](decorators.md#providerconnectinfo)
- [ProviderMessage](decorators.md#providermessage)
- [Quantity](decorators.md#quantity)
- [RpcSchema](decorators.md#rpcschema)
- [RpcSchemaOverride](decorators.md#rpcschemaoverride)
- [TestRpcSchema](decorators.md#testrpcschema)
- [WalletPermission](decorators.md#walletpermission)
- [WalletPermissionCaveat](decorators.md#walletpermissioncaveat)
- [WatchAssetParams](decorators.md#watchassetparams)

### Functions

- [eip1993EventEmitter](decorators.md#eip1993eventemitter)
- [ethActions](decorators.md#ethactions)
- [requestEip1193](decorators.md#requesteip1193)
- [tevmActions](decorators.md#tevmactions)
- [tevmSend](decorators.md#tevmsend)

## References

### EIP1193Events

Re-exports [EIP1193Events](index.md#eip1193events)

___

### EIP1193RequestFn

Re-exports [EIP1193RequestFn](index.md#eip1193requestfn)

___

### Eip1193RequestProvider

Re-exports [Eip1193RequestProvider](index.md#eip1193requestprovider)

___

### EthActionsApi

Re-exports [EthActionsApi](index.md#ethactionsapi)

___

### TevmActionsApi

Re-exports [TevmActionsApi](index.md#tevmactionsapi)

## Type Aliases

### AddEthereumChainParameter

Ƭ **AddEthereumChainParameter**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockExplorerUrls?` | `string`[] | - |
| `chainId` | `string` | A 0x-prefixed hexadecimal string |
| `chainName` | `string` | The chain name. |
| `iconUrls?` | `string`[] | - |
| `nativeCurrency?` | \{ `decimals`: `number` ; `name`: `string` ; `symbol`: `string`  } | Native currency for the chain. |
| `nativeCurrency.decimals` | `number` | - |
| `nativeCurrency.name` | `string` | - |
| `nativeCurrency.symbol` | `string` | - |
| `rpcUrls` | readonly `string`[] | - |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/AddEthereumChainParameter.d.ts:1

___

### DerivedRpcSchema

Ƭ **DerivedRpcSchema**\<`TRpcSchema`, `TRpcSchemaOverride`\>: `TRpcSchemaOverride` extends [`RpcSchemaOverride`](decorators.md#rpcschemaoverride) ? [`TRpcSchemaOverride` & \{ `Method`: `string`  }] : `TRpcSchema`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchema` | extends [`RpcSchema`](decorators.md#rpcschema) \| `undefined` |
| `TRpcSchemaOverride` | extends [`RpcSchemaOverride`](decorators.md#rpcschemaoverride) \| `undefined` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/DerivedRpcSchema.d.ts:3

___

### EIP1193EventEmitter

Ƭ **EIP1193EventEmitter**: [`EIP1193Events`](index.md#eip1193events) & \{ `emit`: (`eventName`: keyof [`EIP1193EventMap`](decorators.md#eip1193eventmap), ...`args`: `any`[]) => `boolean`  }

A very minimal EventEmitter interface

#### Defined in

evmts-monorepo/packages/decorators/types/events/EIP1193EventEmitter.d.ts:5

___

### EIP1193EventMap

Ƭ **EIP1193EventMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accountsChanged` | (`accounts`: \`0x$\{string}\`[]) => `void` |
| `chainChanged` | (`chainId`: `string`) => `void` |
| `connect` | (`connectInfo`: [`ProviderConnectInfo`](decorators.md#providerconnectinfo)) => `void` |
| `disconnect` | (`error`: [`ProviderRpcError`](../classes/decorators.ProviderRpcError.md)) => `void` |
| `message` | (`message`: [`ProviderMessage`](decorators.md#providermessage)) => `void` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:14

___

### EIP1193Parameters

Ƭ **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` extends [`RpcSchema`](decorators.md#rpcschema) ? \{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }[`number`] : \{ `method`: `string` ; `params?`: `unknown`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchema` | extends [`RpcSchema`](decorators.md#rpcschema) \| `undefined` = `undefined` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Parameters.d.ts:2

___

### EIP1193RequestOptions

Ƭ **EIP1193RequestOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `retryCount?` | `number` |
| `retryDelay?` | `number` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1993RequestOptions.d.ts:1

___

### Hash

Ƭ **Hash**: \`0x$\{string}\`

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/misc.d.ts:2

___

### JsonRpcSchemaPublic

Ƭ **JsonRpcSchemaPublic**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth_blobGasPrice` | \{ `Method`: ``"eth_blobGasPrice"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current blob price of gas expressed in wei **`Example`** ```ts provider.request({ method: 'eth_blobGasPrice' }) // => '0x09184e72a000' ``` |
| `eth_blobGasPrice.Method` | ``"eth_blobGasPrice"`` | - |
| `eth_blobGasPrice.Parameters?` | `undefined` | - |
| `eth_blobGasPrice.ReturnType` | `Quantity` | - |
| `eth_blockNumber` | \{ `Method`: ``"eth_blockNumber"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of the most recent block seen by this client **`Example`** ```ts provider.request({ method: 'eth_blockNumber' }) // => '0x1b4' ``` |
| `eth_blockNumber.Method` | ``"eth_blockNumber"`` | - |
| `eth_blockNumber.Parameters?` | `undefined` | - |
| `eth_blockNumber.ReturnType` | `Quantity` | - |
| `eth_call` | \{ `Method`: ``"eth_call"`` ; `Parameters`: [transaction: Partial\<TransactionRequest\>] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier, stateOverrideSet: RpcStateOverride] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Executes a new message call immediately without submitting a transaction to the network **`Example`** ```ts provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] }) // => '0x...' ``` |
| `eth_call.Method` | ``"eth_call"`` | - |
| `eth_call.Parameters` | [transaction: Partial\<TransactionRequest\>] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier, stateOverrideSet: RpcStateOverride] | - |
| `eth_call.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_chainId` | \{ `Method`: ``"eth_chainId"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the chain ID associated with the current network **`Example`** ```ts provider.request({ method: 'eth_chainId' }) // => '1' ``` |
| `eth_chainId.Method` | ``"eth_chainId"`` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity` | - |
| `eth_coinbase` | \{ `Method`: ``"eth_coinbase"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`Address`](index.md#address)  } | **`Description`** Returns the client coinbase address. **`Example`** ```ts provider.request({ method: 'eth_coinbase' }) // => '0x...' ``` |
| `eth_coinbase.Method` | ``"eth_coinbase"`` | - |
| `eth_coinbase.Parameters?` | `undefined` | - |
| `eth_coinbase.ReturnType` | [`Address`](index.md#address) | - |
| `eth_estimateGas` | \{ `Method`: ``"eth_estimateGas"`` ; `Parameters`: [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Estimates the gas necessary to complete a transaction without submitting it to the network **`Example`** ```ts provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208' ``` |
| `eth_estimateGas.Method` | ``"eth_estimateGas"`` | - |
| `eth_estimateGas.Parameters` | [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] | - |
| `eth_estimateGas.ReturnType` | `Quantity` | - |
| `eth_feeHistory` | \{ `Method`: ``"eth_feeHistory"`` ; `Parameters`: [blockCount: Quantity, newestBlock: BlockNumber \| BlockTag, rewardPercentiles: number[] \| undefined] ; `ReturnType`: `FeeHistory`  } | **`Description`** Returns a collection of historical gas information **`Example`** ```ts provider.request({ method: 'eth_feeHistory', params: ['4', 'latest', ['25', '75']] }) // => { // oldestBlock: '0x1', // baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'], // gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'], // reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']] // } ``` |
| `eth_feeHistory.Method` | ``"eth_feeHistory"`` | - |
| `eth_feeHistory.Parameters` | [blockCount: Quantity, newestBlock: BlockNumber \| BlockTag, rewardPercentiles: number[] \| undefined] | - |
| `eth_feeHistory.ReturnType` | `FeeHistory` | - |
| `eth_gasPrice` | \{ `Method`: ``"eth_gasPrice"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current price of gas expressed in wei **`Example`** ```ts provider.request({ method: 'eth_gasPrice' }) // => '0x09184e72a000' ``` |
| `eth_gasPrice.Method` | ``"eth_gasPrice"`` | - |
| `eth_gasPrice.Parameters?` | `undefined` | - |
| `eth_gasPrice.ReturnType` | `Quantity` | - |
| `eth_getBalance` | \{ `Method`: ``"eth_getBalance"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the balance of an address in wei **`Example`** ```ts provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] }) // => '0x12a05...' ``` |
| `eth_getBalance.Method` | ``"eth_getBalance"`` | - |
| `eth_getBalance.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getBalance.ReturnType` | `Quantity` | - |
| `eth_getBlockByHash` | \{ `Method`: ``"eth_getBlockByHash"`` ; `Parameters`: [hash: Hash, includeTransactionObjects: boolean] ; `ReturnType`: `Block` \| ``null``  } | **`Description`** Returns information about a block specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // } ``` |
| `eth_getBlockByHash.Method` | ``"eth_getBlockByHash"`` | - |
| `eth_getBlockByHash.Parameters` | [hash: Hash, includeTransactionObjects: boolean] | - |
| `eth_getBlockByHash.ReturnType` | `Block` \| ``null`` | - |
| `eth_getBlockByNumber` | \{ `Method`: ``"eth_getBlockByNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag, includeTransactionObjects: boolean] ; `ReturnType`: `Block` \| ``null``  } | **`Description`** Returns information about a block specified by number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // } ``` |
| `eth_getBlockByNumber.Method` | ``"eth_getBlockByNumber"`` | - |
| `eth_getBlockByNumber.Parameters` | [block: BlockNumber \| BlockTag, includeTransactionObjects: boolean] | - |
| `eth_getBlockByNumber.ReturnType` | `Block` \| ``null`` | - |
| `eth_getBlockTransactionCountByHash` | \{ `Method`: ``"eth_getBlockTransactionCountByHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions in a block specified by block hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getBlockTransactionCountByHash.Method` | ``"eth_getBlockTransactionCountByHash"`` | - |
| `eth_getBlockTransactionCountByHash.Parameters` | [hash: Hash] | - |
| `eth_getBlockTransactionCountByHash.ReturnType` | `Quantity` | - |
| `eth_getBlockTransactionCountByNumber` | \{ `Method`: ``"eth_getBlockTransactionCountByNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions in a block specified by block number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] }) // => '0x1' ``` |
| `eth_getBlockTransactionCountByNumber.Method` | ``"eth_getBlockTransactionCountByNumber"`` | - |
| `eth_getBlockTransactionCountByNumber.Parameters` | [block: BlockNumber \| BlockTag] | - |
| `eth_getBlockTransactionCountByNumber.ReturnType` | `Quantity` | - |
| `eth_getCode` | \{ `Method`: ``"eth_getCode"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Returns the contract code stored at a given address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] }) // => '0x...' ``` |
| `eth_getCode.Method` | ``"eth_getCode"`` | - |
| `eth_getCode.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getCode.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_getFilterChanges` | \{ `Method`: ``"eth_getFilterChanges"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `Log`[] \| [`Hex`](index.md#hex)[]  } | **`Description`** Returns a list of all logs based on filter ID since the last log retrieval **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] }) // => [{ ... }, { ... }] ``` |
| `eth_getFilterChanges.Method` | ``"eth_getFilterChanges"`` | - |
| `eth_getFilterChanges.Parameters` | [filterId: Quantity] | - |
| `eth_getFilterChanges.ReturnType` | `Log`[] \| [`Hex`](index.md#hex)[] | - |
| `eth_getFilterLogs` | \{ `Method`: ``"eth_getFilterLogs"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `Log`[]  } | **`Description`** Returns a list of all logs based on filter ID **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] }) // => [{ ... }, { ... }] ``` |
| `eth_getFilterLogs.Method` | ``"eth_getFilterLogs"`` | - |
| `eth_getFilterLogs.Parameters` | [filterId: Quantity] | - |
| `eth_getFilterLogs.ReturnType` | `Log`[] | - |
| `eth_getLogs` | \{ `Method`: ``"eth_getLogs"`` ; `Parameters`: [\{ `address?`: [`Address`](index.md#address) \| [`Address`](index.md#address)[] ; `topics?`: [`LogTopic`](decorators.md#logtopic)[]  } & \{ `blockHash?`: `never` ; `fromBlock?`: `BlockNumber` \| [`BlockTag`](index.md#blocktag) ; `toBlock?`: `BlockNumber` \| [`BlockTag`](index.md#blocktag)  } \| \{ `blockHash?`: [`Hash`](decorators.md#hash) ; `fromBlock?`: `never` ; `toBlock?`: `never`  }] ; `ReturnType`: `Log`[]  } | **`Description`** Returns a list of all logs based on a filter object **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => [{ ... }, { ... }] ``` |
| `eth_getLogs.Method` | ``"eth_getLogs"`` | - |
| `eth_getLogs.Parameters` | [\{ `address?`: [`Address`](index.md#address) \| [`Address`](index.md#address)[] ; `topics?`: [`LogTopic`](decorators.md#logtopic)[]  } & \{ `blockHash?`: `never` ; `fromBlock?`: `BlockNumber` \| [`BlockTag`](index.md#blocktag) ; `toBlock?`: `BlockNumber` \| [`BlockTag`](index.md#blocktag)  } \| \{ `blockHash?`: [`Hash`](decorators.md#hash) ; `fromBlock?`: `never` ; `toBlock?`: `never`  }] | - |
| `eth_getLogs.ReturnType` | `Log`[] | - |
| `eth_getProof` | \{ `Method`: ``"eth_getProof"`` ; `Parameters`: [address: Address, storageKeys: Hash[], block: BlockNumber \| BlockTag] ; `ReturnType`: `Proof`  } | **`Description`** Returns the account and storage values of the specified account including the Merkle-proof. **`Link`** https://eips.ethereum.org/EIPS/eip-1186 **`Example`** ```ts provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] }) // => { // ... // } ``` |
| `eth_getProof.Method` | ``"eth_getProof"`` | - |
| `eth_getProof.Parameters` | [address: Address, storageKeys: Hash[], block: BlockNumber \| BlockTag] | - |
| `eth_getProof.ReturnType` | `Proof` | - |
| `eth_getStorageAt` | \{ `Method`: ``"eth_getStorageAt"`` ; `Parameters`: [address: Address, index: Quantity, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Returns the value from a storage position at an address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] }) // => '0x...' ``` |
| `eth_getStorageAt.Method` | ``"eth_getStorageAt"`` | - |
| `eth_getStorageAt.Parameters` | [address: Address, index: Quantity, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getStorageAt.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_getTransactionByBlockHashAndIndex` | \{ `Method`: ``"eth_getTransactionByBlockHashAndIndex"`` ; `Parameters`: [hash: Hash, index: Quantity] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by block hash and transaction index **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getTransactionByBlockHashAndIndex.Method` | ``"eth_getTransactionByBlockHashAndIndex"`` | - |
| `eth_getTransactionByBlockHashAndIndex.Parameters` | [hash: Hash, index: Quantity] | - |
| `eth_getTransactionByBlockHashAndIndex.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionByBlockNumberAndIndex` | \{ `Method`: ``"eth_getTransactionByBlockNumberAndIndex"`` ; `Parameters`: [block: BlockNumber \| BlockTag, index: Quantity] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by block number and transaction index **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getTransactionByBlockNumberAndIndex.Method` | ``"eth_getTransactionByBlockNumberAndIndex"`` | - |
| `eth_getTransactionByBlockNumberAndIndex.Parameters` | [block: BlockNumber \| BlockTag, index: Quantity] | - |
| `eth_getTransactionByBlockNumberAndIndex.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionByHash` | \{ `Method`: ``"eth_getTransactionByHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] }) // => { ... } ``` |
| `eth_getTransactionByHash.Method` | ``"eth_getTransactionByHash"`` | - |
| `eth_getTransactionByHash.Parameters` | [hash: Hash] | - |
| `eth_getTransactionByHash.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionCount` | \{ `Method`: ``"eth_getTransactionCount"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions sent from an address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] }) // => '0x1' ``` |
| `eth_getTransactionCount.Method` | ``"eth_getTransactionCount"`` | - |
| `eth_getTransactionCount.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getTransactionCount.ReturnType` | `Quantity` | - |
| `eth_getTransactionReceipt` | \{ `Method`: ``"eth_getTransactionReceipt"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `TransactionReceipt` \| ``null``  } | **`Description`** Returns the receipt of a transaction specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] }) // => { ... } ``` |
| `eth_getTransactionReceipt.Method` | ``"eth_getTransactionReceipt"`` | - |
| `eth_getTransactionReceipt.Parameters` | [hash: Hash] | - |
| `eth_getTransactionReceipt.ReturnType` | `TransactionReceipt` \| ``null`` | - |
| `eth_getUncleByBlockHashAndIndex` | \{ `Method`: ``"eth_getUncleByBlockHashAndIndex"`` ; `Parameters`: [hash: Hash, index: Quantity] ; `ReturnType`: `Uncle` \| ``null``  } | **`Description`** Returns information about an uncle specified by block hash and uncle index position **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getUncleByBlockHashAndIndex.Method` | ``"eth_getUncleByBlockHashAndIndex"`` | - |
| `eth_getUncleByBlockHashAndIndex.Parameters` | [hash: Hash, index: Quantity] | - |
| `eth_getUncleByBlockHashAndIndex.ReturnType` | `Uncle` \| ``null`` | - |
| `eth_getUncleByBlockNumberAndIndex` | \{ `Method`: ``"eth_getUncleByBlockNumberAndIndex"`` ; `Parameters`: [block: BlockNumber \| BlockTag, index: Quantity] ; `ReturnType`: `Uncle` \| ``null``  } | **`Description`** Returns information about an uncle specified by block number and uncle index position **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getUncleByBlockNumberAndIndex.Method` | ``"eth_getUncleByBlockNumberAndIndex"`` | - |
| `eth_getUncleByBlockNumberAndIndex.Parameters` | [block: BlockNumber \| BlockTag, index: Quantity] | - |
| `eth_getUncleByBlockNumberAndIndex.ReturnType` | `Uncle` \| ``null`` | - |
| `eth_getUncleCountByBlockHash` | \{ `Method`: ``"eth_getUncleCountByBlockHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of uncles in a block specified by block hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getUncleCountByBlockHash.Method` | ``"eth_getUncleCountByBlockHash"`` | - |
| `eth_getUncleCountByBlockHash.Parameters` | [hash: Hash] | - |
| `eth_getUncleCountByBlockHash.ReturnType` | `Quantity` | - |
| `eth_getUncleCountByBlockNumber` | \{ `Method`: ``"eth_getUncleCountByBlockNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of uncles in a block specified by block number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getUncleCountByBlockNumber.Method` | ``"eth_getUncleCountByBlockNumber"`` | - |
| `eth_getUncleCountByBlockNumber.Parameters` | [block: BlockNumber \| BlockTag] | - |
| `eth_getUncleCountByBlockNumber.ReturnType` | `Quantity` | - |
| `eth_maxPriorityFeePerGas` | \{ `Method`: ``"eth_maxPriorityFeePerGas"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current maxPriorityFeePerGas in wei. **`Link`** https://ethereum.github.io/execution-apis/api-documentation/ **`Example`** ```ts provider.request({ method: 'eth_maxPriorityFeePerGas' }) // => '0x5f5e100' ``` |
| `eth_maxPriorityFeePerGas.Method` | ``"eth_maxPriorityFeePerGas"`` | - |
| `eth_maxPriorityFeePerGas.Parameters?` | `undefined` | - |
| `eth_maxPriorityFeePerGas.ReturnType` | `Quantity` | - |
| `eth_newBlockFilter` | \{ `Method`: ``"eth_newBlockFilter"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newBlockFilter' }) // => '0x1' ``` |
| `eth_newBlockFilter.Method` | ``"eth_newBlockFilter"`` | - |
| `eth_newBlockFilter.Parameters?` | `undefined` | - |
| `eth_newBlockFilter.ReturnType` | `Quantity` | - |
| `eth_newFilter` | \{ `Method`: ``"eth_newFilter"`` ; `Parameters`: [filter: Object] ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => '0x1' ``` |
| `eth_newFilter.Method` | ``"eth_newFilter"`` | - |
| `eth_newFilter.Parameters` | [filter: Object] | - |
| `eth_newFilter.ReturnType` | `Quantity` | - |
| `eth_newPendingTransactionFilter` | \{ `Method`: ``"eth_newPendingTransactionFilter"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newPendingTransactionFilter' }) // => '0x1' ``` |
| `eth_newPendingTransactionFilter.Method` | ``"eth_newPendingTransactionFilter"`` | - |
| `eth_newPendingTransactionFilter.Parameters?` | `undefined` | - |
| `eth_newPendingTransactionFilter.ReturnType` | `Quantity` | - |
| `eth_protocolVersion` | \{ `Method`: ``"eth_protocolVersion"`` ; `Parameters?`: `undefined` ; `ReturnType`: `string`  } | **`Description`** Returns the current Ethereum protocol version **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_protocolVersion' }) // => '54' ``` |
| `eth_protocolVersion.Method` | ``"eth_protocolVersion"`` | - |
| `eth_protocolVersion.Parameters?` | `undefined` | - |
| `eth_protocolVersion.ReturnType` | `string` | - |
| `eth_sendRawTransaction` | \{ `Method`: ``"eth_sendRawTransaction"`` ; `Parameters`: [signedTransaction: Hex] ; `ReturnType`: [`Hash`](decorators.md#hash)  } | **`Description`** Sends a **signed** transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...' ``` |
| `eth_sendRawTransaction.Method` | ``"eth_sendRawTransaction"`` | - |
| `eth_sendRawTransaction.Parameters` | [signedTransaction: Hex] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](decorators.md#hash) | - |
| `eth_uninstallFilter` | \{ `Method`: ``"eth_uninstallFilter"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `boolean`  } | **`Description`** Destroys a filter based on filter ID **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] }) // => true ``` |
| `eth_uninstallFilter.Method` | ``"eth_uninstallFilter"`` | - |
| `eth_uninstallFilter.Parameters` | [filterId: Quantity] | - |
| `eth_uninstallFilter.ReturnType` | `boolean` | - |
| `net_listening` | \{ `Method`: ``"net_listening"`` ; `Parameters?`: `undefined` ; `ReturnType`: `boolean`  } | **`Description`** Determines if this client is listening for new network connections **`Example`** ```ts provider.request({ method: 'net_listening' }) // => true ``` |
| `net_listening.Method` | ``"net_listening"`` | - |
| `net_listening.Parameters?` | `undefined` | - |
| `net_listening.ReturnType` | `boolean` | - |
| `net_peerCount` | \{ `Method`: ``"net_peerCount"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of peers currently connected to this client **`Example`** ```ts provider.request({ method: 'net_peerCount' }) // => '0x1' ``` |
| `net_peerCount.Method` | ``"net_peerCount"`` | - |
| `net_peerCount.Parameters?` | `undefined` | - |
| `net_peerCount.ReturnType` | `Quantity` | - |
| `net_version` | \{ `Method`: ``"net_version"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the chain ID associated with the current network **`Example`** ```ts provider.request({ method: 'net_version' }) // => '1' ``` |
| `net_version.Method` | ``"net_version"`` | - |
| `net_version.Parameters?` | `undefined` | - |
| `net_version.ReturnType` | `Quantity` | - |
| `web3_clientVersion` | \{ `Method`: ``"web3_clientVersion"`` ; `Parameters?`: `undefined` ; `ReturnType`: `string`  } | **`Description`** Returns the version of the current client **`Example`** ```ts provider.request({ method: 'web3_clientVersion' }) // => 'MetaMask/v1.0.0' ``` |
| `web3_clientVersion.Method` | ``"web3_clientVersion"`` | - |
| `web3_clientVersion.Parameters?` | `undefined` | - |
| `web3_clientVersion.ReturnType` | `string` | - |
| `web3_sha3` | \{ `Method`: ``"web3_sha3"`` ; `Parameters`: [data: Hash] ; `ReturnType`: `string`  } | **`Description`** Hashes data using the Keccak-256 algorithm **`Example`** ```ts provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] }) // => '0xc94770007dda54cF92009BFF0dE90c06F603a09f' ``` |
| `web3_sha3.Method` | ``"web3_sha3"`` | - |
| `web3_sha3.Parameters` | [data: Hash] | - |
| `web3_sha3.ReturnType` | `string` | - |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/JsonRpcSchemaPublic.d.ts:5

___

### JsonRpcSchemaTevm

Ƭ **JsonRpcSchemaTevm**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `tevm_call` | \{ `Method`: ``"tevm_call"`` ; `Parameters`: [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<[`CallResult`](index.md#callresult)\<`never`\>\>  } | **`Description`** A versatile way of executing an EVM call with many options and detailed return data **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })}) // => { data: '0x...', events: [{...}], ... } ``` |
| `tevm_call.Method` | ``"tevm_call"`` | - |
| `tevm_call.Parameters` | [`CallJsonRpcRequest`](procedures_types.md#calljsonrpcrequest)[``"params"``] | - |
| `tevm_call.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<[`CallResult`](index.md#callresult)\<`never`\>\> | - |
| `tevm_dumpState` | \{ `Method`: ``"tevm_dumpState"`` ; `Parameters?`: [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<`DumpStateResult`\<`never`\>\>  } | **`Description`** Dumps the current cached state of the EVM. **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_dumpState' })}) ``` |
| `tevm_dumpState.Method` | ``"tevm_dumpState"`` | - |
| `tevm_dumpState.Parameters?` | [`DumpStateJsonRpcRequest`](procedures_types.md#dumpstatejsonrpcrequest)[``"params"``] | - |
| `tevm_dumpState.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<`DumpStateResult`\<`never`\>\> | - |
| `tevm_getAccount` | \{ `Method`: ``"tevm_getAccount"`` ; `Parameters`: [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<[`GetAccountResult`](index.md#getaccountresult)\<`never`\>\>  } | **`Description`** Returns the account state of the given address **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])}) ``` |
| `tevm_getAccount.Method` | ``"tevm_getAccount"`` | - |
| `tevm_getAccount.Parameters` | [`GetAccountJsonRpcRequest`](procedures_types.md#getaccountjsonrpcrequest)[``"params"``] | - |
| `tevm_getAccount.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<[`GetAccountResult`](index.md#getaccountresult)\<`never`\>\> | - |
| `tevm_loadState` | \{ `Method`: ``"tevm_loadState"`` ; `Parameters`: [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<`LoadStateResult`\<`never`\>\>  } | **`Description`** Loads the provided state into the EVM **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])}) // => { success: true } ``` |
| `tevm_loadState.Method` | ``"tevm_loadState"`` | - |
| `tevm_loadState.Parameters` | [`LoadStateJsonRpcRequest`](procedures_types.md#loadstatejsonrpcrequest)[``"params"``] | - |
| `tevm_loadState.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<`LoadStateResult`\<`never`\>\> | - |
| `tevm_script` | \{ `Method`: ``"tevm_script"`` ; `Parameters`: [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<[`CallResult`](index.md#callresult)\<`never`\>\>  } | **`Description`** Execute supplied contract bytecode on the EVM **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_script', params: [{ deployedBytecode: '0x...', args: [...] }] })}) // => { address: '0x...', events: [{...}], ... } ``` |
| `tevm_script.Method` | ``"tevm_script"`` | - |
| `tevm_script.Parameters` | [`ScriptJsonRpcRequest`](procedures_types.md#scriptjsonrpcrequest)[``"params"``] | - |
| `tevm_script.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<[`CallResult`](index.md#callresult)\<`never`\>\> | - |
| `tevm_setAccount` | \{ `Method`: ``"tevm_setAccount"`` ; `Parameters`: [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest)[``"params"``] ; `ReturnType`: [`SerializeToJson`](utils.md#serializetojson)\<[`SetAccountResult`](index.md#setaccountresult)\<`never`\>\>  } | **`Description`** Sets the account state of the given address **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])}) r ``` |
| `tevm_setAccount.Method` | ``"tevm_setAccount"`` | - |
| `tevm_setAccount.Parameters` | [`SetAccountJsonRpcRequest`](procedures_types.md#setaccountjsonrpcrequest)[``"params"``] | - |
| `tevm_setAccount.ReturnType` | [`SerializeToJson`](utils.md#serializetojson)\<[`SetAccountResult`](index.md#setaccountresult)\<`never`\>\> | - |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/JsonRpcSchemaTevm.d.ts:5

___

### JsonRpcSchemaWallet

Ƭ **JsonRpcSchemaWallet**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth_accounts` | \{ `Method`: ``"eth_accounts"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`Address`](index.md#address)[]  } | **`Description`** Returns a list of addresses owned by this client **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_accounts' }) // => ['0x0fB69...'] ``` |
| `eth_accounts.Method` | ``"eth_accounts"`` | - |
| `eth_accounts.Parameters?` | `undefined` | - |
| `eth_accounts.ReturnType` | [`Address`](index.md#address)[] | - |
| `eth_chainId` | \{ `Method`: ``"eth_chainId"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current chain ID associated with the wallet. **`Example`** ```ts provider.request({ method: 'eth_chainId' }) // => '1' ``` |
| `eth_chainId.Method` | ``"eth_chainId"`` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity` | - |
| `eth_estimateGas` | \{ `Method`: ``"eth_estimateGas"`` ; `Parameters`: [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Estimates the gas necessary to complete a transaction without submitting it to the network **`Example`** ```ts provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208' ``` |
| `eth_estimateGas.Method` | ``"eth_estimateGas"`` | - |
| `eth_estimateGas.Parameters` | [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] | - |
| `eth_estimateGas.ReturnType` | `Quantity` | - |
| `eth_requestAccounts` | \{ `Method`: ``"eth_requestAccounts"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`Address`](index.md#address)[]  } | **`Description`** Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear. **`Link`** https://eips.ethereum.org/EIPS/eip-1102 **`Example`** ```ts provider.request({ method: 'eth_requestAccounts' }] }) // => ['0x...', '0x...'] ``` |
| `eth_requestAccounts.Method` | ``"eth_requestAccounts"`` | - |
| `eth_requestAccounts.Parameters?` | `undefined` | - |
| `eth_requestAccounts.ReturnType` | [`Address`](index.md#address)[] | - |
| `eth_sendRawTransaction` | \{ `Method`: ``"eth_sendRawTransaction"`` ; `Parameters`: [signedTransaction: Hex] ; `ReturnType`: [`Hash`](decorators.md#hash)  } | **`Description`** Sends and already-signed transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...' ``` |
| `eth_sendRawTransaction.Method` | ``"eth_sendRawTransaction"`` | - |
| `eth_sendRawTransaction.Parameters` | [signedTransaction: Hex] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](decorators.md#hash) | - |
| `eth_sendTransaction` | \{ `Method`: ``"eth_sendTransaction"`` ; `Parameters`: [transaction: TransactionRequest] ; `ReturnType`: [`Hash`](decorators.md#hash)  } | **`Description`** Creates, signs, and sends a new transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...' ``` |
| `eth_sendTransaction.Method` | ``"eth_sendTransaction"`` | - |
| `eth_sendTransaction.Parameters` | [transaction: TransactionRequest] | - |
| `eth_sendTransaction.ReturnType` | [`Hash`](decorators.md#hash) | - |
| `eth_sign` | \{ `Method`: ``"eth_sign"`` ; `Parameters`: [address: Address, data: Hex] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] }) // => '0x...' ``` |
| `eth_sign.Method` | ``"eth_sign"`` | - |
| `eth_sign.Parameters` | [address: Address, data: Hex] | - |
| `eth_sign.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_signTransaction` | \{ `Method`: ``"eth_signTransaction"`` ; `Parameters`: [request: TransactionRequest] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...' ``` |
| `eth_signTransaction.Method` | ``"eth_signTransaction"`` | - |
| `eth_signTransaction.Parameters` | [request: TransactionRequest] | - |
| `eth_signTransaction.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_signTypedData_v4` | \{ `Method`: ``"eth_signTypedData_v4"`` ; `Parameters`: [address: Address, message: string] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] }) // => '0x...' ``` |
| `eth_signTypedData_v4.Method` | ``"eth_signTypedData_v4"`` | - |
| `eth_signTypedData_v4.Parameters` | [address: Address, message: string] | - |
| `eth_signTypedData_v4.ReturnType` | [`Hex`](index.md#hex) | - |
| `eth_syncing` | \{ `Method`: ``"eth_syncing"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`NetworkSync`](decorators.md#networksync) \| ``false``  } | **`Description`** Returns information about the status of this client’s network synchronization **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_syncing' }) // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' } ``` |
| `eth_syncing.Method` | ``"eth_syncing"`` | - |
| `eth_syncing.Parameters?` | `undefined` | - |
| `eth_syncing.ReturnType` | [`NetworkSync`](decorators.md#networksync) \| ``false`` | - |
| `personal_sign` | \{ `Method`: ``"personal_sign"`` ; `Parameters`: [data: Hex, address: Address] ; `ReturnType`: [`Hex`](index.md#hex)  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] }) // => '0x...' ``` |
| `personal_sign.Method` | ``"personal_sign"`` | - |
| `personal_sign.Parameters` | [data: Hex, address: Address] | - |
| `personal_sign.ReturnType` | [`Hex`](index.md#hex) | - |
| `wallet_addEthereumChain` | \{ `Method`: ``"wallet_addEthereumChain"`` ; `Parameters`: [chain: AddEthereumChainParameter] ; `ReturnType`: ``null``  } | **`Description`** Add an Ethereum chain to the wallet. **`Link`** https://eips.ethereum.org/EIPS/eip-3085 **`Example`** ```ts provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] }) // => { ... } ``` |
| `wallet_addEthereumChain.Method` | ``"wallet_addEthereumChain"`` | - |
| `wallet_addEthereumChain.Parameters` | [chain: AddEthereumChainParameter] | - |
| `wallet_addEthereumChain.ReturnType` | ``null`` | - |
| `wallet_getPermissions` | \{ `Method`: ``"wallet_getPermissions"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`WalletPermission`](decorators.md#walletpermission)[]  } | **`Description`** Gets the wallets current permissions. **`Link`** https://eips.ethereum.org/EIPS/eip-2255 **`Example`** ```ts provider.request({ method: 'wallet_getPermissions' }) // => { ... } ``` |
| `wallet_getPermissions.Method` | ``"wallet_getPermissions"`` | - |
| `wallet_getPermissions.Parameters?` | `undefined` | - |
| `wallet_getPermissions.ReturnType` | [`WalletPermission`](decorators.md#walletpermission)[] | - |
| `wallet_requestPermissions` | \{ `Method`: ``"wallet_requestPermissions"`` ; `Parameters`: [permissions: Object] ; `ReturnType`: [`WalletPermission`](decorators.md#walletpermission)[]  } | **`Description`** Requests the given permissions from the user. **`Link`** https://eips.ethereum.org/EIPS/eip-2255 **`Example`** ```ts provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }) // => { ... } ``` |
| `wallet_requestPermissions.Method` | ``"wallet_requestPermissions"`` | - |
| `wallet_requestPermissions.Parameters` | [permissions: Object] | - |
| `wallet_requestPermissions.ReturnType` | [`WalletPermission`](decorators.md#walletpermission)[] | - |
| `wallet_switchEthereumChain` | \{ `Method`: ``"wallet_switchEthereumChain"`` ; `Parameters`: [chain: Object] ; `ReturnType`: ``null``  } | **`Description`** Switch the wallet to the given Ethereum chain. **`Link`** https://eips.ethereum.org/EIPS/eip-3326 **`Example`** ```ts provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] }) // => { ... } ``` |
| `wallet_switchEthereumChain.Method` | ``"wallet_switchEthereumChain"`` | - |
| `wallet_switchEthereumChain.Parameters` | [chain: Object] | - |
| `wallet_switchEthereumChain.ReturnType` | ``null`` | - |
| `wallet_watchAsset` | \{ `Method`: ``"wallet_watchAsset"`` ; `Parameters`: [`WatchAssetParams`](decorators.md#watchassetparams) ; `ReturnType`: `boolean`  } | **`Description`** Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added. **`Link`** https://eips.ethereum.org/EIPS/eip-747 **`Example`** ```ts provider.request({ method: 'wallet_watchAsset' }] }) // => true ``` |
| `wallet_watchAsset.Method` | ``"wallet_watchAsset"`` | - |
| `wallet_watchAsset.Parameters` | [`WatchAssetParams`](decorators.md#watchassetparams) | - |
| `wallet_watchAsset.ReturnType` | `boolean` | - |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/JsonRpcSchemaWallet.d.ts:8

___

### LogTopic

Ƭ **LogTopic**: [`Hex`](index.md#hex) \| [`Hex`](index.md#hex)[] \| ``null``

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/misc.d.ts:3

___

### NetworkSync

Ƭ **NetworkSync**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `currentBlock` | [`Quantity`](decorators.md#quantity) | The current block number |
| `highestBlock` | [`Quantity`](decorators.md#quantity) | Number of latest block on the network |
| `startingBlock` | [`Quantity`](decorators.md#quantity) | Block number at which syncing started |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/NetworkSync.d.ts:3

___

### ProviderConnectInfo

Ƭ **ProviderConnectInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:2

___

### ProviderMessage

Ƭ **ProviderMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |
| `type` | `string` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:5

___

### Quantity

Ƭ **Quantity**: [`Hex`](index.md#hex)

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/NetworkSync.d.ts:2

___

### RpcSchema

Ƭ **RpcSchema**: readonly \{ `Method`: `string` ; `Parameters?`: `unknown` ; `ReturnType`: `unknown`  }[]

Most general RPC schema type.

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/RpcSchema.d.ts:5

___

### RpcSchemaOverride

Ƭ **RpcSchemaOverride**: `Omit`\<[`RpcSchema`](decorators.md#rpcschema)[`number`], ``"Method"``\>

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/RpcSchemaOverride.d.ts:2

___

### TestRpcSchema

Ƭ **TestRpcSchema**\<`TMode`\>: [addCompilationResult: Object, dropTransaction: Object, dumpState: Object, enableTraces: Object, impersonateAccount: Object, getAutomine: Object, loadState: Object, mine: Object, reset: Object, setBalance: Object, setCode: Object, setCoinbase: Object, setLoggingEnabled: Object, setMinGasPrice: Object, setNextBlockBaseFeePerGas: Object, setNonce: Object, setRpcUrl: Object, setStorageAt: Object, stopImpersonatingAccount: Object, increaseTime: Object, setAccountBalance: Object, evm\_setAutomine: Object, evm\_setBlockGasLimit: Object, evm\_increaseTime: Object, setBlockTimestampInterval: Object, removeBlockTimestampInterval: Object, evm\_setIntervalMining: Object, evm\_setNextBlockTimestamp: Object, evm\_snapshot: Object, evm\_revert: Object, miner\_start: Object, miner\_stop: Object, txpool\_content: Object, txpool\_inspect: Object, txpool\_status: Object, eth\_mining: Object, evm\_mine: Object, eth\_sendUnsignedTransaction: Object]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMode` | extends `string` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/JsonRpcSchemaTest.d.ts:4

___

### WalletPermission

Ƭ **WalletPermission**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caveats` | [`WalletPermissionCaveat`](decorators.md#walletpermissioncaveat)[] |
| `date` | `number` |
| `id` | `string` |
| `invoker` | \`http://$\{string}\` \| \`https://$\{string}\` |
| `parentCapability` | ``"eth_accounts"`` \| `string` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/WalletPermission.d.ts:2

___

### WalletPermissionCaveat

Ƭ **WalletPermissionCaveat**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `value` | `any` |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/WalletPermissionCaveat.d.ts:1

___

### WatchAssetParams

Ƭ **WatchAssetParams**: `Object`

Parameters for the `watchAsset` method.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `address`: `string` ; `decimals`: `number` ; `image?`: `string` ; `symbol`: `string`  } | - |
| `options.address` | `string` | The address of the token contract |
| `options.decimals` | `number` | The number of token decimals |
| `options.image?` | `string` | A string url of the token logo |
| `options.symbol` | `string` | A ticker symbol or shorthand, up to 11 characters |
| `type` | ``"ERC20"`` | Token type. |

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/WatchAssetParams.d.ts:4

## Functions

### eip1993EventEmitter

▸ **eip1993EventEmitter**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/events/eip1993EventEmitter.d.ts:1

___

### ethActions

▸ **ethActions**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/actions/ethActions.d.ts:1

___

### requestEip1193

▸ **requestEip1193**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/request/requestEip1193.d.ts:1

___

### tevmActions

▸ **tevmActions**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/actions/tevmActions.d.ts:1

___

### tevmSend

▸ **tevmSend**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/request/tevmSend.d.ts:1
