---
editUrl: false
next: false
prev: false
title: "JsonRpcSchemaPublic"
---

> **JsonRpcSchemaPublic**: `object`

## Type declaration

### eth\_blobGasPrice

> **eth\_blobGasPrice**: `object`

#### Description

Returns the current blob price of gas expressed in wei

#### Example

```ts
provider.request({ method: 'eth_blobGasPrice' })
// => '0x09184e72a000'
```

### eth\_blobGasPrice.Method

> **eth\_blobGasPrice.Method**: `"eth_blobGasPrice"`

### eth\_blobGasPrice.Parameters?

> `optional` **eth\_blobGasPrice.Parameters**: `undefined`

### eth\_blobGasPrice.ReturnType

> **eth\_blobGasPrice.ReturnType**: `Quantity`

### eth\_blockNumber

> **eth\_blockNumber**: `object`

#### Description

Returns the number of the most recent block seen by this client

#### Example

```ts
provider.request({ method: 'eth_blockNumber' })
// => '0x1b4'
```

### eth\_blockNumber.Method

> **eth\_blockNumber.Method**: `"eth_blockNumber"`

### eth\_blockNumber.Parameters?

> `optional` **eth\_blockNumber.Parameters**: `undefined`

### eth\_blockNumber.ReturnType

> **eth\_blockNumber.ReturnType**: `Quantity`

### eth\_call

> **eth\_call**: `object`

#### Description

Executes a new message call immediately without submitting a transaction to the network

#### Example

```ts
provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] })
// => '0x...'
```

### eth\_call.Method

> **eth\_call.Method**: `"eth_call"`

### eth\_call.Parameters

> **eth\_call.Parameters**: [`Partial`\<`TransactionRequest`\>] \| [`Partial`\<`TransactionRequest`\>, `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`] \| [`Partial`\<`TransactionRequest`\>, `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`, `RpcStateOverride`]

### eth\_call.ReturnType

> **eth\_call.ReturnType**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### eth\_chainId

> **eth\_chainId**: `object`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

### eth\_chainId.Method

> **eth\_chainId.Method**: `"eth_chainId"`

### eth\_chainId.Parameters?

> `optional` **eth\_chainId.Parameters**: `undefined`

### eth\_chainId.ReturnType

> **eth\_chainId.ReturnType**: `Quantity`

### eth\_coinbase

> **eth\_coinbase**: `object`

#### Description

Returns the client coinbase address.

#### Example

```ts
provider.request({ method: 'eth_coinbase' })
// => '0x...'
```

### eth\_coinbase.Method

> **eth\_coinbase.Method**: `"eth_coinbase"`

### eth\_coinbase.Parameters?

> `optional` **eth\_coinbase.Parameters**: `undefined`

### eth\_coinbase.ReturnType

> **eth\_coinbase.ReturnType**: [`Address`](/reference/tevm/utils/type-aliases/address/)

### eth\_estimateGas

> **eth\_estimateGas**: `object`

#### Description

Estimates the gas necessary to complete a transaction without submitting it to the network

#### Example

```ts
provider.request({
 method: 'eth_estimateGas',
 params: [{ from: '0x...', to: '0x...', value: '0x...' }]
})
// => '0x5208'
```

### eth\_estimateGas.Method

> **eth\_estimateGas.Method**: `"eth_estimateGas"`

### eth\_estimateGas.Parameters

> **eth\_estimateGas.Parameters**: [`TransactionRequest`] \| [`TransactionRequest`, `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)]

### eth\_estimateGas.ReturnType

> **eth\_estimateGas.ReturnType**: `Quantity`

### eth\_feeHistory

> **eth\_feeHistory**: `object`

#### Description

Returns a collection of historical gas information

#### Example

```ts
provider.request({
 method: 'eth_feeHistory',
 params: ['4', 'latest', ['25', '75']]
})
// => {
//   oldestBlock: '0x1',
//   baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'],
//   gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'],
//   reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']]
// }
```

### eth\_feeHistory.Method

> **eth\_feeHistory.Method**: `"eth_feeHistory"`

### eth\_feeHistory.Parameters

> **eth\_feeHistory.Parameters**: [`Quantity`, `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `number`[] \| `undefined`]

