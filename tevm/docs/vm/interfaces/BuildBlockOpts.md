[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blockopts"></a> `blockOpts?` | [`BuilderOpts`](BuilderOpts.md) | The block and builder options to use. |
| <a id="headerdata"></a> `headerData?` | [`HeaderData`](../../block/interfaces/HeaderData.md) | The block header data to use. Defaults used for any values not provided. |
| <a id="parentblock"></a> `parentBlock` | [`Block`](../../block/classes/Block.md) | The parent block |
| <a id="withdrawals"></a> `withdrawals?` | [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[] | - |
