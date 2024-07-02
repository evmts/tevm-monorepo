---
editUrl: false
next: false
prev: false
title: "RunBlockOpts"
---

Options for running a block.

## Properties

### block

> **block**: [`Block`](/reference/tevm/block/classes/block/)

The @ethereumjs/block to process

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L12)

***

### clearCache?

> `optional` **clearCache**: `boolean`

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L24)

***

### generate?

> `optional` **generate**: `boolean`

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L31)

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L74)

***

### root?

> `optional` **root**: `Uint8Array`

Root of the state trie

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L16)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../../../../../../reference/tevm/common/type-aliases/common) instance)

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L68)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L58)

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L37)

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L42)

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L49)

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[packages/vm/src/utils/RunBlockOpts.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockOpts.ts#L53)
