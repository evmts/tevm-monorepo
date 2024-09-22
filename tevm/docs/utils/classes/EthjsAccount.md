[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [utils](../README.md) / EthjsAccount

# Class: EthjsAccount

Account class to load and maintain the  basic account objects.
Supports partial loading and access required for verkle with null
as the placeholder.

Note: passing undefined in constructor is different from null
While undefined leads to default assignment, null is retained
to track the information not available/loaded because of partial
witness access

## Constructors

### new EthjsAccount()

> **new EthjsAccount**(`nonce`?, `balance`?, `storageRoot`?, `codeHash`?, `codeSize`?, `version`?): [`EthjsAccount`](EthjsAccount.md)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.
undefined get assigned with the defaults present, but null args are retained as is

#### Parameters

• **nonce?**: `null` \| `bigint`

• **balance?**: `null` \| `bigint`

• **storageRoot?**: `null` \| `Uint8Array`

• **codeHash?**: `null` \| `Uint8Array`

• **codeSize?**: `null` \| `number`

• **version?**: `null` \| `number`

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:56

## Properties

### \_balance

> **\_balance**: `null` \| `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:29

***

### \_codeHash

> **\_codeHash**: `null` \| `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:31

***

### \_codeSize

> **\_codeSize**: `null` \| `number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:32

***

### \_nonce

> **\_nonce**: `null` \| `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:28

***

### \_storageRoot

> **\_storageRoot**: `null` \| `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:30

***

### \_version

> **\_version**: `null` \| `number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:33

## Accessors

### balance

> `get` **balance**(): `bigint`

> `set` **balance**(`_balance`): `void`

#### Parameters

• **\_balance**: `bigint`

#### Returns

`bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:38

***

### codeHash

> `get` **codeHash**(): `Uint8Array`

> `set` **codeHash**(`_codeHash`): `void`

#### Parameters

• **\_codeHash**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:42

***

### codeSize

> `get` **codeSize**(): `number`

> `set` **codeSize**(`_codeSize`): `void`

#### Parameters

• **\_codeSize**: `number`

#### Returns

`number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:44

***

### nonce

> `get` **nonce**(): `bigint`

> `set` **nonce**(`_nonce`): `void`

#### Parameters

• **\_nonce**: `bigint`

#### Returns

`bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:36

***

### storageRoot

> `get` **storageRoot**(): `Uint8Array`

> `set` **storageRoot**(`_storageRoot`): `void`

#### Parameters

• **\_storageRoot**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:40

***

### version

> `get` **version**(): `number`

> `set` **version**(`_version`): `void`

#### Parameters

• **\_version**: `number`

#### Returns

`number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:34

## Methods

### isContract()

> **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:70

***

### isEmpty()

> **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:76

***

### raw()

> **raw**(): `Uint8Array`[]

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:61

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:65

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:66

***

### fromAccountData()

> `static` **fromAccountData**(`accountData`): [`EthjsAccount`](EthjsAccount.md)

#### Parameters

• **accountData**: `AccountData`

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:46

***

### fromPartialAccountData()

> `static` **fromPartialAccountData**(`partialAccountData`): [`EthjsAccount`](EthjsAccount.md)

#### Parameters

• **partialAccountData**: `PartialAccountData`

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:47

***

### fromRlpSerializedAccount()

> `static` **fromRlpSerializedAccount**(`serialized`): [`EthjsAccount`](EthjsAccount.md)

#### Parameters

• **serialized**: `Uint8Array`

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:48

***

### fromRlpSerializedPartialAccount()

> `static` **fromRlpSerializedPartialAccount**(`serialized`): [`EthjsAccount`](EthjsAccount.md)

#### Parameters

• **serialized**: `Uint8Array`

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:49

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`): [`EthjsAccount`](EthjsAccount.md)

#### Parameters

• **values**: `Uint8Array`[]

#### Returns

[`EthjsAccount`](EthjsAccount.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:50
