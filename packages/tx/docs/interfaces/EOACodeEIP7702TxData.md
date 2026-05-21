[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EOACodeEIP7702TxData

# Interface: EOACodeEIP7702TxData

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:366

[EOACode7702Tx](../classes/EOACodeEIP7702Transaction.md) data.

## Extends

- `FeeMarketEIP1559TxData`

## Properties

### accessList?

> `optional` **accessList?**: `AccessListBytes` \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:310

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

`FeeMarketEIP1559TxData.accessList`

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:367

***

### chainId?

> `optional` **chainId?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:306

The transaction's chain ID

#### Inherited from

`FeeMarketEIP1559TxData.chainId`

***

### data?

> `optional` **data?**: `""` \| `BytesLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:281

This will contain the data of the message or the init of a contract.

#### Inherited from

`FeeMarketEIP1559TxData.data`

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:269

The transaction's gas limit.

#### Inherited from

`FeeMarketEIP1559TxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `null`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:320

The transaction's gas price, inherited from Transaction.  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

`FeeMarketEIP1559TxData.gasPrice`

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:328

The maximum total fee

#### Inherited from

`FeeMarketEIP1559TxData.maxFeePerGas`

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:324

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

`FeeMarketEIP1559TxData.maxPriorityFeePerGas`

***

### nonce?

> `optional` **nonce?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:261

The transaction's nonce.

#### Inherited from

`FeeMarketEIP1559TxData.nonce`

***

### r?

> `optional` **r?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:289

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.r`

***

### s?

> `optional` **s?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:293

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.s`

***

### to?

> `optional` **to?**: `""` \| `AddressLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:273

The transaction's the address is sent to.

#### Inherited from

`FeeMarketEIP1559TxData.to`

***

### type?

> `optional` **type?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:297

The transaction type

#### Inherited from

`FeeMarketEIP1559TxData.type`

***

### v?

> `optional` **v?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:285

EC recovery ID.

#### Inherited from

`FeeMarketEIP1559TxData.v`

***

### value?

> `optional` **value?**: `BigIntLike`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:277

The amount of Ether sent.

#### Inherited from

`FeeMarketEIP1559TxData.value`
