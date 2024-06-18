---
editUrl: false
next: false
prev: false
title: "ChainOptions"
---

> **ChainOptions**: `object`

Options passed into `createChain` to initialize a Chain object

## Type declaration

### common

> **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

A Common instance

### fork?

> `optional` **fork**: `object`

Optional fork config for forking a live chain

### fork.blockTag?

> `optional` **blockTag**: [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `bigint` \| \`0x$\{string\}\`

Optional block tag to fork
Defaults to 'latest'

### fork.transport

> **transport**: `object`

EIP-1193 request function to fetch forked blocks with

### fork.transport.request

> **request**: `EIP1193RequestFn`

### genesisBlock?

> `optional` **genesisBlock**: [`Block`](/reference/tevm/block/classes/block/)

Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided.

### genesisStateRoot?

> `optional` **genesisStateRoot**: `Uint8Array`

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Logging level of blockchain package. Defaults to `warn`

## Source

[ChainOptions.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L9)
