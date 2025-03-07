[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / ChainOptions

# Type Alias: ChainOptions

> **ChainOptions**: `object`

Defined in: [packages/blockchain/src/ChainOptions.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L9)

Options passed into `createChain` to initialize a Chain object

## Type declaration

### common

> **common**: `Common`

A Common instance

### fork?

> `optional` **fork**: `object`

Optional fork config for forking a live chain

#### fork.blockTag?

> `optional` **blockTag**: `BlockTag` \| `bigint` \| `` `0x${string}` ``

Optional block tag to fork
Defaults to 'latest'

#### fork.transport

> **transport**: `object`

EIP-1193 request function to fetch forked blocks with

#### fork.transport.request

> **request**: `EIP1193RequestFn`

### genesisBlock?

> `optional` **genesisBlock**: `Block`

Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided.

### genesisStateRoot?

> `optional` **genesisStateRoot**: `Uint8Array`

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Logging level of blockchain package. Defaults to `warn`
