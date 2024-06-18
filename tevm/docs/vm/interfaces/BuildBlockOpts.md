[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Source

packages/vm/types/utils/types.d.ts:178

***

### headerData?

> `optional` **headerData**: [`HeaderData`](../../block/interfaces/HeaderData.md)

The block header data to use.
Defaults used for any values not provided.

#### Source

packages/vm/types/utils/types.d.ts:173

***

### parentBlock

> **parentBlock**: [`Block`](../../block/classes/Block.md)

The parent block

#### Source

packages/vm/types/utils/types.d.ts:168

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[]

#### Source

packages/vm/types/utils/types.d.ts:174