### eth\_feeHistory.ReturnType

> **eth\_feeHistory.ReturnType**: `FeeHistory`

### eth\_gasPrice

> **eth\_gasPrice**: `object`

#### Description

Returns the current price of gas expressed in wei

#### Example

```ts
provider.request({ method: 'eth_gasPrice' })
// => '0x09184e72a000'
```

### eth\_gasPrice.Method

> **eth\_gasPrice.Method**: `"eth_gasPrice"`

### eth\_gasPrice.Parameters?

> `optional` **eth\_gasPrice.Parameters**: `undefined`

### eth\_gasPrice.ReturnType

> **eth\_gasPrice.ReturnType**: `Quantity`

### eth\_getBalance

> **eth\_getBalance**: `object`

#### Description

Returns the balance of an address in wei

#### Example

```ts
provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] })
// => '0x12a05...'
```

### eth\_getBalance.Method

> **eth\_getBalance.Method**: `"eth_getBalance"`

### eth\_getBalance.Parameters

> **eth\_getBalance.Parameters**: [[`Address`](/reference/tevm/utils/type-aliases/address/), `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`]

### eth\_getBalance.ReturnType

> **eth\_getBalance.ReturnType**: `Quantity`

### eth\_getBlockByHash

> **eth\_getBlockByHash**: `object`

#### Description

Returns information about a block specified by hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] })
// => {
//   number: '0x1b4',
//   hash: '0x...',
//   parentHash: '0x...',
//   ...
// }
```

### eth\_getBlockByHash.Method

> **eth\_getBlockByHash.Method**: `"eth_getBlockByHash"`

### eth\_getBlockByHash.Parameters

> **eth\_getBlockByHash.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/), `boolean`]

### eth\_getBlockByHash.ReturnType

> **eth\_getBlockByHash.ReturnType**: `Block` \| `null`

### eth\_getBlockByNumber

> **eth\_getBlockByNumber**: `object`

#### Description

Returns information about a block specified by number

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] })
// => {
//   number: '0x1b4',
//   hash: '0x...',
//   parentHash: '0x...',
//   ...
// }
```

### eth\_getBlockByNumber.Method

> **eth\_getBlockByNumber.Method**: `"eth_getBlockByNumber"`

### eth\_getBlockByNumber.Parameters

> **eth\_getBlockByNumber.Parameters**: [`BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `boolean`]

### eth\_getBlockByNumber.ReturnType

> **eth\_getBlockByNumber.ReturnType**: `Block` \| `null`

### eth\_getBlockTransactionCountByHash

> **eth\_getBlockTransactionCountByHash**: `object`

#### Description

Returns the number of transactions in a block specified by block hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] })
// => '0x1'
```

### eth\_getBlockTransactionCountByHash.Method

> **eth\_getBlockTransactionCountByHash.Method**: `"eth_getBlockTransactionCountByHash"`

### eth\_getBlockTransactionCountByHash.Parameters

> **eth\_getBlockTransactionCountByHash.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/)]

### eth\_getBlockTransactionCountByHash.ReturnType

> **eth\_getBlockTransactionCountByHash.ReturnType**: `Quantity`

### eth\_getBlockTransactionCountByNumber

> **eth\_getBlockTransactionCountByNumber**: `object`

#### Description

Returns the number of transactions in a block specified by block number

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] })
// => '0x1'
```

### eth\_getBlockTransactionCountByNumber.Method

> **eth\_getBlockTransactionCountByNumber.Method**: `"eth_getBlockTransactionCountByNumber"`

### eth\_getBlockTransactionCountByNumber.Parameters

> **eth\_getBlockTransactionCountByNumber.Parameters**: [`BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)]

### eth\_getBlockTransactionCountByNumber.ReturnType

