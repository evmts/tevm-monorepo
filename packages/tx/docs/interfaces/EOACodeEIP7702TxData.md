[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EOACodeEIP7702TxData

# Interface: EOACodeEIP7702TxData

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:302

[EOACode7702Tx](../classes/EOACodeEIP7702Transaction.md) data.

## Extends

- `FeeMarketEIP1559TxData`

## Properties

### accessList?

> `optional` **accessList**: `null` \| `AccessListBytes` \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:250

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

`FeeMarketEIP1559TxData.accessList`

***

### authorizationList?

> `optional` **authorizationList**: `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:303

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:246

The transaction's chain ID

#### Inherited from

`FeeMarketEIP1559TxData.chainId`

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:221

This will contain the data of the message or the init of a contract.

#### Inherited from

`FeeMarketEIP1559TxData.data`

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:209

The transaction's gas limit.

#### Inherited from

`FeeMarketEIP1559TxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice**: `null`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:260

The transaction's gas price, inherited from Transaction.  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

`FeeMarketEIP1559TxData.gasPrice`

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:268

The maximum total fee

#### Inherited from

`FeeMarketEIP1559TxData.maxFeePerGas`

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:264

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

`FeeMarketEIP1559TxData.maxPriorityFeePerGas`

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:201

The transaction's nonce.

#### Inherited from

`FeeMarketEIP1559TxData.nonce`

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:229

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.r`

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:233

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.s`

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:213

The transaction's the address is sent to.

#### Inherited from

`FeeMarketEIP1559TxData.to`

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:237

The transaction type

#### Inherited from

`FeeMarketEIP1559TxData.type`

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:225

EC recovery ID.

#### Inherited from

`FeeMarketEIP1559TxData.v`

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:217

The amount of Ether sent.

#### Inherited from

`FeeMarketEIP1559TxData.value`
