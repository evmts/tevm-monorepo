[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Defined in

[packages/vm/src/utils/types.ts:196](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L196)

***

### headerData?

> `optional` **headerData**: `HeaderData`

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[packages/vm/src/utils/types.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L190)

***

### parentBlock

> **parentBlock**: `Block`

The parent block

#### Defined in

[packages/vm/src/utils/types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L184)

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[packages/vm/src/utils/types.ts:192](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L192)
