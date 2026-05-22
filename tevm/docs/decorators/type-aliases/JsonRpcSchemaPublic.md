[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaPublic

# Type Alias: JsonRpcSchemaPublic

> **JsonRpcSchemaPublic** = `object`

Type definitions for standard Ethereum JSON-RPC methods accessible to the public.
Includes methods related to network info, blocks, transactions, and state queries.

## Example

```typescript
import { JsonRpcSchemaPublic } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Call methods using their defined types
const blockNumber = await node.request({
  method: 'eth_blockNumber'
})

const balance = await node.request({
  method: 'eth_getBalance',
  params: ['0x1234567890123456789012345678901234567890', 'latest']
})
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="eth_blobbasefee"></a> `eth_blobBaseFee` | `object` | **Description** Returns the current blob price of gas expressed in wei **Example** `provider.request({ method: 'eth_blobBaseFee' }) // => '0x09184e72a000'` |
| `eth_blobBaseFee.Method` | `"eth_blobBaseFee"` | - |
| `eth_blobBaseFee.Parameters?` | `undefined` | - |
| `eth_blobBaseFee.ReturnType` | `Quantity$1` | - |
| <a id="eth_blocknumber"></a> `eth_blockNumber` | `object` | **Description** Returns the number of the most recent block seen by this client **Example** `provider.request({ method: 'eth_blockNumber' }) // => '0x1b4'` |
| `eth_blockNumber.Method` | `"eth_blockNumber"` | - |
| `eth_blockNumber.Parameters?` | `undefined` | - |
| `eth_blockNumber.ReturnType` | `Quantity$1` | - |
| <a id="eth_call"></a> `eth_call` | `object` | **Description** Executes a new message call immediately without submitting a transaction to the network **Example** `provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] }) // => '0x...'` |
| `eth_call.Method` | `"eth_call"` | - |
| `eth_call.Parameters` | \[`Partial`\<`RpcTransactionRequest`\>\] \| \[`Partial`\<`RpcTransactionRequest`\>, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] \| \[`Partial`\<`RpcTransactionRequest`\>, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`, `RpcStateOverride`\] | - |
| `eth_call.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_chainid"></a> `eth_chainId` | `object` | **Description** Returns the chain ID associated with the current network **Example** `provider.request({ method: 'eth_chainId' }) // => '1'` |
| `eth_chainId.Method` | `"eth_chainId"` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity$1` | - |
| <a id="eth_coinbase"></a> `eth_coinbase` | `object` | **Description** Returns the client coinbase address. **Example** `provider.request({ method: 'eth_coinbase' }) // => '0x...'` |
| `eth_coinbase.Method` | `"eth_coinbase"` | - |
| `eth_coinbase.Parameters?` | `undefined` | - |
| `eth_coinbase.ReturnType` | [`Address`](../../index/type-aliases/Address.md) | - |
| <a id="eth_estimategas"></a> `eth_estimateGas` | `object` | **Description** Estimates the gas necessary to complete a transaction without submitting it to the network **Example** `provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208'` |
| `eth_estimateGas.Method` | `"eth_estimateGas"` | - |
| `eth_estimateGas.Parameters` | \[`RpcTransactionRequest`\] \| \[`RpcTransactionRequest`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\] | - |
| `eth_estimateGas.ReturnType` | `Quantity$1` | - |
| <a id="eth_feehistory"></a> `eth_feeHistory` | `object` | **Description** Returns a collection of historical gas information **Example** `provider.request({ method: 'eth_feeHistory', params: ['4', 'latest', ['25', '75']] }) // => { // oldestBlock: '0x1', // baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'], // gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'], // reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']] // }` |
| `eth_feeHistory.Method` | `"eth_feeHistory"` | - |
| `eth_feeHistory.Parameters` | \[`Quantity$1`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `number`[] \| `undefined`\] | - |
| `eth_feeHistory.ReturnType` | `RpcFeeHistory` | - |
| <a id="eth_gasprice"></a> `eth_gasPrice` | `object` | **Description** Returns the current price of gas expressed in wei **Example** `provider.request({ method: 'eth_gasPrice' }) // => '0x09184e72a000'` |
| `eth_gasPrice.Method` | `"eth_gasPrice"` | - |
| `eth_gasPrice.Parameters?` | `undefined` | - |
| `eth_gasPrice.ReturnType` | `Quantity$1` | - |
| <a id="eth_getbalance"></a> `eth_getBalance` | `object` | **Description** Returns the balance of an address in wei **Example** `provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] }) // => '0x12a05...'` |
| `eth_getBalance.Method` | `"eth_getBalance"` | - |
| `eth_getBalance.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] | - |
| `eth_getBalance.ReturnType` | `Quantity$1` | - |
| <a id="eth_getblockbyhash"></a> `eth_getBlockByHash` | `object` | **Description** Returns information about a block specified by hash **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // }` |
| `eth_getBlockByHash.Method` | `"eth_getBlockByHash"` | - |
| `eth_getBlockByHash.Parameters` | \[[`Hash`](Hash.md), `boolean`\] | - |
| `eth_getBlockByHash.ReturnType` | `RpcBlock` \| `null` | - |
| <a id="eth_getblockbynumber"></a> `eth_getBlockByNumber` | `object` | **Description** Returns information about a block specified by number **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // }` |
| `eth_getBlockByNumber.Method` | `"eth_getBlockByNumber"` | - |
| `eth_getBlockByNumber.Parameters` | \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `boolean`\] | - |
| `eth_getBlockByNumber.ReturnType` | `RpcBlock` \| `null` | - |
| <a id="eth_getblocktransactioncountbyhash"></a> `eth_getBlockTransactionCountByHash` | `object` | **Description** Returns the number of transactions in a block specified by block hash **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] }) // => '0x1'` |
| `eth_getBlockTransactionCountByHash.Method` | `"eth_getBlockTransactionCountByHash"` | - |
| `eth_getBlockTransactionCountByHash.Parameters` | \[[`Hash`](Hash.md)\] | - |
| `eth_getBlockTransactionCountByHash.ReturnType` | `Quantity$1` | - |
| <a id="eth_getblocktransactioncountbynumber"></a> `eth_getBlockTransactionCountByNumber` | `object` | **Description** Returns the number of transactions in a block specified by block number **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] }) // => '0x1'` |
| `eth_getBlockTransactionCountByNumber.Method` | `"eth_getBlockTransactionCountByNumber"` | - |
| `eth_getBlockTransactionCountByNumber.Parameters` | \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\] | - |
| `eth_getBlockTransactionCountByNumber.ReturnType` | `Quantity$1` | - |
| <a id="eth_getcode"></a> `eth_getCode` | `object` | **Description** Returns the contract code stored at a given address **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] }) // => '0x...'` |
| `eth_getCode.Method` | `"eth_getCode"` | - |
| `eth_getCode.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] | - |
| `eth_getCode.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_getfilterchanges"></a> `eth_getFilterChanges` | `object` | **Description** Returns a list of all logs based on filter ID since the last log retrieval **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] }) // => [{ ... }, { ... }]` |
| `eth_getFilterChanges.Method` | `"eth_getFilterChanges"` | - |
| `eth_getFilterChanges.Parameters` | \[`Quantity$1`\] | - |
| `eth_getFilterChanges.ReturnType` | `RpcLog`[] \| [`Hex`](../../index/type-aliases/Hex.md)[] | - |
| <a id="eth_getfilterlogs"></a> `eth_getFilterLogs` | `object` | **Description** Returns a list of all logs based on filter ID **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] }) // => [{ ... }, { ... }]` |
| `eth_getFilterLogs.Method` | `"eth_getFilterLogs"` | - |
| `eth_getFilterLogs.Parameters` | \[`Quantity$1`\] | - |
| `eth_getFilterLogs.ReturnType` | `RpcLog`[] | - |
| <a id="eth_getlogs"></a> `eth_getLogs` | `object` | **Description** Returns a list of all logs based on a filter object **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => [{ ... }, { ... }]` |
| `eth_getLogs.Method` | `"eth_getLogs"` | - |
| `eth_getLogs.Parameters` | \[`object` & \{ `blockHash?`: `never`; `fromBlock?`: `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md); `toBlock?`: `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md); \} \| \{ `blockHash?`: [`Hash`](Hash.md); `fromBlock?`: `never`; `toBlock?`: `never`; \}\] | - |
| `eth_getLogs.ReturnType` | `RpcLog`[] | - |
| <a id="eth_getproof"></a> `eth_getProof` | `object` | **Description** Returns the account and storage values of the specified account including the Merkle-proof. **Link** https://eips.ethereum.org/EIPS/eip-1186 **Example** `provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] }) // => { // ... // }` |
| `eth_getProof.Method` | `"eth_getProof"` | - |
| `eth_getProof.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), [`Hash`](Hash.md)[], `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\] | - |
| `eth_getProof.ReturnType` | `RpcProof` | - |
| <a id="eth_getstorageat"></a> `eth_getStorageAt` | `object` | **Description** Returns the value from a storage position at an address **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] }) // => '0x...'` |
| `eth_getStorageAt.Method` | `"eth_getStorageAt"` | - |
| `eth_getStorageAt.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), `Quantity$1`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] | - |
| `eth_getStorageAt.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_gettransactionbyblockhashandindex"></a> `eth_getTransactionByBlockHashAndIndex` | `object` | **Description** Returns information about a transaction specified by block hash and transaction index **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... }` |
| `eth_getTransactionByBlockHashAndIndex.Method` | `"eth_getTransactionByBlockHashAndIndex"` | - |
| `eth_getTransactionByBlockHashAndIndex.Parameters` | \[[`Hash`](Hash.md), `Quantity$1`\] | - |
| `eth_getTransactionByBlockHashAndIndex.ReturnType` | `RpcTransaction` \| `null` | - |
| <a id="eth_gettransactionbyblocknumberandindex"></a> `eth_getTransactionByBlockNumberAndIndex` | `object` | **Description** Returns information about a transaction specified by block number and transaction index **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... }` |
| `eth_getTransactionByBlockNumberAndIndex.Method` | `"eth_getTransactionByBlockNumberAndIndex"` | - |
| `eth_getTransactionByBlockNumberAndIndex.Parameters` | \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `Quantity$1`\] | - |
| `eth_getTransactionByBlockNumberAndIndex.ReturnType` | `RpcTransaction` \| `null` | - |
| <a id="eth_gettransactionbyhash"></a> `eth_getTransactionByHash` | `object` | **Description** Returns information about a transaction specified by hash **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] }) // => { ... }` |
| `eth_getTransactionByHash.Method` | `"eth_getTransactionByHash"` | - |
| `eth_getTransactionByHash.Parameters` | \[[`Hash`](Hash.md)\] | - |
| `eth_getTransactionByHash.ReturnType` | `RpcTransaction` \| `null` | - |
| <a id="eth_gettransactioncount"></a> `eth_getTransactionCount` | `object` | **Description** Returns the number of transactions sent from an address **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] }) // => '0x1'` |
| `eth_getTransactionCount.Method` | `"eth_getTransactionCount"` | - |
| `eth_getTransactionCount.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] | - |
| `eth_getTransactionCount.ReturnType` | `Quantity$1` | - |
| <a id="eth_gettransactionreceipt"></a> `eth_getTransactionReceipt` | `object` | **Description** Returns the receipt of a transaction specified by hash **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] }) // => { ... }` |
| `eth_getTransactionReceipt.Method` | `"eth_getTransactionReceipt"` | - |
| `eth_getTransactionReceipt.Parameters` | \[[`Hash`](Hash.md)\] | - |
| `eth_getTransactionReceipt.ReturnType` | `RpcTransactionReceipt` \| `null` | - |
| <a id="eth_getunclebyblockhashandindex"></a> `eth_getUncleByBlockHashAndIndex` | `object` | **Description** Returns information about an uncle specified by block hash and uncle index position **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... }` |
| `eth_getUncleByBlockHashAndIndex.Method` | `"eth_getUncleByBlockHashAndIndex"` | - |
| `eth_getUncleByBlockHashAndIndex.Parameters` | \[[`Hash`](Hash.md), `Quantity$1`\] | - |
| `eth_getUncleByBlockHashAndIndex.ReturnType` | `RpcUncle` \| `null` | - |
| <a id="eth_getunclebyblocknumberandindex"></a> `eth_getUncleByBlockNumberAndIndex` | `object` | **Description** Returns information about an uncle specified by block number and uncle index position **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... }` |
| `eth_getUncleByBlockNumberAndIndex.Method` | `"eth_getUncleByBlockNumberAndIndex"` | - |
| `eth_getUncleByBlockNumberAndIndex.Parameters` | \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `Quantity$1`\] | - |
| `eth_getUncleByBlockNumberAndIndex.ReturnType` | `RpcUncle` \| `null` | - |
| <a id="eth_getunclecountbyblockhash"></a> `eth_getUncleCountByBlockHash` | `object` | **Description** Returns the number of uncles in a block specified by block hash **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] }) // => '0x1'` |
| `eth_getUncleCountByBlockHash.Method` | `"eth_getUncleCountByBlockHash"` | - |
| `eth_getUncleCountByBlockHash.Parameters` | \[[`Hash`](Hash.md)\] | - |
| `eth_getUncleCountByBlockHash.ReturnType` | `Quantity$1` | - |
| <a id="eth_getunclecountbyblocknumber"></a> `eth_getUncleCountByBlockNumber` | `object` | **Description** Returns the number of uncles in a block specified by block number **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] }) // => '0x1'` |
| `eth_getUncleCountByBlockNumber.Method` | `"eth_getUncleCountByBlockNumber"` | - |
| `eth_getUncleCountByBlockNumber.Parameters` | \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\] | - |
| `eth_getUncleCountByBlockNumber.ReturnType` | `Quantity$1` | - |
| <a id="eth_maxpriorityfeepergas"></a> `eth_maxPriorityFeePerGas` | `object` | **Description** Returns the current maxPriorityFeePerGas in wei. **Link** https://ethereum.github.io/execution-apis/api-documentation/ **Example** `provider.request({ method: 'eth_maxPriorityFeePerGas' }) // => '0x5f5e100'` |
| `eth_maxPriorityFeePerGas.Method` | `"eth_maxPriorityFeePerGas"` | - |
| `eth_maxPriorityFeePerGas.Parameters?` | `undefined` | - |
| `eth_maxPriorityFeePerGas.ReturnType` | `Quantity$1` | - |
| <a id="eth_newblockfilter"></a> `eth_newBlockFilter` | `object` | **Description** Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_newBlockFilter' }) // => '0x1'` |
| `eth_newBlockFilter.Method` | `"eth_newBlockFilter"` | - |
| `eth_newBlockFilter.Parameters?` | `undefined` | - |
| `eth_newBlockFilter.ReturnType` | `Quantity$1` | - |
| <a id="eth_newfilter"></a> `eth_newFilter` | `object` | **Description** Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => '0x1'` |
| `eth_newFilter.Method` | `"eth_newFilter"` | - |
| `eth_newFilter.Parameters` | \[`object`\] | - |
| `eth_newFilter.ReturnType` | `Quantity$1` | - |
| <a id="eth_newpendingtransactionfilter"></a> `eth_newPendingTransactionFilter` | `object` | **Description** Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_newPendingTransactionFilter' }) // => '0x1'` |
| `eth_newPendingTransactionFilter.Method` | `"eth_newPendingTransactionFilter"` | - |
| `eth_newPendingTransactionFilter.Parameters?` | `undefined` | - |
| `eth_newPendingTransactionFilter.ReturnType` | `Quantity$1` | - |
| <a id="eth_protocolversion"></a> `eth_protocolVersion` | `object` | **Description** Returns the current Ethereum protocol version **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_protocolVersion' }) // => '54'` |
| `eth_protocolVersion.Method` | `"eth_protocolVersion"` | - |
| `eth_protocolVersion.Parameters?` | `undefined` | - |
| `eth_protocolVersion.ReturnType` | `string` | - |
| <a id="eth_sendrawtransaction"></a> `eth_sendRawTransaction` | `object` | **Description** Sends a **signed** transaction to the network **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...'` |
| `eth_sendRawTransaction.Method` | `"eth_sendRawTransaction"` | - |
| `eth_sendRawTransaction.Parameters` | \[[`Hex`](../../index/type-aliases/Hex.md)\] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](Hash.md) | - |
| <a id="eth_uninstallfilter"></a> `eth_uninstallFilter` | `object` | **Description** Destroys a filter based on filter ID **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] }) // => true` |
| `eth_uninstallFilter.Method` | `"eth_uninstallFilter"` | - |
| `eth_uninstallFilter.Parameters` | \[`Quantity$1`\] | - |
| `eth_uninstallFilter.ReturnType` | `boolean` | - |
| <a id="net_listening"></a> `net_listening` | `object` | **Description** Determines if this client is listening for new network connections **Example** `provider.request({ method: 'net_listening' }) // => true` |
| `net_listening.Method` | `"net_listening"` | - |
| `net_listening.Parameters?` | `undefined` | - |
| `net_listening.ReturnType` | `boolean` | - |
| <a id="net_peercount"></a> `net_peerCount` | `object` | **Description** Returns the number of peers currently connected to this client **Example** `provider.request({ method: 'net_peerCount' }) // => '0x1'` |
| `net_peerCount.Method` | `"net_peerCount"` | - |
| `net_peerCount.Parameters?` | `undefined` | - |
| `net_peerCount.ReturnType` | `Quantity$1` | - |
| <a id="net_version"></a> `net_version` | `object` | **Description** Returns the chain ID associated with the current network **Example** `provider.request({ method: 'net_version' }) // => '1'` |
| `net_version.Method` | `"net_version"` | - |
| `net_version.Parameters?` | `undefined` | - |
| `net_version.ReturnType` | `Quantity$1` | - |
| <a id="web3_clientversion"></a> `web3_clientVersion` | `object` | **Description** Returns the version of the current client **Example** `provider.request({ method: 'web3_clientVersion' }) // => 'MetaMask/v1.0.0'` |
| `web3_clientVersion.Method` | `"web3_clientVersion"` | - |
| `web3_clientVersion.Parameters?` | `undefined` | - |
| `web3_clientVersion.ReturnType` | `string` | - |
| <a id="web3_sha3"></a> `web3_sha3` | `object` | **Description** Hashes data using the Keccak-256 algorithm **Example** `provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] }) // => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'` |
| `web3_sha3.Method` | `"web3_sha3"` | - |
| `web3_sha3.Parameters` | \[[`Hash`](Hash.md)\] | - |
| `web3_sha3.ReturnType` | `string` | - |
