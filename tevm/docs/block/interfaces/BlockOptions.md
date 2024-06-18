[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / BlockOptions

# Interface: BlockOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a [Common](../../common/type-aliases/Common.md) object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Extended by

- [`BuilderOpts`](../../vm/interfaces/BuilderOpts.md)

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](../classes/BlockHeader.md)

If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Source

packages/block/types/types.d.ts:42

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Source

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

#### Source

packages/block/types/types.d.ts:23

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Source

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

#### Source

packages/block/types/types.d.ts:54

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

#### Source

packages/block/types/types.d.ts:33

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Source

packages/block/types/types.d.ts:63
