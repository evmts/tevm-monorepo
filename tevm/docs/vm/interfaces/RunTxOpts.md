[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Options for the `runTx` method.

## Properties

### block?

> `optional` **block**: [`Block`](../../block/classes/Block.md)

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

#### Source

packages/vm/types/utils/types.d.ts:326

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

To obtain an accurate tx receipt input the block gas used up until this tx.

#### Source

packages/vm/types/utils/types.d.ts:368

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom [StateManager](../../state/interfaces/StateManager.md) implementation
StateManager.generateAccessList must be implemented.

#### Source

packages/vm/types/utils/types.d.ts:359

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Source

packages/vm/types/utils/types.d.ts:364

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

#### Source

packages/vm/types/utils/types.d.ts:338

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

If true, skips the validation of the tx's gas limit
against the block's gas limit.

#### Source

packages/vm/types/utils/types.d.ts:343

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Source

packages/vm/types/utils/types.d.ts:348

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Source

packages/vm/types/utils/types.d.ts:334

***

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

An `@ethereumjs/tx` to run

#### Source

packages/vm/types/utils/types.d.ts:330