> **eth\_getBlockTransactionCountByNumber.ReturnType**: `Quantity`

### eth\_getCode

> **eth\_getCode**: `object`

#### Description

Returns the contract code stored at a given address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] })
// => '0x...'
```

### eth\_getCode.Method

> **eth\_getCode.Method**: `"eth_getCode"`

### eth\_getCode.Parameters

> **eth\_getCode.Parameters**: [[`Address`](/reference/tevm/utils/type-aliases/address/), `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`]

### eth\_getCode.ReturnType

> **eth\_getCode.ReturnType**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### eth\_getFilterChanges

> **eth\_getFilterChanges**: `object`

#### Description

Returns a list of all logs based on filter ID since the last log retrieval

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] })
// => [{ ... }, { ... }]
```

### eth\_getFilterChanges.Method

> **eth\_getFilterChanges.Method**: `"eth_getFilterChanges"`

### eth\_getFilterChanges.Parameters

> **eth\_getFilterChanges.Parameters**: [`Quantity`]

### eth\_getFilterChanges.ReturnType

> **eth\_getFilterChanges.ReturnType**: `Log`[] \| [`Hex`](/reference/tevm/utils/type-aliases/hex/)[]

### eth\_getFilterLogs

> **eth\_getFilterLogs**: `object`

#### Description

Returns a list of all logs based on filter ID

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] })
// => [{ ... }, { ... }]
```

### eth\_getFilterLogs.Method

> **eth\_getFilterLogs.Method**: `"eth_getFilterLogs"`

### eth\_getFilterLogs.Parameters

> **eth\_getFilterLogs.Parameters**: [`Quantity`]

### eth\_getFilterLogs.ReturnType

> **eth\_getFilterLogs.ReturnType**: `Log`[]

### eth\_getLogs

> **eth\_getLogs**: `object`

#### Description

Returns a list of all logs based on a filter object

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
// => [{ ... }, { ... }]
```

### eth\_getLogs.Method

> **eth\_getLogs.Method**: `"eth_getLogs"`

### eth\_getLogs.Parameters

> **eth\_getLogs.Parameters**: [`object` & `object` \| `object`]

### eth\_getLogs.ReturnType

> **eth\_getLogs.ReturnType**: `Log`[]

### eth\_getProof

> **eth\_getProof**: `object`

#### Description

Returns the account and storage values of the specified account including the Merkle-proof.

#### Link

https://eips.ethereum.org/EIPS/eip-1186

#### Example

```ts
provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] })
// => {
//   ...
// }
```

### eth\_getProof.Method

> **eth\_getProof.Method**: `"eth_getProof"`

### eth\_getProof.Parameters

> **eth\_getProof.Parameters**: [[`Address`](/reference/tevm/utils/type-aliases/address/), [`Hash`](/reference/tevm/decorators/type-aliases/hash/)[], `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)]

### eth\_getProof.ReturnType

> **eth\_getProof.ReturnType**: `Proof`

### eth\_getStorageAt

> **eth\_getStorageAt**: `object`

#### Description

Returns the value from a storage position at an address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] })
// => '0x...'
```

### eth\_getStorageAt.Method

> **eth\_getStorageAt.Method**: `"eth_getStorageAt"`

### eth\_getStorageAt.Parameters

> **eth\_getStorageAt.Parameters**: [[`Address`](/reference/tevm/utils/type-aliases/address/), `Quantity`, `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`]

### eth\_getStorageAt.ReturnType

> **eth\_getStorageAt.ReturnType**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### eth\_getTransactionByBlockHashAndIndex

> **eth\_getTransactionByBlockHashAndIndex**: `object`

#### Description

Returns information about a transaction specified by block hash and transaction index

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

### eth\_getTransactionByBlockHashAndIndex.Method

> **eth\_getTransactionByBlockHashAndIndex.Method**: `"eth_getTransactionByBlockHashAndIndex"`

### eth\_getTransactionByBlockHashAndIndex.Parameters

> **eth\_getTransactionByBlockHashAndIndex.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/), `Quantity`]

