[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / RunTxOpts

# Interface: RunTxOpts

Defined in: [packages/vm/src/utils/RunTxOpts.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L8)

Options for the `runTx` method.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="block"></a> `block?` | `Block` | The block the transaction belongs to. If omitted, a default blank block will be used. | [packages/vm/src/utils/RunTxOpts.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L13) |
| <a id="blockgasused"></a> `blockGasUsed?` | `bigint` | To obtain an accurate tx receipt input the block gas used up until this tx. | [packages/vm/src/utils/RunTxOpts.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L61) |
| <a id="preservejournal"></a> `preserveJournal?` | `boolean` | **`Internal`** If true, doesn't cleanup journal or commit state changes. Default is false. | [packages/vm/src/utils/RunTxOpts.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L67) |
| <a id="reportaccesslist"></a> `reportAccessList?` | `boolean` | If true, adds a generated EIP-2930 access list to the `RunTxResult` returned. Option works with all tx types. EIP-2929 needs to be activated (included in `berlin` HF). Note: if this option is used with a custom StateManager implementation StateManager.generateAccessList must be implemented. | [packages/vm/src/utils/RunTxOpts.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L50) |
| <a id="reportpreimages"></a> `reportPreimages?` | `boolean` | If true, adds a hashedKey -> preimages mapping of all touched accounts to the `RunTxResult` returned. | [packages/vm/src/utils/RunTxOpts.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L56) |
| <a id="skipbalance"></a> `skipBalance?` | `boolean` | Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail. | [packages/vm/src/utils/RunTxOpts.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L26) |
| <a id="skipblockgaslimitvalidation"></a> `skipBlockGasLimitValidation?` | `boolean` | If true, skips the validation of the tx's gas limit against the block's gas limit. | [packages/vm/src/utils/RunTxOpts.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L32) |
| <a id="skiphardforkvalidation"></a> `skipHardForkValidation?` | `boolean` | If true, skips the hardfork validation of vm, block and tx | [packages/vm/src/utils/RunTxOpts.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L38) |
| <a id="skipnonce"></a> `skipNonce?` | `boolean` | If true, skips the nonce check | [packages/vm/src/utils/RunTxOpts.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L21) |
| <a id="tx"></a> `tx` | `TypedTransaction` | The transaction to run. | [packages/vm/src/utils/RunTxOpts.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L17) |
