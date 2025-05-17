[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaPublic

# Type Alias: JsonRpcSchemaPublic

> **JsonRpcSchemaPublic** = `object`

Defined in: packages/decorators/dist/index.d.ts:876

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

### eth\_blobGasPrice

> **eth\_blobGasPrice**: `object`

Defined in: packages/decorators/dist/index.d.ts:944

#### Method

> **Method**: `"eth_blobGasPrice"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the current blob price of gas expressed in wei

#### Example

```ts
provider.request({ method: 'eth_blobGasPrice' })
// => '0x09184e72a000'
```

***

### eth\_blockNumber

> **eth\_blockNumber**: `object`

Defined in: packages/decorators/dist/index.d.ts:956

#### Method

> **Method**: `"eth_blockNumber"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of the most recent block seen by this client

#### Example

```ts
provider.request({ method: 'eth_blockNumber' })
// => '0x1b4'
```

***

### eth\_call

> **eth\_call**: `object`

Defined in: packages/decorators/dist/index.d.ts:968

#### Method

> **Method**: `"eth_call"`

#### Parameters

> **Parameters**: \[`Partial`\<`RpcTransactionRequest`\>\] \| \[`Partial`\<`RpcTransactionRequest`\>, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\] \| \[`Partial`\<`RpcTransactionRequest`\>, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`, `RpcStateOverride`\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Executes a new message call immediately without submitting a transaction to the network

#### Example

```ts
provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] })
// => '0x...'
```

***

### eth\_chainId

> **eth\_chainId**: `object`

Defined in: packages/decorators/dist/index.d.ts:983

#### Method

> **Method**: `"eth_chainId"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

***

### eth\_coinbase

> **eth\_coinbase**: `object`

Defined in: packages/decorators/dist/index.d.ts:994

#### Method

> **Method**: `"eth_coinbase"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: [`Address`](../../index/type-aliases/Address.md)

#### Description

Returns the client coinbase address.

#### Example

```ts
provider.request({ method: 'eth_coinbase' })
// => '0x...'
```

***

### eth\_estimateGas

> **eth\_estimateGas**: `object`

Defined in: packages/decorators/dist/index.d.ts:1009

#### Method

> **Method**: `"eth_estimateGas"`

#### Parameters

> **Parameters**: \[`RpcTransactionRequest`\] \| \[`RpcTransactionRequest`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

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

***

### eth\_feeHistory

> **eth\_feeHistory**: `object`

Defined in: packages/decorators/dist/index.d.ts:1029

#### Method

> **Method**: `"eth_feeHistory"`

#### Parameters

> **Parameters**: \[`Quantity$1`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `number`[] \| `undefined`\]

#### ReturnType

> **ReturnType**: `RpcFeeHistory`

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

***

### eth\_gasPrice

> **eth\_gasPrice**: `object`

Defined in: packages/decorators/dist/index.d.ts:1048

#### Method

> **Method**: `"eth_gasPrice"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the current price of gas expressed in wei

#### Example

```ts
provider.request({ method: 'eth_gasPrice' })
// => '0x09184e72a000'
```

***

### eth\_getBalance

> **eth\_getBalance**: `object`

Defined in: packages/decorators/dist/index.d.ts:1060

#### Method

> **Method**: `"eth_getBalance"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the balance of an address in wei

#### Example

```ts
provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] })
// => '0x12a05...'
```

***

### eth\_getBlockByHash

> **eth\_getBlockByHash**: `object`

Defined in: packages/decorators/dist/index.d.ts:1077

#### Method

> **Method**: `"eth_getBlockByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `boolean`\]

#### ReturnType

> **ReturnType**: `RpcBlock` \| `null`

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

***

### eth\_getBlockByNumber

> **eth\_getBlockByNumber**: `object`

Defined in: packages/decorators/dist/index.d.ts:1099

#### Method

> **Method**: `"eth_getBlockByNumber"`

#### Parameters

> **Parameters**: \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `boolean`\]

#### ReturnType

> **ReturnType**: `RpcBlock` \| `null`

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

***

### eth\_getBlockTransactionCountByHash

> **eth\_getBlockTransactionCountByHash**: `object`

Defined in: packages/decorators/dist/index.d.ts:1116

#### Method

> **Method**: `"eth_getBlockTransactionCountByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of transactions in a block specified by block hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] })
// => '0x1'
```

***

### eth\_getBlockTransactionCountByNumber

> **eth\_getBlockTransactionCountByNumber**: `object`

Defined in: packages/decorators/dist/index.d.ts:1128

#### Method

> **Method**: `"eth_getBlockTransactionCountByNumber"`

#### Parameters

