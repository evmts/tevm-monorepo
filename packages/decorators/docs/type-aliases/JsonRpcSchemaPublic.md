[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaPublic

# Type Alias: JsonRpcSchemaPublic

> **JsonRpcSchemaPublic** = `object`

Defined in: [eip1193/JsonRpcSchemaPublic.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L46)

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L114)

#### Method

> **Method**: `"eth_blobGasPrice"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L126)

#### Method

> **Method**: `"eth_blockNumber"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L138)

#### Method

> **Method**: `"eth_call"`

#### Parameters

> **Parameters**: \[`Partial`\<`TransactionRequest`\>\] \| \[`Partial`\<`TransactionRequest`\>, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\] \| \[`Partial`\<`TransactionRequest`\>, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`, `RpcStateOverride`\]

#### ReturnType

> **ReturnType**: `Hex`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L156)

#### Method

> **Method**: `"eth_chainId"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L167)

#### Method

> **Method**: `"eth_coinbase"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Address`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L182)

#### Method

> **Method**: `"eth_estimateGas"`

#### Parameters

> **Parameters**: \[`TransactionRequest`\] \| \[`TransactionRequest`, `BlockNumber` \| `BlockTag`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:202](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L202)

#### Method

> **Method**: `"eth_feeHistory"`

#### Parameters

> **Parameters**: \[`Quantity`, `BlockNumber` \| `BlockTag`, `number`[] \| `undefined`\]

#### ReturnType

> **ReturnType**: `FeeHistory`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:221](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L221)

#### Method

> **Method**: `"eth_gasPrice"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L233)

#### Method

> **Method**: `"eth_getBalance"`

#### Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:250](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L250)

#### Method

> **Method**: `"eth_getBlockByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `boolean`\]

#### ReturnType

> **ReturnType**: `Block` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:272](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L272)

#### Method

> **Method**: `"eth_getBlockByNumber"`

#### Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `boolean`\]

#### ReturnType

> **ReturnType**: `Block` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:289](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L289)

#### Method

> **Method**: `"eth_getBlockTransactionCountByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:301](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L301)

#### Method

> **Method**: `"eth_getBlockTransactionCountByNumber"`

#### Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:313](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L313)

#### Method

> **Method**: `"eth_getCode"`

#### Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Hex`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L325)

#### Method

> **Method**: `"eth_getFilterChanges"`

#### Parameters

> **Parameters**: \[`Quantity`\]

#### ReturnType

> **ReturnType**: `Log`[] \| `Hex`[]

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:337](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L337)

#### Method

> **Method**: `"eth_getFilterLogs"`

#### Parameters

> **Parameters**: \[`Quantity`\]

#### ReturnType

> **ReturnType**: `Log`[]

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:349](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L349)

#### Method

> **Method**: `"eth_getLogs"`

#### Parameters

> **Parameters**: \[`object` & \{ `blockHash`: `never`; `fromBlock`: `BlockNumber` \| `BlockTag`; `toBlock`: `BlockNumber` \| `BlockTag`; \} \| \{ `blockHash`: [`Hash`](Hash.md); `fromBlock`: `never`; `toBlock`: `never`; \}\]

#### ReturnType

> **ReturnType**: `Log`[]

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:379](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L379)

#### Method

> **Method**: `"eth_getProof"`

#### Parameters

> **Parameters**: \[`Address`, [`Hash`](Hash.md)[], `BlockNumber` \| `BlockTag`\]

#### ReturnType

> **ReturnType**: `Proof`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L397)

#### Method

> **Method**: `"eth_getStorageAt"`

#### Parameters

> **Parameters**: \[`Address`, `Quantity`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Hex`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:409](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L409)

#### Method

> **Method**: `"eth_getTransactionByBlockHashAndIndex"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity`\]

#### ReturnType

> **ReturnType**: `Transaction` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:421](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L421)

#### Method

> **Method**: `"eth_getTransactionByBlockNumberAndIndex"`

#### Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `Quantity`\]

#### ReturnType

> **ReturnType**: `Transaction` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:433](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L433)

#### Method

> **Method**: `"eth_getTransactionByHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `Transaction` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:445](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L445)

#### Method

> **Method**: `"eth_getTransactionCount"`

#### Parameters

> **Parameters**: \[`Address`, `BlockNumber` \| `BlockTag` \| `BlockIdentifier`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:457](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L457)

#### Method

> **Method**: `"eth_getTransactionReceipt"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `TransactionReceipt` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:469](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L469)

#### Method

> **Method**: `"eth_getUncleByBlockHashAndIndex"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md), `Quantity`\]

#### ReturnType

> **ReturnType**: `Uncle` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:481](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L481)

#### Method

> **Method**: `"eth_getUncleByBlockNumberAndIndex"`

#### Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`, `Quantity`\]

#### ReturnType

> **ReturnType**: `Uncle` \| `null`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:493](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L493)

#### Method

> **Method**: `"eth_getUncleCountByBlockHash"`

#### Parameters

> **Parameters**: \[[`Hash`](Hash.md)\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:505](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L505)

#### Method

> **Method**: `"eth_getUncleCountByBlockNumber"`

#### Parameters

> **Parameters**: \[`BlockNumber` \| `BlockTag`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:517](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L517)

#### Method

> **Method**: `"eth_maxPriorityFeePerGas"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:529](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L529)

#### Method

> **Method**: `"eth_newBlockFilter"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:541](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L541)

#### Method

> **Method**: `"eth_newFilter"`

#### Parameters

> **Parameters**: \[`object`\]

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:560](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L560)

#### Method

> **Method**: `"eth_newPendingTransactionFilter"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:572](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L572)

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:584](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L584)

#### Method

> **Method**: `"eth_sendRawTransaction"`

#### Parameters

> **Parameters**: \[`Hex`\]

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:596](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L596)

#### Method

> **Method**: `"eth_uninstallFilter"`

#### Parameters

> **Parameters**: \[`Quantity`\]

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L78)

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L90)

#### Method

> **Method**: `"net_peerCount"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:102](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L102)

#### Method

> **Method**: `"net_version"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity`

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L54)

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

Defined in: [eip1193/JsonRpcSchemaPublic.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L66)

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
