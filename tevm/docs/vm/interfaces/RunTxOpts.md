[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:6

Options for the `runTx` method.

## Properties

### block?

> `optional` **block**: [`Block`](../../block/classes/Block.md)

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:11

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:53

To obtain an accurate tx receipt input the block gas used up until this tx.

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:44

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:49

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:23

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:28

If true, skips the validation of the tx's gas limit
against the block's gas limit.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:33

If true, skips the hardfork validation of vm, block
and tx

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:19

If true, skips the nonce check

***

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

Defined in: packages/vm/types/utils/RunTxOpts.d.ts:15

An `@ethereumjs/tx` to run
