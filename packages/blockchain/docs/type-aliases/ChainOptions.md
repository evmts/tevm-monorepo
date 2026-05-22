[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / ChainOptions

# Type Alias: ChainOptions

> **ChainOptions** = `object`

Defined in: [packages/blockchain/src/ChainOptions.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L9)

Options passed into `createChain` to initialize a Chain object

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="common"></a> `common` | `Common` | A Common instance | [packages/blockchain/src/ChainOptions.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L17) |
| <a id="fork"></a> `fork?` | `object` | Optional fork config for forking a live chain | [packages/blockchain/src/ChainOptions.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L26) |
| `fork.blockTag?` | `BlockTag` \| `bigint` \| `` `0x${string}` `` | Optional block tag to fork Defaults to 'latest' | [packages/blockchain/src/ChainOptions.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L35) |
| `fork.transport` | `object` | EIP-1193 request function to fetch forked blocks with | [packages/blockchain/src/ChainOptions.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L30) |
| `fork.transport.request` | `EIP1193RequestFn` | - | [packages/blockchain/src/ChainOptions.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L30) |
| <a id="genesisblock"></a> `genesisBlock?` | `Block` | Override the genesis block. If fork is provided it will be fetched from fork. Otherwise a default genesis is provided. | [packages/blockchain/src/ChainOptions.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L21) |
| <a id="genesisstateroot"></a> `genesisStateRoot?` | `Uint8Array` | - | [packages/blockchain/src/ChainOptions.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L22) |
| <a id="logginglevel"></a> `loggingLevel?` | `LogOptions`\[`"level"`\] | Logging level of blockchain package. Defaults to `warn` | [packages/blockchain/src/ChainOptions.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/ChainOptions.ts#L13) |
