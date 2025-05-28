[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Defined in: packages/vm/types/utils/BuilderOpts.d.ts:5

Options for the block builder.

## Extends

- [`BlockOptions`](../../block/interfaces/BlockOptions.md)

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](../../block/classes/BlockHeader.md)

Defined in: packages/block/types/types.d.ts:42

If a preceding [BlockHeader](../../block/classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`calcDifficultyFromHeader`](../../block/interfaces/BlockOptions.md#calcdifficultyfromheader)

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/block/types/types.d.ts:59

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`cliqueSigner`](../../block/interfaces/BlockOptions.md#cliquesigner)

***

### common

> **common**: `object`

Defined in: packages/block/types/types.d.ts:23

A [Common](../../common/type-aliases/Common.md) object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: [Common](../../common/type-aliases/Common.md) object set to `mainnet` and the HF currently defined as the default
hardfork in the [Common](../../common/type-aliases/Common.md) class.

Current default hardfork: `merge`

#### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

##### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

##### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

##### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

##### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

> **ethjsCommon**: `Common`

#### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

#### formatters?

> `optional` **formatters**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

#### id

> **id**: `number`

ID in number form

#### name

> **name**: `string`

Human-readable name

#### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

#### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

##### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

##### rpcUrls.default

> **default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`common`](../../block/interfaces/BlockOptions.md#common)

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../../block/interfaces/VerkleExecutionWitness.md)

Defined in: packages/block/types/types.d.ts:64

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`executionWitness`](../../block/interfaces/BlockOptions.md#executionwitness)

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: packages/block/types/types.d.ts:54

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`freeze`](../../block/interfaces/BlockOptions.md#freeze)

***

### putBlockIntoBlockchain?

> `optional` **putBlockIntoBlockchain**: `boolean`

Defined in: packages/vm/types/utils/BuilderOpts.d.ts:15

Whether to put the block into the vm's blockchain after building it.
This is useful for completing a full cycle when building a block so
the only next step is to build again, however it may not be desired
if the block is being emulated or may be discarded as to not affect
the underlying blockchain.

Default: true

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Defined in: packages/block/types/types.d.ts:33

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`setHardfork`](../../block/interfaces/BlockOptions.md#sethardfork)

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Defined in: packages/block/types/types.d.ts:63

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`skipConsensusFormatValidation`](../../block/interfaces/BlockOptions.md#skipconsensusformatvalidation)