### eth\_getTransactionByBlockHashAndIndex.ReturnType

> **eth\_getTransactionByBlockHashAndIndex.ReturnType**: `Transaction` \| `null`

### eth\_getTransactionByBlockNumberAndIndex

> **eth\_getTransactionByBlockNumberAndIndex**: `object`

#### Description

Returns information about a transaction specified by block number and transaction index

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

### eth\_getTransactionByBlockNumberAndIndex.Method

> **eth\_getTransactionByBlockNumberAndIndex.Method**: `"eth_getTransactionByBlockNumberAndIndex"`

### eth\_getTransactionByBlockNumberAndIndex.Parameters

> **eth\_getTransactionByBlockNumberAndIndex.Parameters**: [`BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `Quantity`]

### eth\_getTransactionByBlockNumberAndIndex.ReturnType

> **eth\_getTransactionByBlockNumberAndIndex.ReturnType**: `Transaction` \| `null`

### eth\_getTransactionByHash

> **eth\_getTransactionByHash**: `object`

#### Description

Returns information about a transaction specified by hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] })
// => { ... }
```

### eth\_getTransactionByHash.Method

> **eth\_getTransactionByHash.Method**: `"eth_getTransactionByHash"`

### eth\_getTransactionByHash.Parameters

> **eth\_getTransactionByHash.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/)]

### eth\_getTransactionByHash.ReturnType

> **eth\_getTransactionByHash.ReturnType**: `Transaction` \| `null`

### eth\_getTransactionCount

> **eth\_getTransactionCount**: `object`

#### Description

Returns the number of transactions sent from an address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] })
// => '0x1'
```

### eth\_getTransactionCount.Method

> **eth\_getTransactionCount.Method**: `"eth_getTransactionCount"`

### eth\_getTransactionCount.Parameters

> **eth\_getTransactionCount.Parameters**: [[`Address`](/reference/tevm/utils/type-aliases/address/), `BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `BlockIdentifier`]

### eth\_getTransactionCount.ReturnType

> **eth\_getTransactionCount.ReturnType**: `Quantity`

### eth\_getTransactionReceipt

> **eth\_getTransactionReceipt**: `object`

#### Description

Returns the receipt of a transaction specified by hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] })
// => { ... }
```

### eth\_getTransactionReceipt.Method

> **eth\_getTransactionReceipt.Method**: `"eth_getTransactionReceipt"`

### eth\_getTransactionReceipt.Parameters

> **eth\_getTransactionReceipt.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/)]

### eth\_getTransactionReceipt.ReturnType

> **eth\_getTransactionReceipt.ReturnType**: `TransactionReceipt` \| `null`

### eth\_getUncleByBlockHashAndIndex

> **eth\_getUncleByBlockHashAndIndex**: `object`

#### Description

Returns information about an uncle specified by block hash and uncle index position

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

### eth\_getUncleByBlockHashAndIndex.Method

> **eth\_getUncleByBlockHashAndIndex.Method**: `"eth_getUncleByBlockHashAndIndex"`

### eth\_getUncleByBlockHashAndIndex.Parameters

> **eth\_getUncleByBlockHashAndIndex.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/), `Quantity`]

### eth\_getUncleByBlockHashAndIndex.ReturnType

> **eth\_getUncleByBlockHashAndIndex.ReturnType**: `Uncle` \| `null`

### eth\_getUncleByBlockNumberAndIndex

> **eth\_getUncleByBlockNumberAndIndex**: `object`

#### Description

Returns information about an uncle specified by block number and uncle index position

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

### eth\_getUncleByBlockNumberAndIndex.Method

> **eth\_getUncleByBlockNumberAndIndex.Method**: `"eth_getUncleByBlockNumberAndIndex"`

### eth\_getUncleByBlockNumberAndIndex.Parameters

> **eth\_getUncleByBlockNumberAndIndex.Parameters**: [`BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `Quantity`]

