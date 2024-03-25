[@tevm/tx](README.md) / Exports

# @tevm/tx

## Table of contents

### Enumerations

- [Capability](enums/Capability.md)

### Classes

- [AccessListEIP2930Transaction](classes/AccessListEIP2930Transaction.md)
- [BlobEIP4844Transaction](classes/BlobEIP4844Transaction.md)
- [FeeMarketEIP1559Transaction](classes/FeeMarketEIP1559Transaction.md)
- [LegacyTransaction](classes/LegacyTransaction.md)
- [TransactionFactory](classes/TransactionFactory.md)

### Interfaces

- [EIP1559CompatibleTx](interfaces/EIP1559CompatibleTx.md)
- [TxData](interfaces/TxData.md)

### Type Aliases

- [TypedTransaction](modules.md#typedtransaction)

### Functions

- [isAccessListEIP2930Tx](modules.md#isaccesslisteip2930tx)
- [isBlobEIP4844Tx](modules.md#isblobeip4844tx)
- [isFeeMarketEIP1559Tx](modules.md#isfeemarketeip1559tx)
- [isLegacyTx](modules.md#islegacytx)

## Type Aliases

### TypedTransaction

Ƭ **TypedTransaction**: `Transaction`[`TransactionType`]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:92

## Functions

### isAccessListEIP2930Tx

▸ **isAccessListEIP2930Tx**(`tx`): tx is AccessListEIP2930Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](modules.md#typedtransaction) |

#### Returns

tx is AccessListEIP2930Transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:94

___

### isBlobEIP4844Tx

▸ **isBlobEIP4844Tx**(`tx`): tx is BlobEIP4844Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](modules.md#typedtransaction) |

#### Returns

tx is BlobEIP4844Transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:96

___

### isFeeMarketEIP1559Tx

▸ **isFeeMarketEIP1559Tx**(`tx`): tx is FeeMarketEIP1559Transaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](modules.md#typedtransaction) |

#### Returns

tx is FeeMarketEIP1559Transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:95

___

### isLegacyTx

▸ **isLegacyTx**(`tx`): tx is LegacyTransaction

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`TypedTransaction`](modules.md#typedtransaction) |

#### Returns

tx is LegacyTransaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:93
