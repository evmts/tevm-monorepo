**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ChainOptions

# Type alias: ChainOptions

> **ChainOptions**: `object`

Options passed into `createChain` to initialize a Chain object

## Type declaration

### common

> **common**: `Common`

A Common instance

### fork

> **fork**?: `object`

Optional fork config for forking a live chain

### fork.blockTag

> **fork.blockTag**?: `BlockTag` \| `bigint` \| \`0x${string}\`

Optional block tag to fork
Defaults to 'latest'

### fork.url

> **fork.url**: `string`

JSON-RPC url to fork

### genesisBlock

> **genesisBlock**?: `Block`

Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided.

### genesisStateRoot

> **genesisStateRoot**?: `Uint8Array`

## Source

[ChainOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