### eth\_getUncleByBlockNumberAndIndex.ReturnType

> **eth\_getUncleByBlockNumberAndIndex.ReturnType**: `Uncle` \| `null`

### eth\_getUncleCountByBlockHash

> **eth\_getUncleCountByBlockHash**: `object`

#### Description

Returns the number of uncles in a block specified by block hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] })
// => '0x1'
```

### eth\_getUncleCountByBlockHash.Method

> **eth\_getUncleCountByBlockHash.Method**: `"eth_getUncleCountByBlockHash"`

### eth\_getUncleCountByBlockHash.Parameters

> **eth\_getUncleCountByBlockHash.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/)]

### eth\_getUncleCountByBlockHash.ReturnType

> **eth\_getUncleCountByBlockHash.ReturnType**: `Quantity`

### eth\_getUncleCountByBlockNumber

> **eth\_getUncleCountByBlockNumber**: `object`

#### Description

Returns the number of uncles in a block specified by block number

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] })
// => '0x1'
```

### eth\_getUncleCountByBlockNumber.Method

> **eth\_getUncleCountByBlockNumber.Method**: `"eth_getUncleCountByBlockNumber"`

### eth\_getUncleCountByBlockNumber.Parameters

> **eth\_getUncleCountByBlockNumber.Parameters**: [`BlockNumber` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)]

### eth\_getUncleCountByBlockNumber.ReturnType

> **eth\_getUncleCountByBlockNumber.ReturnType**: `Quantity`

### eth\_maxPriorityFeePerGas

> **eth\_maxPriorityFeePerGas**: `object`

#### Description

Returns the current maxPriorityFeePerGas in wei.

#### Link

https://ethereum.github.io/execution-apis/api-documentation/

#### Example

```ts
provider.request({ method: 'eth_maxPriorityFeePerGas' })
// => '0x5f5e100'
```

### eth\_maxPriorityFeePerGas.Method

> **eth\_maxPriorityFeePerGas.Method**: `"eth_maxPriorityFeePerGas"`

### eth\_maxPriorityFeePerGas.Parameters?

> `optional` **eth\_maxPriorityFeePerGas.Parameters**: `undefined`

### eth\_maxPriorityFeePerGas.ReturnType

> **eth\_maxPriorityFeePerGas.ReturnType**: `Quantity`

### eth\_newBlockFilter

> **eth\_newBlockFilter**: `object`

#### Description

Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newBlockFilter' })
// => '0x1'
```

### eth\_newBlockFilter.Method

> **eth\_newBlockFilter.Method**: `"eth_newBlockFilter"`

### eth\_newBlockFilter.Parameters?

> `optional` **eth\_newBlockFilter.Parameters**: `undefined`

### eth\_newBlockFilter.ReturnType

> **eth\_newBlockFilter.ReturnType**: `Quantity`

### eth\_newFilter

> **eth\_newFilter**: `object`

#### Description

Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
// => '0x1'
```

### eth\_newFilter.Method

> **eth\_newFilter.Method**: `"eth_newFilter"`

### eth\_newFilter.Parameters

> **eth\_newFilter.Parameters**: [`object`]

### eth\_newFilter.ReturnType

> **eth\_newFilter.ReturnType**: `Quantity`

### eth\_newPendingTransactionFilter

> **eth\_newPendingTransactionFilter**: `object`

#### Description

Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newPendingTransactionFilter' })
// => '0x1'
```

### eth\_newPendingTransactionFilter.Method

> **eth\_newPendingTransactionFilter.Method**: `"eth_newPendingTransactionFilter"`

### eth\_newPendingTransactionFilter.Parameters?

> `optional` **eth\_newPendingTransactionFilter.Parameters**: `undefined`

### eth\_newPendingTransactionFilter.ReturnType

> **eth\_newPendingTransactionFilter.ReturnType**: `Quantity`

### eth\_protocolVersion

> **eth\_protocolVersion**: `object`

#### Description

Returns the current Ethereum protocol version

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_protocolVersion' })
// => '54'
```

