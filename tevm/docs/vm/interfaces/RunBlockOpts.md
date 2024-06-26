[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Options for running a block.

## Properties

### block

> **block**: [`Block`](../../block/classes/Block.md)

The @ethereumjs/block to process

#### Defined in

packages/vm/types/utils/types.d.ts:202

***

### clearCache?

> `optional` **clearCache**: `boolean`

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

#### Defined in

packages/vm/types/utils/types.d.ts:214

***

### generate?

> `optional` **generate**: `boolean`

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

#### Defined in

packages/vm/types/utils/types.d.ts:221

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

packages/vm/types/utils/types.d.ts:263

***

### root?

> `optional` **root**: `Uint8Array`

Root of the state trie

#### Defined in

packages/vm/types/utils/types.d.ts:206

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

#### Defined in

packages/vm/types/utils/types.d.ts:258

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

#### Defined in

packages/vm/types/utils/types.d.ts:248

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

#### Defined in

packages/vm/types/utils/types.d.ts:227

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

packages/vm/types/utils/types.d.ts:232

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

#### Defined in

packages/vm/types/utils/types.d.ts:239

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

packages/vm/types/utils/types.d.ts:243
