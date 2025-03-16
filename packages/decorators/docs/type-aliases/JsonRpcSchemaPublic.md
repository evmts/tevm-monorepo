[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaPublic

# Type Alias: JsonRpcSchemaPublic

> **JsonRpcSchemaPublic**: `object`

Defined in: [eip1193/JsonRpcSchemaPublic.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L46)

Type definitions for standard Ethereum JSON-RPC methods accessible to the public.
Includes methods related to network info, blocks, transactions, and state queries.

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

#### eth\_blobGasPrice.Method

> **Method**: `"eth_blobGasPrice"`

#### eth\_blobGasPrice.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_blobGasPrice.ReturnType

> **ReturnType**: `Quantity`

### eth\_blockNumber

> **eth\_blockNumber**: `object`

#### Description

Returns the number of the most recent block seen by this client

#### Example

```ts
provider.request({ method: 'eth_blockNumber' })
// => '0x1b4'
```

#### eth\_blockNumber.Method

> **Method**: `"eth_blockNumber"`

#### eth\_blockNumber.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_blockNumber.ReturnType

> **ReturnType**: `Quantity`

### eth\_call

> **eth\_call**: `object`

#### Description

Executes a new message call immediately without submitting a transaction to the network

#### Example

```ts
provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] })
// => '0x...'
```

#### eth\_call.Method

> **Method**: `"eth_call"`

#### eth\_call.Parameters

> **Parameters**: \[`Partial`\<`TransactionRequest`\>\] \| \[`Partial`\<`TransactionRequest`\>, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\] \| \[`Partial`\<`TransactionRequest`\>, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`, `RpcStateOverride`\]

#### eth\_call.ReturnType

> **ReturnType**: `Hex`

### eth\_chainId

> **eth\_chainId**: `object`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

#### eth\_chainId.Method

> **Method**: `"eth_chainId"`

#### eth\_chainId.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_chainId.ReturnType

> **ReturnType**: `Quantity`

### eth\_coinbase

> **eth\_coinbase**: `object`

#### Description

Returns the client coinbase address.

#### Example

```ts
provider.request({ method: 'eth_coinbase' })
// => '0x...'
```

#### eth\_coinbase.Method

> **Method**: `"eth_coinbase"`

#### eth\_coinbase.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_coinbase.ReturnType

> **ReturnType**: `Address`

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

#### eth\_estimateGas.Method

> **Method**: `"eth_estimateGas"`

#### eth\_estimateGas.Parameters

> **Parameters**: \[`TransactionRequest`\] \| \[`TransactionRequest`, `BlockNumber` \| `BlockTag`\]

#### eth\_estimateGas.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_feeHistory.Method

> **Method**: `"eth_feeHistory"`

#### eth\_feeHistory.Parameters

> **Parameters**: \[`Quantity`, `BlockNumber` \| `BlockTag`, `number`[] \| `undefined`\]

#### eth\_feeHistory.ReturnType

> **ReturnType**: `FeeHistory`

### eth\_gasPrice

> **eth\_gasPrice**: `object`

#### Description

Returns the current price of gas expressed in wei

#### Example

```ts
provider.request({ method: 'eth_gasPrice' })
// => '0x09184e72a000'
```

#### eth\_gasPrice.Method

> **Method**: `"eth_gasPrice"`

#### eth\_gasPrice.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_gasPrice.ReturnType

> **ReturnType**: `Quantity`

### eth\_getBalance

> **eth\_getBalance**: `object`

#### Description

Returns the balance of an address in wei

#### Example

```ts
provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] })
// => '0x12a05...'
```

#### eth\_getBalance.Method

> **Method**: `"eth_getBalance"`

#### eth\_getBalance.Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### eth\_getBalance.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_getBlockByHash.Method

> **Method**: `"eth_getBlockByHash"`

#### eth\_getBlockByHash.Parameters

> **Parameters**: \[[`Hash`](Hash.md), `boolean`\]

#### eth\_getBlockByHash.ReturnType

> **ReturnType**: `Block` \| `null`

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

#### eth\_getBlockByNumber.Method

> **Method**: `"eth_getBlockByNumber"`

#### eth\_getBlockByNumber.Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `boolean`\]

#### eth\_getBlockByNumber.ReturnType

> **ReturnType**: `Block` \| `null`

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

#### eth\_getBlockTransactionCountByHash.Method

> **Method**: `"eth_getBlockTransactionCountByHash"`

#### eth\_getBlockTransactionCountByHash.Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### eth\_getBlockTransactionCountByHash.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_getBlockTransactionCountByNumber.Method

> **Method**: `"eth_getBlockTransactionCountByNumber"`

#### eth\_getBlockTransactionCountByNumber.Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`\]

