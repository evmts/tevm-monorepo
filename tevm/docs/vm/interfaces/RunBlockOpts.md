[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunBlockOpts

# Interface: RunBlockOpts

Options for running a block.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="block"></a> `block` | [`Block`](../../block/classes/Block.md) | The block to process. |
| <a id="clearcache"></a> `clearCache?` | `boolean` | Clearing the StateManager cache. If state root is not reset for whatever reason this can be set to `false` for better performance. Default: true |
| <a id="generate"></a> `generate?` | `boolean` | Whether to generate the stateRoot and other related fields. If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block. If `false`, `runBlock` throws if any fields do not match. Defaults to `false`. |
| <a id="reportpreimages"></a> `reportPreimages?` | `boolean` | If true, adds a hashedKey -> preimages mapping of all touched accounts to the `RunTxResult` returned. |
| <a id="root"></a> `root?` | `Uint8Array`\<`ArrayBufferLike`\> | Root of the state trie |
| <a id="sethardfork"></a> `setHardfork?` | `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md) | Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number for older Hfs. Additionally it is possible to pass in a specific TD value to support live-Merge-HF transitions. Note that this should only be needed in very rare and specific scenarios. Default: `false` (HF is set to whatever default HF is set by the Common instance) |
| <a id="skipbalance"></a> `skipBalance?` | `boolean` | If true, checks the balance of the `from` account for the transaction and sets its balance equal equal to the upfront cost (gas limit * gas price + transaction value) |
| <a id="skipblockvalidation"></a> `skipBlockValidation?` | `boolean` | If true, will skip "Block validation": Block validation validates the header (with respect to the blockchain), the transactions, the transaction trie and the uncle hash. |
| <a id="skiphardforkvalidation"></a> `skipHardForkValidation?` | `boolean` | If true, skips the hardfork validation of vm, block and tx |
| <a id="skipheadervalidation"></a> `skipHeaderValidation?` | `boolean` | if true, will skip "Header validation" If the block has been picked from the blockchain to be executed, header has already been validated, and can be skipped especially when consensus of the chain has moved ahead. |
| <a id="skipnonce"></a> `skipNonce?` | `boolean` | If true, skips the nonce check |
