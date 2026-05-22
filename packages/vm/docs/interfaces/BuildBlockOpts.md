[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Defined in: [packages/vm/src/utils/BuildBlockOpts.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L8)

Options for building a block.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blockopts"></a> `blockOpts?` | [`BuilderOpts`](BuilderOpts.md) | The block and builder options to use. | [packages/vm/src/utils/BuildBlockOpts.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L24) |
| <a id="headerdata"></a> `headerData?` | `HeaderData` | The block header data to use. Defaults used for any values not provided. | [packages/vm/src/utils/BuildBlockOpts.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L18) |
| <a id="parentblock"></a> `parentBlock` | `Block` | The parent block | [packages/vm/src/utils/BuildBlockOpts.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L12) |
| <a id="withdrawals"></a> `withdrawals?` | `WithdrawalData`[] | - | [packages/vm/src/utils/BuildBlockOpts.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L20) |
