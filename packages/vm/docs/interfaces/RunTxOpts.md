[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / RunTxOpts

# Interface: RunTxOpts

Defined in: [packages/vm/src/utils/RunTxOpts.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L8)

Options for the `runTx` method.

## Properties

### block?

> `optional` **block**: `Block`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L13)

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L61)

To obtain an accurate tx receipt input the block gas used up until this tx.

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L50)

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L56)

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L26)

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L32)

If true, skips the validation of the tx's gas limit
against the block's gas limit.

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L38)

If true, skips the hardfork validation of vm, block
and tx

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L21)

If true, skips the nonce check

***

### tx

> **tx**: `TypedTransaction`

Defined in: [packages/vm/src/utils/RunTxOpts.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L17)

An `@ethereumjs/tx` to run