### eth\_protocolVersion.Method

> **eth\_protocolVersion.Method**: `"eth_protocolVersion"`

### eth\_protocolVersion.Parameters?

> `optional` **eth\_protocolVersion.Parameters**: `undefined`

### eth\_protocolVersion.ReturnType

> **eth\_protocolVersion.ReturnType**: `string`

### eth\_sendRawTransaction

> **eth\_sendRawTransaction**: `object`

#### Description

Sends a **signed** transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
// => '0x...'
```

### eth\_sendRawTransaction.Method

> **eth\_sendRawTransaction.Method**: `"eth_sendRawTransaction"`

### eth\_sendRawTransaction.Parameters

> **eth\_sendRawTransaction.Parameters**: [[`Hex`](/reference/tevm/utils/type-aliases/hex/)]

### eth\_sendRawTransaction.ReturnType

> **eth\_sendRawTransaction.ReturnType**: [`Hash`](/reference/tevm/decorators/type-aliases/hash/)

### eth\_uninstallFilter

> **eth\_uninstallFilter**: `object`

#### Description

Destroys a filter based on filter ID

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
// => true
```

### eth\_uninstallFilter.Method

> **eth\_uninstallFilter.Method**: `"eth_uninstallFilter"`

### eth\_uninstallFilter.Parameters

> **eth\_uninstallFilter.Parameters**: [`Quantity`]

### eth\_uninstallFilter.ReturnType

> **eth\_uninstallFilter.ReturnType**: `boolean`

### net\_listening

> **net\_listening**: `object`

#### Description

Determines if this client is listening for new network connections

#### Example

```ts
provider.request({ method: 'net_listening' })
// => true
```

### net\_listening.Method

> **net\_listening.Method**: `"net_listening"`

### net\_listening.Parameters?

> `optional` **net\_listening.Parameters**: `undefined`

### net\_listening.ReturnType

> **net\_listening.ReturnType**: `boolean`

### net\_peerCount

> **net\_peerCount**: `object`

#### Description

Returns the number of peers currently connected to this client

#### Example

```ts
provider.request({ method: 'net_peerCount' })
// => '0x1'
```

### net\_peerCount.Method

> **net\_peerCount.Method**: `"net_peerCount"`

### net\_peerCount.Parameters?

> `optional` **net\_peerCount.Parameters**: `undefined`

### net\_peerCount.ReturnType

> **net\_peerCount.ReturnType**: `Quantity`

### net\_version

> **net\_version**: `object`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'net_version' })
// => '1'
```

### net\_version.Method

> **net\_version.Method**: `"net_version"`

### net\_version.Parameters?

> `optional` **net\_version.Parameters**: `undefined`

### net\_version.ReturnType

> **net\_version.ReturnType**: `Quantity`

### web3\_clientVersion

> **web3\_clientVersion**: `object`

#### Description

Returns the version of the current client

#### Example

```ts
provider.request({ method: 'web3_clientVersion' })
// => 'MetaMask/v1.0.0'
```

### web3\_clientVersion.Method

> **web3\_clientVersion.Method**: `"web3_clientVersion"`

### web3\_clientVersion.Parameters?

> `optional` **web3\_clientVersion.Parameters**: `undefined`

### web3\_clientVersion.ReturnType

> **web3\_clientVersion.ReturnType**: `string`

### web3\_sha3

> **web3\_sha3**: `object`

#### Description

Hashes data using the Keccak-256 algorithm

#### Example

```ts
provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] })
// => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
```

### web3\_sha3.Method

> **web3\_sha3.Method**: `"web3_sha3"`

### web3\_sha3.Parameters

> **web3\_sha3.Parameters**: [[`Hash`](/reference/tevm/decorators/type-aliases/hash/)]

### web3\_sha3.ReturnType

> **web3\_sha3.ReturnType**: `string`

## Defined in

[eip1193/JsonRpcSchemaPublic.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L24)
