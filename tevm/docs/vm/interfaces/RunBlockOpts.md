[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:6

Options for running a block.

## Properties

### block

> **block**: [`Block`](../../block/classes/Block.md)

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:10

The @ethereumjs/block to process

***

### clearCache?

> `optional` **clearCache**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:22

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

***

### generate?

> `optional` **generate**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:29

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:71

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### root?

> `optional` **root**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:14

Root of the state trie

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:66

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:56

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:35

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:40

If true, skips the hardfork validation of vm, block
and tx

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:47

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: packages/vm/types/utils/RunBlockOpts.d.ts:51

If true, skips the nonce check