#### eth\_getBlockTransactionCountByNumber.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_getCode.Method

> **Method**: `"eth_getCode"`

#### eth\_getCode.Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### eth\_getCode.ReturnType

> **ReturnType**: `Hex`

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

#### eth\_getFilterChanges.Method

> **Method**: `"eth_getFilterChanges"`

#### eth\_getFilterChanges.Parameters

> **Parameters**: \[`Quantity`\]

#### eth\_getFilterChanges.ReturnType

> **ReturnType**: `Log`[] \| `Hex`[]

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

#### eth\_getFilterLogs.Method

> **Method**: `"eth_getFilterLogs"`

#### eth\_getFilterLogs.Parameters

> **Parameters**: \[`Quantity`\]

#### eth\_getFilterLogs.ReturnType

> **ReturnType**: `Log`[]

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

#### eth\_getLogs.Method

> **Method**: `"eth_getLogs"`

#### eth\_getLogs.Parameters

> **Parameters**: \[`object` & \{ `blockHash`: `never`; `fromBlock`: `BlockNumber` \| `BlockTag`; `toBlock`: `BlockNumber` \| `BlockTag`; \} \| \{ `blockHash`: [`Hash`](Hash.md); `fromBlock`: `never`; `toBlock`: `never`; \}\]

#### eth\_getLogs.ReturnType

> **ReturnType**: `Log`[]

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

#### eth\_getProof.Method

> **Method**: `"eth_getProof"`

#### eth\_getProof.Parameters

> **Parameters**: \[`Address`, [`Hash`](Hash.md)[], `BlockNumber` \| `BlockTag`\]

#### eth\_getProof.ReturnType

> **ReturnType**: `Proof`

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

#### eth\_getStorageAt.Method

> **Method**: `"eth_getStorageAt"`

#### eth\_getStorageAt.Parameters