> **Parameters**: \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of transactions in a block specified by block number

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] })
// => '0x1'
```

***

### eth\_getCode

> **eth\_getCode**: `object`

Defined in: packages/decorators/dist/index.d.ts:1140

#### Method

> **Method**: `"eth_getCode"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Returns the contract code stored at a given address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] })
// => '0x...'
```

***

### eth\_getFilterChanges

> **eth\_getFilterChanges**: `object`

Defined in: packages/decorators/dist/index.d.ts:1152

#### Method

> **Method**: `"eth_getFilterChanges"`

#### Parameters

> **Parameters**: \[`Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcLog`[] \| [`Hex`](../../index/type-aliases/Hex.md)[]

#### Description

Returns a list of all logs based on filter ID since the last log retrieval

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] })
// => [{ ... }, { ... }]
```

***

### eth\_getFilterLogs

> **eth\_getFilterLogs**: `object`

Defined in: packages/decorators/dist/index.d.ts:1164

#### Method

> **Method**: `"eth_getFilterLogs"`

#### Parameters

> **Parameters**: \[`Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcLog`[]

#### Description

Returns a list of all logs based on filter ID

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] })
// => [{ ... }, { ... }]
```

***

### eth\_getLogs

> **eth\_getLogs**: `object`

Defined in: packages/decorators/dist/index.d.ts:1176

#### Method

> **Method**: `"eth_getLogs"`

#### Parameters

> **Parameters**: \[`object` & \{ `blockHash?`: `never`; `fromBlock?`: `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md); `toBlock?`: `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md); \} \| \{ `blockHash?`: [`Hash`](Hash.md); `fromBlock?`: `never`; `toBlock?`: `never`; \}\]

#### ReturnType

> **ReturnType**: `RpcLog`[]

#### Description

Returns a list of all logs based on a filter object

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
// => [{ ... }, { ... }]
```

***

### eth\_getProof

> **eth\_getProof**: `object`

Defined in: packages/decorators/dist/index.d.ts:1203

#### Method

> **Method**: `"eth_getProof"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), [`Hash`](Hash.md)[], `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\]

#### ReturnType

> **ReturnType**: `RpcProof`

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

***

### eth\_getStorageAt

> **eth\_getStorageAt**: `object`

Defined in: packages/decorators/dist/index.d.ts:1221

#### Method

> **Method**: `"eth_getStorageAt"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), `Quantity$1`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Returns the value from a storage position at an address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] })
// => '0x...'
```

***

### eth\_getTransactionByBlockHashAndIndex

> **eth\_getTransactionByBlockHashAndIndex**: `object`

Defined in: packages/decorators/dist/index.d.ts:1233

#### Method

> **Method**: `"eth_getTransactionByBlockHashAndIndex"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcTransaction` \| `null`

#### Description

Returns information about a transaction specified by block hash and transaction index

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

***

### eth\_getTransactionByBlockNumberAndIndex

> **eth\_getTransactionByBlockNumberAndIndex**: `object`

Defined in: packages/decorators/dist/index.d.ts:1245

#### Method

> **Method**: `"eth_getTransactionByBlockNumberAndIndex"`

#### Parameters

> **Parameters**: \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcTransaction` \| `null`

#### Description

Returns information about a transaction specified by block number and transaction index

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

***

### eth\_getTransactionByHash

> **eth\_getTransactionByHash**: `object`

Defined in: packages/decorators/dist/index.d.ts:1257

#### Method

> **Method**: `"eth_getTransactionByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `RpcTransaction` \| `null`

#### Description

Returns information about a transaction specified by hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] })
// => { ... }
```

***

### eth\_getTransactionCount

> **eth\_getTransactionCount**: `object`

Defined in: packages/decorators/dist/index.d.ts:1269

#### Method

> **Method**: `"eth_getTransactionCount"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `RpcBlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of transactions sent from an address

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] })
// => '0x1'
```

***

### eth\_getTransactionReceipt

> **eth\_getTransactionReceipt**: `object`

Defined in: packages/decorators/dist/index.d.ts:1281

#### Method

> **Method**: `"eth_getTransactionReceipt"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `RpcTransactionReceipt` \| `null`

#### Description

Returns the receipt of a transaction specified by hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] })
// => { ... }
```

***

### eth\_getUncleByBlockHashAndIndex

> **eth\_getUncleByBlockHashAndIndex**: `object`

Defined in: packages/decorators/dist/index.d.ts:1293

#### Method

> **Method**: `"eth_getUncleByBlockHashAndIndex"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcUncle` \| `null`

#### Description

Returns information about an uncle specified by block hash and uncle index position

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

***

### eth\_getUncleByBlockNumberAndIndex

> **eth\_getUncleByBlockNumberAndIndex**: `object`

Defined in: packages/decorators/dist/index.d.ts:1305

#### Method

> **Method**: `"eth_getUncleByBlockNumberAndIndex"`

#### Parameters

> **Parameters**: \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md), `Quantity$1`\]

#### ReturnType

> **ReturnType**: `RpcUncle` \| `null`

#### Description

