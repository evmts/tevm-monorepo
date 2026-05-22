[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Options for the block builder.

## Extends

- [`BlockOptions`](../../block/interfaces/BlockOptions.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="calcdifficultyfromheader"></a> `calcDifficultyFromHeader?` | [`BlockHeader`](../../block/classes/BlockHeader.md) | If a preceding [BlockHeader](../../block/classes/BlockHeader.md) (usually the parent header) is given the preceding header will be used to calculate the difficulty for this block and the calculated difficulty takes precedence over a provided static `difficulty` value. Note that this option has no effect on networks other than PoW/Ethash networks (respectively also deactivates on the Merge HF switching to PoS/Casper). | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`calcDifficultyFromHeader`](../../block/interfaces/BlockOptions.md#calcdifficultyfromheader) |
| <a id="cliquesigner"></a> `cliqueSigner?` | `Uint8Array`\<`ArrayBufferLike`\> | Provide a clique signer's privateKey to seal this block. Will throw if provided on a non-PoA chain. | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`cliqueSigner`](../../block/interfaces/BlockOptions.md#cliquesigner) |
| <a id="common"></a> `common` | `object` | A [Common](../../common/type-aliases/Common.md) object defining the chain and the hardfork a block/block header belongs to. Object will be internally copied so that tx behavior don't incidentally change on future HF changes. Default: [Common](../../common/type-aliases/Common.md) object set to `mainnet` and the HF currently defined as the default hardfork in the [Common](../../common/type-aliases/Common.md) class. Current default hardfork: `merge` | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`common`](../../block/interfaces/BlockOptions.md#common) |
| `common.blockExplorers?` | `object` | Collection of block explorers | - |
| `common.blockExplorers.default` | `ChainBlockExplorer` | - | - |
| `common.blockTime?` | `number` | Block time in milliseconds. | - |
| `common.contracts?` | `object` | Collection of contracts | - |
| `common.contracts.ensRegistry?` | `ChainContract` | - | - |
| `common.contracts.ensUniversalResolver?` | `ChainContract` | - | - |
| `common.contracts.erc6492Verifier?` | `ChainContract` | - | - |
| `common.contracts.multicall3?` | `ChainContract` | - | - |
| `common.copy` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - | - |
| `common.custom?` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. | - |
| `common.ensTlds?` | readonly `string`[] | Collection of ENS TLDs for the chain. | - |
| `common.ethjsCommon` | `Common` | - | - |
| `common.experimental_preconfirmationTime?` | `number` | Preconfirmation time in milliseconds. | - |
| `common.extendSchema?` | `Record`\<`string`, `unknown`\> | Extend schema. | - |
| `common.fees?` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. | - |
| `common.formatters?` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) | - |
| `common.id` | `number` | ID in number form | - |
| `common.name` | `string` | Human-readable name | - |
| `common.nativeCurrency` | `ChainNativeCurrency` | Currency used by chain | - |
| `common.prepareTransactionRequest?` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. | - |
| `common.rpcUrls` | `object` | Collection of RPC endpoints | - |
| `common.rpcUrls.default` | `ChainRpcUrls` | - | - |
| `common.serializers?` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). | - |
| `common.sourceId?` | `number` | Source Chain ID (ie. the L1 chain) | - |
| `common.testnet?` | `boolean` | Flag for test networks | - |
| `common.verifyHash?` | `ChainVerifyHashFn` | Chain-specific signature verification. | - |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](../../block/interfaces/VerkleExecutionWitness.md) | - | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`executionWitness`](../../block/interfaces/BlockOptions.md#executionwitness) |
| <a id="freeze"></a> `freeze?` | `boolean` | A block object by default gets frozen along initialization. This gives you strong additional security guarantees on the consistency of the block parameters. It also enables block hash caching when the `hash()` method is called multiple times. If you need to deactivate the block freeze - e.g. because you want to subclass block and add additional properties - it is strongly encouraged that you do the freeze yourself within your code instead. Default: true | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`freeze`](../../block/interfaces/BlockOptions.md#freeze) |
| <a id="putblockintoblockchain"></a> `putBlockIntoBlockchain?` | `boolean` | Whether to put the block into the vm's blockchain after building it. This is useful for completing a full cycle when building a block so the only next step is to build again, however it may not be desired if the block is being emulated or may be discarded as to not affect the underlying blockchain. Default: true | - |
| <a id="sethardfork"></a> `setHardfork?` | `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md) | Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number for older Hfs. Additionally it is possible to pass in a specific TD value to support live-Merge-HF transitions. Note that this should only be needed in very rare and specific scenarios. Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance) | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`setHardfork`](../../block/interfaces/BlockOptions.md#sethardfork) |
| <a id="skipconsensusformatvalidation"></a> `skipConsensusFormatValidation?` | `boolean` | Skip consensus format validation checks on header if set. Defaults to false. | [`BlockOptions`](../../block/interfaces/BlockOptions.md).[`skipConsensusFormatValidation`](../../block/interfaces/BlockOptions.md#skipconsensusformatvalidation) |
