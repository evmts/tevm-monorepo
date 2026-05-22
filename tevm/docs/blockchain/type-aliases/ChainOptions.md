[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / ChainOptions

# Type Alias: ChainOptions

> **ChainOptions** = `object`

Options passed into `createChain` to initialize a Chain object

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="common"></a> `common` | [`Common`](../../common/type-aliases/Common.md) | A Common instance |
| <a id="fork"></a> `fork?` | `object` | Optional fork config for forking a live chain |
| `fork.blockTag?` | [`BlockTag`](../../index/type-aliases/BlockTag.md) \| `bigint` \| `` `0x${string}` `` | Optional block tag to fork Defaults to 'latest' |
| `fork.transport` | `object` | EIP-1193 request function to fetch forked blocks with |
| `fork.transport.request` | `EIP1193RequestFn` | - |
| <a id="genesisblock"></a> `genesisBlock?` | [`Block`](../../block/classes/Block.md) | Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided. |
| <a id="genesisstateroot"></a> `genesisStateRoot?` | `Uint8Array` | - |
| <a id="logginglevel"></a> `loggingLevel?` | `LogOptions`\[`"level"`\] | Logging level of blockchain package. Defaults to `warn` |
