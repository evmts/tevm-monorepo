---
editUrl: false
next: false
prev: false
title: "BlockOptions"
---

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a [Common](../../../../../../../reference/tevm/common/type-aliases/common) object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Extended by

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

If a preceding [BlockHeader](../../../../../../../reference/tevm/block/classes/blockheader) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Source

[types.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L43)

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Source

[types.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L60)

***

### common

> **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

A [Common](../../../../../../../reference/tevm/common/type-aliases/common) object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: [Common](../../../../../../../reference/tevm/common/type-aliases/common) object set to `mainnet` and the HF currently defined as the default
hardfork in the [Common](../../../../../../../reference/tevm/common/type-aliases/common) class.

Current default hardfork: `merge`

#### Source

[types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L24)

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

#### Source

[types.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L66)

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

[types.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L55)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../../../../../../reference/tevm/common/type-aliases/common) instance)

#### Source

[types.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L34)

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Source

[types.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L64)
