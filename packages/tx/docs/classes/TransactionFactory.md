[@tevm/tx](../README.md) / [Exports](../modules.md) / TransactionFactory

# Class: TransactionFactory

## Table of contents

### Constructors

- [constructor](TransactionFactory.md#constructor)

### Methods

- [fromBlockBodyData](TransactionFactory.md#fromblockbodydata)
- [fromJsonRpcProvider](TransactionFactory.md#fromjsonrpcprovider)
- [fromRPC](TransactionFactory.md#fromrpc)
- [fromSerializedData](TransactionFactory.md#fromserializeddata)
- [fromTxData](TransactionFactory.md#fromtxdata)

## Constructors

### constructor

• **new TransactionFactory**(): [`TransactionFactory`](TransactionFactory.md)

#### Returns

[`TransactionFactory`](TransactionFactory.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:9

## Methods

### fromBlockBodyData

▸ **fromBlockBodyData**(`data`, `txOptions?`): [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` \| `Uint8Array`[] | A Uint8Array or Uint8Array[] |
| `txOptions?` | `TxOptions` | The transaction options |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:33

___

### fromJsonRpcProvider

▸ **fromJsonRpcProvider**(`provider`, `txHash`, `txOptions?`): `Promise`\<[`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)\>

Method to retrieve a transaction from the provider

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `EthersProvider` | a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object |
| `txHash` | `string` | Transaction hash |
| `txOptions?` | `TxOptions` | The transaction options |

#### Returns

`Promise`\<[`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)\>

the transaction specified by `txHash`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:41

___

### fromRPC

▸ **fromRPC**\<`T`\>(`txData`, `txOptions?`): `Promise`\<`Transaction`[`T`]\>

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `TransactionType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`TxData`](../interfaces/TxData.md)[`T`] | The RPC-encoded data |
| `txOptions?` | `TxOptions` | The transaction options |

#### Returns

`Promise`\<`Transaction`[`T`]\>

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:49

___

### fromSerializedData

▸ **fromSerializedData**\<`T`\>(`data`, `txOptions?`): `Transaction`[`T`]

This method tries to decode serialized data.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `TransactionType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data Uint8Array |
| `txOptions?` | `TxOptions` | The transaction options |

#### Returns

`Transaction`[`T`]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:23

___

### fromTxData

▸ **fromTxData**\<`T`\>(`txData`, `txOptions?`): `Transaction`[`T`]

Create a transaction from a `txData` object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `TransactionType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | `TypedTxData` | The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction) |
| `txOptions?` | `TxOptions` | Options to pass on to the constructor of the transaction |

#### Returns

`Transaction`[`T`]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:16
