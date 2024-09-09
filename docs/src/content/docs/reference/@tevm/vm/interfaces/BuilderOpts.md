---
editUrl: false
next: false
prev: false
title: "BuilderOpts"
---

Options for the block builder.

## Extends

- [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

If a preceding [BlockHeader](../../../../../../../../reference/tevm/block/classes/blockheader) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`calcDifficultyFromHeader`](/reference/tevm/block/interfaces/blockoptions/#calcdifficultyfromheader)

#### Defined in

packages/block/types/types.d.ts:42

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`cliqueSigner`](/reference/tevm/block/interfaces/blockoptions/#cliquesigner)

#### Defined in

packages/block/types/types.d.ts:59

***

### common

> **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

A [Common](../../../../../../../../reference/tevm/common/type-aliases/common) object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: [Common](../../../../../../../../reference/tevm/common/type-aliases/common) object set to `mainnet` and the HF currently defined as the default
hardfork in the [Common](../../../../../../../../reference/tevm/common/type-aliases/common) class.

Current default hardfork: `merge`

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`common`](/reference/tevm/block/interfaces/blockoptions/#common)

#### Defined in

packages/block/types/types.d.ts:23

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`executionWitness`](/reference/tevm/block/interfaces/blockoptions/#executionwitness)

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

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`freeze`](/reference/tevm/block/interfaces/blockoptions/#freeze)

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

[packages/vm/src/utils/BuilderOpts.ts:16](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BuilderOpts.ts#L16)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../../../../../../../reference/tevm/common/type-aliases/common) instance)

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`setHardfork`](/reference/tevm/block/interfaces/blockoptions/#sethardfork)

#### Defined in

packages/block/types/types.d.ts:33

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

[`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/).[`skipConsensusFormatValidation`](/reference/tevm/block/interfaces/blockoptions/#skipconsensusformatvalidation)

#### Defined in

packages/block/types/types.d.ts:63
