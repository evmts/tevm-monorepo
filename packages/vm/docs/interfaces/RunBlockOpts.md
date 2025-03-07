[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / RunBlockOpts

# Interface: RunBlockOpts

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L8)

Options for running a block.

## Properties

### block

> **block**: `Block`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L12)

The @ethereumjs/block to process

***

### clearCache?

> `optional` **clearCache**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L24)

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

***

### generate?

> `optional` **generate**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L31)

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L74)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### root?

> `optional` **root**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L16)

Root of the state trie

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L68)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L58)

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L37)

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L42)

If true, skips the hardfork validation of vm, block
and tx

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L49)

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: [packages/vm/src/utils/RunBlockOpts.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L53)

If true, skips the nonce check
