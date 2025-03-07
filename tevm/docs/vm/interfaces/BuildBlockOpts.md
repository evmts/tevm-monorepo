[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: packages/vm/types/utils/BuildBlockOpts.d.ts:7

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

Defined in: packages/vm/types/utils/BuildBlockOpts.d.ts:21

The block and builder options to use.

***

### headerData?

> `optional` **headerData**: [`HeaderData`](../../block/interfaces/HeaderData.md)

Defined in: packages/vm/types/utils/BuildBlockOpts.d.ts:16

The block header data to use.
Defaults used for any values not provided.

***

### parentBlock

> **parentBlock**: [`Block`](../../block/classes/Block.md)

Defined in: packages/vm/types/utils/BuildBlockOpts.d.ts:11

The parent block

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[]

Defined in: packages/vm/types/utils/BuildBlockOpts.d.ts:17
