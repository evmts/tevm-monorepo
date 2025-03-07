[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L8)

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L24)

The block and builder options to use.

***

### headerData?

> `optional` **headerData**: `HeaderData`

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L18)

The block header data to use.
Defaults used for any values not provided.

***

### parentBlock

> **parentBlock**: `Block`

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L12)

The parent block

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L20)
