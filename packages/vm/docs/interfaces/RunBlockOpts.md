[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / RunBlockOpts

# Interface: RunBlockOpts

Options for running a block.

## Properties

### block

> **block**: `Block`

The @ethereumjs/block to process

#### Defined in

[packages/vm/src/utils/types.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L223)

***

### clearCache?

> `optional` **clearCache**: `boolean`

Clearing the StateManager cache.

If state root is not reset for whatever reason this can be set to `false` for better performance.

Default: true

#### Defined in

[packages/vm/src/utils/types.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L235)

***

### generate?

> `optional` **generate**: `boolean`

Whether to generate the stateRoot and other related fields.
If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
If `false`, `runBlock` throws if any fields do not match.
Defaults to `false`.

#### Defined in

[packages/vm/src/utils/types.ts:242](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L242)

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

[packages/vm/src/utils/types.ts:285](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L285)

***

### root?

> `optional` **root**: `Uint8Array`

Root of the state trie

#### Defined in

[packages/vm/src/utils/types.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L227)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[packages/vm/src/utils/types.ts:279](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L279)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

If true, checks the balance of the `from` account for the transaction and sets its
balance equal equal to the upfront cost (gas limit * gas price + transaction value)

#### Defined in

[packages/vm/src/utils/types.ts:269](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L269)

***

### skipBlockValidation?

> `optional` **skipBlockValidation**: `boolean`

If true, will skip "Block validation":
Block validation validates the header (with respect to the blockchain),
the transactions, the transaction trie and the uncle hash.

#### Defined in

[packages/vm/src/utils/types.ts:248](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L248)

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

[packages/vm/src/utils/types.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L253)

***

### skipHeaderValidation?

> `optional` **skipHeaderValidation**: `boolean`

if true, will skip "Header validation"
If the block has been picked from the blockchain to be executed,
header has already been validated, and can be skipped especially when
consensus of the chain has moved ahead.

#### Defined in

[packages/vm/src/utils/types.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L260)

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[packages/vm/src/utils/types.ts:264](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L264)
