[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EthjsAccount

# Class: EthjsAccount

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:27

Account class to load and maintain the  basic account objects.
Supports partial loading and access required for verkle with null
as the placeholder.

Note: passing undefined in constructor is different from null
While undefined leads to default assignment, null is retained
to track the information not available/loaded because of partial
witness access

## Constructors

### new EthjsAccount()

> **new EthjsAccount**(`nonce`?, `balance`?, `storageRoot`?, `codeHash`?, `codeSize`?, `version`?): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:56

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.
undefined get assigned with the defaults present, but null args are retained as is

#### Parameters

##### nonce?

`null` | `bigint`

##### balance?

`null` | `bigint`

##### storageRoot?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### codeHash?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### codeSize?

`null` | `number`

##### version?

`null` | `number`

#### Returns

`Account`

## Properties

### \_balance

> **\_balance**: `null` \| `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:29

***

### \_codeHash

> **\_codeHash**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:31

***

### \_codeSize

> **\_codeSize**: `null` \| `number`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:32

***

### \_nonce

> **\_nonce**: `null` \| `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:28

***

### \_storageRoot

> **\_storageRoot**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:30

***

### \_version

> **\_version**: `null` \| `number`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:33

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:38

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`_balance`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:39

##### Parameters

###### \_balance

`bigint`

##### Returns

`void`

***

### codeHash

#### Get Signature

> **get** **codeHash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:42

##### Returns

`Uint8Array`

#### Set Signature

> **set** **codeHash**(`_codeHash`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:43

##### Parameters

###### \_codeHash

`Uint8Array`

##### Returns

`void`

***

### codeSize

#### Get Signature

> **get** **codeSize**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:44

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`_codeSize`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:45

##### Parameters

###### \_codeSize

`number`

##### Returns

`void`

***

### nonce

#### Get Signature

> **get** **nonce**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:36

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`_nonce`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:37

##### Parameters

###### \_nonce

`bigint`

##### Returns

`void`

***

### storageRoot

#### Get Signature

> **get** **storageRoot**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:40

##### Returns

`Uint8Array`

#### Set Signature

> **set** **storageRoot**(`_storageRoot`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:41

##### Parameters

###### \_storageRoot

`Uint8Array`

##### Returns

`void`

***

### version

#### Get Signature

> **get** **version**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:34

##### Returns

`number`

#### Set Signature

> **set** **version**(`_version`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:35

##### Parameters

###### \_version

`number`

##### Returns

`void`

## Methods

### isContract()

> **isContract**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:70

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:76

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:61

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:65

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:66

#### Returns

`Uint8Array`

***

### fromAccountData()

> `static` **fromAccountData**(`accountData`): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:46

#### Parameters

##### accountData

`AccountData`

#### Returns

`Account`

***

### fromPartialAccountData()

> `static` **fromPartialAccountData**(`partialAccountData`): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:47

#### Parameters

##### partialAccountData

`PartialAccountData`

#### Returns

`Account`

***

### fromRlpSerializedAccount()

> `static` **fromRlpSerializedAccount**(`serialized`): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:48

#### Parameters

##### serialized

`Uint8Array`

#### Returns

`Account`

***

### fromRlpSerializedPartialAccount()

> `static` **fromRlpSerializedPartialAccount**(`serialized`): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:49

#### Parameters

##### serialized

`Uint8Array`

#### Returns

`Account`

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`): `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:50

#### Parameters

##### values

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Account`
