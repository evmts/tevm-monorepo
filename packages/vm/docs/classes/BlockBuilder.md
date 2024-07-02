[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BlockBuilder

# Class: BlockBuilder

## Constructors

### new BlockBuilder()

> **new BlockBuilder**(`vm`, `opts`): [`BlockBuilder`](BlockBuilder.md)

#### Parameters

• **vm**: `BaseVm`

• **opts**: [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

#### Returns

[`BlockBuilder`](BlockBuilder.md)

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L78)

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint`

The cumulative blob gas used by the blobs in a block

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L54)

***

### gasUsed

> **gasUsed**: `bigint`

The cumulative gas used by the transactions added to the block.

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L50)

## Accessors

### minerValue

> `get` **minerValue**(): `bigint`

#### Returns

`bigint`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L74)

***

### transactionReceipts

> `get` **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

#### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L70)

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.skipHardForkValidation?**: `boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:218](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L218)

***

### build()

> **build**(`sealOpts`?): `Promise`\<`Block`\>

This method returns the finalized block.
It also:
 - Assigns the reward for miner (PoW)
 - Commits the checkpoint on the StateManager
 - Sets the tip of the VM's blockchain to this block
For PoW, optionally seals the block with params `nonce` and `mixHash`,
which is validated along with the block number and difficulty by ethash.
For PoA, please pass `blockOption.cliqueSigner` into the buildBlock constructor,
as the signer will be awarded the txs amount spent on gas as they are added.

#### Parameters

• **sealOpts?**: [`SealBlockOpts`](../interfaces/SealBlockOpts.md)

#### Returns

`Promise`\<`Block`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:309](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L309)

***

### getStatus()

> **getStatus**(): [`BlockStatus`](../type-aliases/BlockStatus.md)

#### Returns

[`BlockStatus`](../type-aliases/BlockStatus.md)

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L130)

***

### initState()

> **initState**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:373](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L373)

***

### logsBloom()

> **logsBloom**(): `Uint8Array`

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L147)

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L159)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L290)

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L137)
