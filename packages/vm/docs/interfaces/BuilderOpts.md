[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BuilderOpts

# Interface: BuilderOpts

Options for the block builder.

## Extends

- `BlockOptions`

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: `BlockHeader`

If a preceding BlockHeader (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

`BlockOptions.calcDifficultyFromHeader`

#### Source

packages/block/types/types.d.ts:42

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

`BlockOptions.cliqueSigner`

#### Source

packages/block/types/types.d.ts:59

***

### common

> **common**: `Common`

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Inherited from

`BlockOptions.common`

#### Source

packages/block/types/types.d.ts:23

***

### executionWitness?

> `optional` **executionWitness**: `VerkleExecutionWitness`

#### Inherited from

`BlockOptions.executionWitness`

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

#### Inherited from

`BlockOptions.freeze`

#### Source

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

#### Source

[packages/vm/src/utils/types.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L174)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Inherited from

`BlockOptions.setHardfork`

#### Source

packages/block/types/types.d.ts:33

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

`BlockOptions.skipConsensusFormatValidation`

#### Source

packages/block/types/types.d.ts:63
