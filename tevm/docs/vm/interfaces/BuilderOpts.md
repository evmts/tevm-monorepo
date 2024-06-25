[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Options for the block builder.

## Extends

- [`BlockOptions`](../../block/interfaces/BlockOptions.md)

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](../../block/classes/BlockHeader.md)

If a preceding [BlockHeader](../../block/classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`calcDifficultyFromHeader`](../../block/interfaces/BlockOptions.md#calcdifficultyfromheader)

#### Defined in

packages/block/types/types.d.ts:42

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`cliqueSigner`](../../block/interfaces/BlockOptions.md#cliquesigner)

#### Defined in

packages/block/types/types.d.ts:59

***

### common

> **common**: [`Common`](../../common/type-aliases/Common.md)

A [Common](../../common/type-aliases/Common.md) object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: [Common](../../common/type-aliases/Common.md) object set to `mainnet` and the HF currently defined as the default
hardfork in the [Common](../../common/type-aliases/Common.md) class.

Current default hardfork: `merge`

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`common`](../../block/interfaces/BlockOptions.md#common)

#### Defined in

packages/block/types/types.d.ts:23

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../../block/interfaces/VerkleExecutionWitness.md)

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`executionWitness`](../../block/interfaces/BlockOptions.md#executionwitness)

#### Defined in

packages/block/types/types.d.ts:64

***

### freeze?

> `optional` **freeze**: `boolean`

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`freeze`](../../block/interfaces/BlockOptions.md#freeze)

#### Defined in

packages/block/types/types.d.ts:54

***

### putBlockIntoBlockchain?

> `optional` **putBlockIntoBlockchain**: `boolean`

Whether to put the block into the vm's blockchain after building it.
This is useful for completing a full cycle when building a block so
the only next step is to build again, however it may not be desired
if the block is being emulated or may be discarded as to not affect
the underlying blockchain.

Default: true

#### Defined in

packages/vm/types/utils/types.d.ts:159

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`setHardfork`](../../block/interfaces/BlockOptions.md#sethardfork)

#### Defined in

packages/block/types/types.d.ts:33

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

[`BlockOptions`](../../block/interfaces/BlockOptions.md).[`skipConsensusFormatValidation`](../../block/interfaces/BlockOptions.md#skipconsensusformatvalidation)

#### Defined in

packages/block/types/types.d.ts:63