Returns information about an uncle specified by block number and uncle index position

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] })
// => { ... }
```

***

### eth\_getUncleCountByBlockHash

> **eth\_getUncleCountByBlockHash**: `object`

Defined in: packages/decorators/dist/index.d.ts:1317

#### Method

> **Method**: `"eth_getUncleCountByBlockHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of uncles in a block specified by block hash

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] })
// => '0x1'
```

***

### eth\_getUncleCountByBlockNumber

> **eth\_getUncleCountByBlockNumber**: `object`

Defined in: packages/decorators/dist/index.d.ts:1329

#### Method

> **Method**: `"eth_getUncleCountByBlockNumber"`

#### Parameters

> **Parameters**: \[`RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of uncles in a block specified by block number

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] })
// => '0x1'
```

***

### eth\_maxPriorityFeePerGas

> **eth\_maxPriorityFeePerGas**: `object`

Defined in: packages/decorators/dist/index.d.ts:1341

#### Method

> **Method**: `"eth_maxPriorityFeePerGas"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the current maxPriorityFeePerGas in wei.

#### Link

https://ethereum.github.io/execution-apis/api-documentation/

#### Example

```ts
provider.request({ method: 'eth_maxPriorityFeePerGas' })
// => '0x5f5e100'
```

***

### eth\_newBlockFilter

> **eth\_newBlockFilter**: `object`

Defined in: packages/decorators/dist/index.d.ts:1353

#### Method

> **Method**: `"eth_newBlockFilter"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newBlockFilter' })
// => '0x1'
```

***

### eth\_newFilter

> **eth\_newFilter**: `object`

Defined in: packages/decorators/dist/index.d.ts:1365

#### Method

> **Method**: `"eth_newFilter"`

#### Parameters

> **Parameters**: \[`object`\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
// => '0x1'
```

***

### eth\_newPendingTransactionFilter

> **eth\_newPendingTransactionFilter**: `object`

Defined in: packages/decorators/dist/index.d.ts:1384

#### Method

> **Method**: `"eth_newPendingTransactionFilter"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_newPendingTransactionFilter' })
// => '0x1'
```

***

### eth\_protocolVersion

> **eth\_protocolVersion**: `object`

Defined in: packages/decorators/dist/index.d.ts:1396

#### Method

> **Method**: `"eth_protocolVersion"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `string`

#### Description

Returns the current Ethereum protocol version

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_protocolVersion' })
// => '54'
```

***

### eth\_sendRawTransaction

> **eth\_sendRawTransaction**: `object`

Defined in: packages/decorators/dist/index.d.ts:1408

#### Method

> **Method**: `"eth_sendRawTransaction"`

#### Parameters

> **Parameters**: \[[`Hex`](../../index/type-aliases/Hex.md)\]

#### ReturnType

> **ReturnType**: [`Hash`](Hash.md)

#### Description

Sends a **signed** transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
// => '0x...'
```

***

### eth\_uninstallFilter

> **eth\_uninstallFilter**: `object`

Defined in: packages/decorators/dist/index.d.ts:1420

#### Method

> **Method**: `"eth_uninstallFilter"`

#### Parameters

> **Parameters**: \[`Quantity$1`\]

#### ReturnType

> **ReturnType**: `boolean`

#### Description

Destroys a filter based on filter ID

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
// => true
```

***

### net\_listening

> **net\_listening**: `object`

Defined in: packages/decorators/dist/index.d.ts:908

#### Method

> **Method**: `"net_listening"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `boolean`

#### Description

Determines if this client is listening for new network connections

#### Example

```ts
provider.request({ method: 'net_listening' })
// => true
```

***

### net\_peerCount

> **net\_peerCount**: `object`

Defined in: packages/decorators/dist/index.d.ts:920

#### Method

> **Method**: `"net_peerCount"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the number of peers currently connected to this client

#### Example

```ts
provider.request({ method: 'net_peerCount' })
// => '0x1'
```

***

### net\_version

> **net\_version**: `object`

Defined in: packages/decorators/dist/index.d.ts:932

#### Method

> **Method**: `"net_version"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the chain ID associated with the current network

#### Example

```ts
provider.request({ method: 'net_version' })
// => '1'
```

***

### web3\_clientVersion

> **web3\_clientVersion**: `object`

Defined in: packages/decorators/dist/index.d.ts:884

#### Method

> **Method**: `"web3_clientVersion"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `string`

#### Description

Returns the version of the current client

#### Example

```ts
provider.request({ method: 'web3_clientVersion' })
// => 'MetaMask/v1.0.0'
```

***

### web3\_sha3

> **web3\_sha3**: `object`

Defined in: packages/decorators/dist/index.d.ts:896

#### Method

> **Method**: `"web3_sha3"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `string`

#### Description

Hashes data using the Keccak-256 algorithm

#### Example

```ts
provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] })
// => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
```
