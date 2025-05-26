[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / ChainOptions

# Type Alias: ChainOptions

> **ChainOptions** = `object`

Defined in: [packages/blockchain/src/ChainOptions.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L9)

Options passed into `createChain` to initialize a Chain object

## Properties

### common

> **common**: `Common`

Defined in: [packages/blockchain/src/ChainOptions.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L17)

A Common instance

***

### fork?

> `optional` **fork**: `object`

Defined in: [packages/blockchain/src/ChainOptions.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L26)

Optional fork config for forking a live chain

#### blockTag?

> `optional` **blockTag**: `BlockTag` \| `bigint` \| `` `0x${string}` ``

Optional block tag to fork
Defaults to 'latest'

#### transport

> **transport**: `object`

EIP-1193 request function to fetch forked blocks with

##### transport.request

> **request**: `EIP1193RequestFn`

***

### genesisBlock?

> `optional` **genesisBlock**: `Block`

Defined in: [packages/blockchain/src/ChainOptions.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L21)

Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided.

***

### genesisStateRoot?

> `optional` **genesisStateRoot**: `Uint8Array`

Defined in: [packages/blockchain/src/ChainOptions.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L22)

***

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Defined in: [packages/blockchain/src/ChainOptions.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L13)

Logging level of blockchain package. Defaults to `warn`