> **Parameters**: \[`Address`, `Quantity`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### eth\_getStorageAt.ReturnType

> **ReturnType**: `Hex`

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

#### eth\_getTransactionByBlockHashAndIndex.Method

> **Method**: `"eth_getTransactionByBlockHashAndIndex"`

#### eth\_getTransactionByBlockHashAndIndex.Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity`\]

#### eth\_getTransactionByBlockHashAndIndex.ReturnType

> **ReturnType**: `Transaction` \| `null`

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

#### eth\_getTransactionByBlockNumberAndIndex.Method

> **Method**: `"eth_getTransactionByBlockNumberAndIndex"`

#### eth\_getTransactionByBlockNumberAndIndex.Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `Quantity`\]

#### eth\_getTransactionByBlockNumberAndIndex.ReturnType

> **ReturnType**: `Transaction` \| `null`

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

#### eth\_getTransactionByHash.Method

> **Method**: `"eth_getTransactionByHash"`

#### eth\_getTransactionByHash.Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### eth\_getTransactionByHash.ReturnType

> **ReturnType**: `Transaction` \| `null`

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

#### eth\_getTransactionCount.Method

> **Method**: `"eth_getTransactionCount"`

#### eth\_getTransactionCount.Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### eth\_getTransactionCount.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_getTransactionReceipt.Method

> **Method**: `"eth_getTransactionReceipt"`

#### eth\_getTransactionReceipt.Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### eth\_getTransactionReceipt.ReturnType

> **ReturnType**: `TransactionReceipt` \| `null`

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

#### eth\_getUncleByBlockHashAndIndex.Method

> **Method**: `"eth_getUncleByBlockHashAndIndex"`

#### eth\_getUncleByBlockHashAndIndex.Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity`\]

#### eth\_getUncleByBlockHashAndIndex.ReturnType

> **ReturnType**: `Uncle` \| `null`

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

#### eth\_getUncleByBlockNumberAndIndex.Method

> **Method**: `"eth_getUncleByBlockNumberAndIndex"`

#### eth\_getUncleByBlockNumberAndIndex.Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `Quantity`\]

#### eth\_getUncleByBlockNumberAndIndex.ReturnType

> **ReturnType**: `Uncle` \| `null`

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

#### eth\_getUncleCountByBlockHash.Method

> **Method**: `"eth_getUncleCountByBlockHash"`

#### eth\_getUncleCountByBlockHash.Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### eth\_getUncleCountByBlockHash.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_getUncleCountByBlockNumber.Method

> **Method**: `"eth_getUncleCountByBlockNumber"`

#### eth\_getUncleCountByBlockNumber.Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`\]

#### eth\_getUncleCountByBlockNumber.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_maxPriorityFeePerGas.Method

> **Method**: `"eth_maxPriorityFeePerGas"`

#### eth\_maxPriorityFeePerGas.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_maxPriorityFeePerGas.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_newBlockFilter.Method

> **Method**: `"eth_newBlockFilter"`

#### eth\_newBlockFilter.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_newBlockFilter.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_newFilter.Method

> **Method**: `"eth_newFilter"`

#### eth\_newFilter.Parameters

> **Parameters**: \[`object`\]

#### eth\_newFilter.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_newPendingTransactionFilter.Method

> **Method**: `"eth_newPendingTransactionFilter"`

#### eth\_newPendingTransactionFilter.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_newPendingTransactionFilter.ReturnType

> **ReturnType**: `Quantity`

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

#### eth\_protocolVersion.Method

> **Method**: `"eth_protocolVersion"`

#### eth\_protocolVersion.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_protocolVersion.ReturnType

> **ReturnType**: `string`

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

#### eth\_sendRawTransaction.Method

> **Method**: `"eth_sendRawTransaction"`

#### eth\_sendRawTransaction.Parameters

> **Parameters**: \[`Hex`\]

#### eth\_sendRawTransaction.ReturnType

> **ReturnType**: [`Hash`](Hash.md)

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

#### eth\_uninstallFilter.Method

> **Method**: `"eth_uninstallFilter"`

#### eth\_uninstallFilter.Parameters

> **Parameters**: \[`Quantity`\]

#### eth\_uninstallFilter.ReturnType

> **ReturnType**: `boolean`

### net\_listening

> **net\_listening**: `object`

#### Description

Determines if this client is listening for new network connections

#### Example

```ts
provider.request({ method: 'net_listening' })
// => true
```

#### net\_listening.Method

> **Method**: `"net_listening"`

#### net\_listening.Parameters?

> `optional` **Parameters**: `undefined`

#### net\_listening.ReturnType

> **ReturnType**: `boolean`

### net\_peerCount

> **net\_peerCount**: `object`

#### Description

Returns the number of peers currently connected to this client

#### Example

```ts
provider.request({ method: 'net_peerCount' })
// => '0x1'
```

#### net\_peerCount.Method

> **Method**: `"net_peerCount"`

#### net\_peerCount.Parameters?

> `optional` **Parameters**: `undefined`

#### net\_peerCount.ReturnType

> **ReturnType**: `Quantity`

### net\_version

> **net\_version**: `object`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'net_version' })
// => '1'
```

#### net\_version.Method

> **Method**: `"net_version"`

#### net\_version.Parameters?

> `optional` **Parameters**: `undefined`

#### net\_version.ReturnType

> **ReturnType**: `Quantity`

### web3\_clientVersion

> **web3\_clientVersion**: `object`

#### Description

Returns the version of the current client

#### Example

```ts
provider.request({ method: 'web3_clientVersion' })
// => 'MetaMask/v1.0.0'
```

#### web3\_clientVersion.Method

> **Method**: `"web3_clientVersion"`

#### web3\_clientVersion.Parameters?

> `optional` **Parameters**: `undefined`

#### web3\_clientVersion.ReturnType

> **ReturnType**: `string`

### web3\_sha3

> **web3\_sha3**: `object`

#### Description

Hashes data using the Keccak-256 algorithm

#### Example

```ts
provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] })
// => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
```

#### web3\_sha3.Method

> **Method**: `"web3_sha3"`

#### web3\_sha3.Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### web3\_sha3.ReturnType

> **ReturnType**: `string`

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
