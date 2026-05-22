[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Options for the `runTx` method.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="block"></a> `block?` | [`Block`](../../block/classes/Block.md) | The block the transaction belongs to. If omitted, a default blank block will be used. |
| <a id="blockgasused"></a> `blockGasUsed?` | `bigint` | To obtain an accurate tx receipt input the block gas used up until this tx. |
| <a id="preservejournal"></a> `preserveJournal?` | `boolean` | **`Internal`** If true, doesn't cleanup journal or commit state changes. Default is false. |
| <a id="reportaccesslist"></a> `reportAccessList?` | `boolean` | If true, adds a generated EIP-2930 access list to the `RunTxResult` returned. Option works with all tx types. EIP-2929 needs to be activated (included in `berlin` HF). Note: if this option is used with a custom StateManager implementation StateManager.generateAccessList must be implemented. |
| <a id="reportpreimages"></a> `reportPreimages?` | `boolean` | If true, adds a hashedKey -> preimages mapping of all touched accounts to the `RunTxResult` returned. |
| <a id="skipbalance"></a> `skipBalance?` | `boolean` | Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail. |
| <a id="skipblockgaslimitvalidation"></a> `skipBlockGasLimitValidation?` | `boolean` | If true, skips the validation of the tx's gas limit against the block's gas limit. |
| <a id="skiphardforkvalidation"></a> `skipHardForkValidation?` | `boolean` | If true, skips the hardfork validation of vm, block and tx |
| <a id="skipnonce"></a> `skipNonce?` | `boolean` | If true, skips the nonce check |
| <a id="tx"></a> `tx` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | The transaction to run. |
