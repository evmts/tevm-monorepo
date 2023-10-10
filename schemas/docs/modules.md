[@evmts/schemas](README.md) / Exports

# @evmts/schemas

## Table of contents

### Classes

- [InvalidAddressBookError](classes/InvalidAddressBookError.md)
- [InvalidAddressError](classes/InvalidAddressError.md)
- [InvalidBlockNumberError](classes/InvalidBlockNumberError.md)
- [InvalidHexStringError](classes/InvalidHexStringError.md)
- [InvalidINTError](classes/InvalidINTError.md)
- [InvalidUINTError](classes/InvalidUINTError.md)
- [InvalidUrlError](classes/InvalidUrlError.md)

### Interfaces

- [AddressBookEntry](interfaces/AddressBookEntry.md)
- [SchemaOptions](interfaces/SchemaOptions.md)

### Type Aliases

- [Address](modules.md#address)
- [AddressBook](modules.md#addressbook)
- [BlockNumber](modules.md#blocknumber)
- [HexString](modules.md#hexstring)
- [INT128](modules.md#int128)
- [INT16](modules.md#int16)
- [INT256](modules.md#int256)
- [INT32](modules.md#int32)
- [INT64](modules.md#int64)
- [INT8](modules.md#int8)
- [INTName](modules.md#intname)
- [INTSize](modules.md#intsize)
- [IsAddressBook](modules.md#isaddressbook)
- [SAddress](modules.md#saddress)
- [SAddressSchema](modules.md#saddressschema)
- [UINT128](modules.md#uint128)
- [UINT16](modules.md#uint16)
- [UINT256](modules.md#uint256)
- [UINT32](modules.md#uint32)
- [UINT64](modules.md#uint64)
- [UINT8](modules.md#uint8)
- [UINTName](modules.md#uintname)
- [UINTSize](modules.md#uintsize)
- [Url](modules.md#url)

### Variables

- [INT128\_MAX](modules.md#int128_max)
- [INT128\_MIN](modules.md#int128_min)
- [INT16\_MAX](modules.md#int16_max)
- [INT16\_MIN](modules.md#int16_min)
- [INT256\_MAX](modules.md#int256_max)
- [INT256\_MIN](modules.md#int256_min)
- [INT32\_MAX](modules.md#int32_max)
- [INT32\_MIN](modules.md#int32_min)
- [INT64\_MAX](modules.md#int64_max)
- [INT64\_MIN](modules.md#int64_min)
- [INT8\_MAX](modules.md#int8_max)
- [INT8\_MIN](modules.md#int8_min)
- [SAddress](modules.md#saddress-1)
- [SAddressBook](modules.md#saddressbook)
- [SBlockNumber](modules.md#sblocknumber)
- [SHexString](modules.md#shexstring)
- [SINT128](modules.md#sint128)
- [SINT16](modules.md#sint16)
- [SINT256](modules.md#sint256)
- [SINT32](modules.md#sint32)
- [SINT64](modules.md#sint64)
- [SINT8](modules.md#sint8)
- [SUINT128](modules.md#suint128)
- [SUINT16](modules.md#suint16)
- [SUINT256](modules.md#suint256)
- [SUINT32](modules.md#suint32)
- [SUINT64](modules.md#suint64)
- [SUINT8](modules.md#suint8)
- [SUrl](modules.md#surl)
- [UINT128\_MAX](modules.md#uint128_max)
- [UINT16\_MAX](modules.md#uint16_max)
- [UINT256\_MAX](modules.md#uint256_max)
- [UINT32\_MAX](modules.md#uint32_max)
- [UINT64\_MAX](modules.md#uint64_max)
- [UINT8\_MAX](modules.md#uint8_max)

### Functions

- [isAddress](modules.md#isaddress)
- [isAddressBook](modules.md#isaddressbook-1)
- [isBlockNumber](modules.md#isblocknumber)
- [isHexString](modules.md#ishexstring)
- [isINT128](modules.md#isint128)
- [isINT16](modules.md#isint16)
- [isINT256](modules.md#isint256)
- [isINT32](modules.md#isint32)
- [isINT64](modules.md#isint64)
- [isINT8](modules.md#isint8)
- [isUINT128](modules.md#isuint128)
- [isUINT16](modules.md#isuint16)
- [isUINT256](modules.md#isuint256)
- [isUINT32](modules.md#isuint32)
- [isUINT64](modules.md#isuint64)
- [isUINT8](modules.md#isuint8)
- [isUrl](modules.md#isurl)
- [parseAddress](modules.md#parseaddress)
- [parseAddressBook](modules.md#parseaddressbook)
- [parseAddressBookSafe](modules.md#parseaddressbooksafe)
- [parseAddressSafe](modules.md#parseaddresssafe)
- [parseBlockNumber](modules.md#parseblocknumber)
- [parseBlockNumberSafe](modules.md#parseblocknumbersafe)
- [parseHexString](modules.md#parsehexstring)
- [parseHexStringSafe](modules.md#parsehexstringsafe)
- [parseINT128Safe](modules.md#parseint128safe)
- [parseINT16Safe](modules.md#parseint16safe)
- [parseINT256Safe](modules.md#parseint256safe)
- [parseINT32Safe](modules.md#parseint32safe)
- [parseINT64Safe](modules.md#parseint64safe)
- [parseINT8Safe](modules.md#parseint8safe)
- [parseInt128](modules.md#parseint128)
- [parseInt16](modules.md#parseint16)
- [parseInt256](modules.md#parseint256)
- [parseInt32](modules.md#parseint32)
- [parseInt64](modules.md#parseint64)
- [parseInt8](modules.md#parseint8)
- [parseUINT128](modules.md#parseuint128)
- [parseUINT128Safe](modules.md#parseuint128safe)
- [parseUINT16](modules.md#parseuint16)
- [parseUINT16Safe](modules.md#parseuint16safe)
- [parseUINT256](modules.md#parseuint256)
- [parseUINT256Safe](modules.md#parseuint256safe)
- [parseUINT32](modules.md#parseuint32)
- [parseUINT32Safe](modules.md#parseuint32safe)
- [parseUINT64](modules.md#parseuint64)
- [parseUINT64Safe](modules.md#parseuint64safe)
- [parseUINT8](modules.md#parseuint8)
- [parseUINT8Safe](modules.md#parseuint8safe)
- [parseUrl](modules.md#parseurl)
- [parseUrlSafe](modules.md#parseurlsafe)

## Type Aliases

### Address

Ƭ **Address**<\>: \`0x${string}\`

Type representing a valid Ethereum address

#### Defined in

[schemas/src/SAddress.js:11](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L11)

___

### AddressBook

Ƭ **AddressBook**<\>: `__module`

#### Defined in

[schemas/src/SAddressBook.js:26](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddressBook.js#L26)

___

### BlockNumber

Ƭ **BlockNumber**<\>: `number`

#### Defined in

[schemas/src/SBlockNumber.js:16](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SBlockNumber.js#L16)

___

### HexString

Ƭ **HexString**<\>: `string`

#### Defined in

[schemas/src/SHexString.js:14](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SHexString.js#L14)

___

### INT128

Ƭ **INT128**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:41](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L41)

___

### INT16

Ƭ **INT16**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:26](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L26)

___

### INT256

Ƭ **INT256**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:46](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L46)

___

### INT32

Ƭ **INT32**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:31](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L31)

___

### INT64

Ƭ **INT64**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:36](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L36)

___

### INT8

Ƭ **INT8**<\>: `bigint`

#### Defined in

[schemas/src/SINT.js:21](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L21)

___

### INTName

Ƭ **INTName**<\>: ``"int8"`` \| ``"int16"`` \| ``"int32"`` \| ``"int64"`` \| ``"int128"`` \| ``"int256"``

#### Defined in

[schemas/src/SINT.js:307](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L307)

___

### INTSize

Ƭ **INTSize**<\>: ``8`` \| ``16`` \| ``32`` \| ``64`` \| ``128`` \| ``256``

#### Defined in

[schemas/src/SINT.js:308](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L308)

___

### IsAddressBook

Ƭ **IsAddressBook**: <TContractNames\>(`addressBook`: `unknown`) => addressBook is AddressBook<TContractNames\>

#### Type declaration

▸ <`TContractNames`\>(`addressBook`): addressBook is AddressBook<TContractNames\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TContractNames` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `unknown` |

##### Returns

addressBook is AddressBook<TContractNames\>

#### Defined in

[schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/types.d.ts#L27)

___

### SAddress

Ƭ **SAddress**<\>: [`SAddressSchema`](modules.md#saddressschema)

Effect/schema for Address type.

#### Defined in

[schemas/src/SAddress.js:26](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L26)

[schemas/src/SAddress.js:24](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L24)

___

### SAddressSchema

Ƭ **SAddressSchema**<\>: `Schema`

#### Defined in

[schemas/src/SAddress.js:20](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L20)

___

### UINT128

Ƭ **UINT128**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:64](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L64)

___

### UINT16

Ƭ **UINT16**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:31](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L31)

___

### UINT256

Ƭ **UINT256**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:75](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L75)

___

### UINT32

Ƭ **UINT32**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:42](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L42)

___

### UINT64

Ƭ **UINT64**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:53](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L53)

___

### UINT8

Ƭ **UINT8**<\>: `bigint`

#### Defined in

[schemas/src/SUINT.js:20](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L20)

___

### UINTName

Ƭ **UINTName**<\>: ``"uint8"`` \| ``"uint16"`` \| ``"uint32"`` \| ``"uint64"`` \| ``"uint128"`` \| ``"uint256"``

#### Defined in

[schemas/src/SUINT.js:288](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L288)

___

### UINTSize

Ƭ **UINTSize**<\>: ``8`` \| ``16`` \| ``32`` \| ``64`` \| ``128`` \| ``256``

#### Defined in

[schemas/src/SUINT.js:289](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L289)

___

### Url

Ƭ **Url**<\>: `string`

#### Defined in

[schemas/src/SUrl.js:14](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUrl.js#L14)

## Variables

### INT128\_MAX

• `Const` **INT128\_MAX**: `bigint`

The maximum value a [INT128](modules.md#int128) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:93](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L93)

___

### INT128\_MIN

• `Const` **INT128\_MIN**: `bigint` = `-BigInt('0x80000000000000000000000000000000')`

The minimum value a [INT128](modules.md#int128) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:98](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L98)

___

### INT16\_MAX

• `Const` **INT16\_MAX**: `bigint`

The maximum value a [INT16](modules.md#int16) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:63](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L63)

___

### INT16\_MIN

• `Const` **INT16\_MIN**: `bigint` = `-BigInt('0x8000')`

The minimum value a [INT16](modules.md#int16) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:68](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L68)

___

### INT256\_MAX

• `Const` **INT256\_MAX**: `bigint`

The maximum value a [INT256](modules.md#int256) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:103](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L103)

___

### INT256\_MIN

• `Const` **INT256\_MIN**: `bigint` = `-BigInt( '0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',)`

The minimum value a [INT256](modules.md#int256) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:110](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L110)

___

### INT32\_MAX

• `Const` **INT32\_MAX**: `bigint`

The maximum value a [INT32](modules.md#int32) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:73](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L73)

___

### INT32\_MIN

• `Const` **INT32\_MIN**: `bigint` = `-BigInt('0x80000000')`

The minimum value a [INT32](modules.md#int32) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:78](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L78)

___

### INT64\_MAX

• `Const` **INT64\_MAX**: `bigint`

The maximum value a [INT64](modules.md#int64) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:83](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L83)

___

### INT64\_MIN

• `Const` **INT64\_MIN**: `bigint` = `-BigInt('0x8000000000000000')`

The minimum value a [INT64](modules.md#int64) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:88](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L88)

___

### INT8\_MAX

• `Const` **INT8\_MAX**: `bigint`

The maximum value a [INT8](modules.md#int8) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:53](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L53)

___

### INT8\_MIN

• `Const` **INT8\_MIN**: `bigint` = `-BigInt('0x80')`

The minimum value a [INT8](modules.md#int8) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:58](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L58)

___

### SAddress

• `Const` **SAddress**: `Schema`<`string`, \`0x${string}\`\>

#### Defined in

[schemas/src/SAddress.js:26](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L26)

[schemas/src/SAddress.js:24](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L24)

___

### SAddressBook

• `Const` **SAddressBook**: `Schema`<`__module`, `__module`\>

[Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type.

#### Defined in

[schemas/src/SAddressBook.js:46](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddressBook.js#L46)

___

### SBlockNumber

• `Const` **SBlockNumber**: `Schema`<`number`, `number`\>

[Effect schema](https://github.com/Effect-TS/schema) for the BlockNumber type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SBlockNumber: Schema<number, BlockNumber>;
```

#### Defined in

[schemas/src/SBlockNumber.js:33](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SBlockNumber.js#L33)

___

### SHexString

• `Const` **SHexString**: `Schema`<`string`, `string`\>

[Effect schema](https://github.com/Effect-TS/schema) for the HexString type.

**`Example`**

```javascript
import { Schema } from '@effect/schema/Schema';
export const SHexString: Schema<string, HexString>;
```

#### Defined in

[schemas/src/SHexString.js:31](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SHexString.js#L31)

___

### SINT128

• `Const` **SINT128**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT128 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT128: Schema<bigint, INT128>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:184](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L184)

___

### SINT16

• `Const` **SINT16**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT16 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT16: Schema<bigint, INT16>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:139](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L139)

___

### SINT256

• `Const` **SINT256**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT256 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT256: Schema<bigint, INT256>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:199](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L199)

___

### SINT32

• `Const` **SINT32**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT32 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT32: Schema<bigint, INT32>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:154](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L154)

___

### SINT64

• `Const` **SINT64**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT64 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT64: Schema<bigint, INT64>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:169](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L169)

___

### SINT8

• `Const` **SINT8**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the INT8 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SINT8: Schema<bigint, INT8>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SINT.js:124](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L124)

___

### SUINT128

• `Const` **SUINT128**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT128 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT128: Schema<bigint, UINT128>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:183](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L183)

___

### SUINT16

• `Const` **SUINT16**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT16 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT16: Schema<bigint, UINT16>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:141](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L141)

___

### SUINT256

• `Const` **SUINT256**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT256 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT256: Schema<bigint, UINT256>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:197](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L197)

___

### SUINT32

• `Const` **SUINT32**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT16 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT32: Schema<bigint, UINT32>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:155](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L155)

___

### SUINT64

• `Const` **SUINT64**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT64 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT64: Schema<bigint, UINT64>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:169](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L169)

___

### SUINT8

• `Const` **SUINT8**: `Schema`<`bigint`, `bigint`\>

[Effect schema](https://github.com/Effect-TS/schema) for the UINT8 type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SUINT8: Schema<bigint, UINT8>;
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:127](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L127)

___

### SUrl

• `Const` **SUrl**: `Schema`<`string`, `string`\>

[Effect schema](https://github.com/Effect-TS/schema) for the Url type.

**`Example`**

```javascript
import { Schema } from '@effect/schema/Schema';
export const SUrl: Schema<string, Url>;
```

#### Defined in

[schemas/src/SUrl.js:51](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUrl.js#L51)

___

### UINT128\_MAX

• `Const` **UINT128\_MAX**: `bigint`

The maximum value a [UINT128](modules.md#uint128) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:108](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L108)

___

### UINT16\_MAX

• `Const` **UINT16\_MAX**: `bigint`

The maximum value a [UINT16](modules.md#uint16) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:93](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L93)

___

### UINT256\_MAX

• `Const` **UINT256\_MAX**: `bigint`

The maximum value a [UINT256](modules.md#uint256) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:113](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L113)

___

### UINT32\_MAX

• `Const` **UINT32\_MAX**: `bigint`

The maximum value a [UINT32](modules.md#uint32) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:98](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L98)

___

### UINT64\_MAX

• `Const` **UINT64\_MAX**: `bigint`

The maximum value a [UINT64](modules.md#uint64) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:103](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L103)

___

### UINT8\_MAX

• `Const` **UINT8\_MAX**: `bigint`

The maximum value a [UINT8](modules.md#uint8) can be.
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#integers)

#### Defined in

[schemas/src/SUINT.js:88](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L88)

## Functions

### isAddress

▸ **isAddress**(`address`): address is \`0x${string}\`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

address is \`0x${string}\`

#### Defined in

node_modules/.pnpm/viem@1.14.0_typescript@5.2.2_zod@3.22.2/node_modules/viem/_types/utils/address/isAddress.d.ts:4

___

### isAddressBook

▸ **isAddressBook**<`TContractNames`\>(`addressBook`): addressBook is AddressBook<TContractNames\>

Type guard that returns true if an address book is a valid address

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContractNames` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `unknown` |

#### Returns

addressBook is AddressBook<TContractNames\>

#### Defined in

[schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/types.d.ts#L27)

___

### isBlockNumber

▸ **isBlockNumber**(`blockNumber`): `boolean`

Type guard that returns true if the provided number is a valid Ethereum block number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isBlockNumber } from '@evmts/schemas';
isBlockNumber('0x1234567890abcdef1234567890abcdef12345678');  // true
isBlockNumber('not a blockNumber'); // false
````

#### Defined in

[schemas/src/SBlockNumber.js:46](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SBlockNumber.js#L46)

___

### isHexString

▸ **isHexString**(`value`, `«destructured»?`): value is \`0x${string}\`

Type guard that returns true if a string is a valid hex string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `«destructured»` | `Object` |
| › `strict?` | `boolean` |

#### Returns

value is \`0x${string}\`

#### Defined in

node_modules/.pnpm/viem@1.14.0_typescript@5.2.2_zod@3.22.2/node_modules/viem/_types/utils/data/isHex.d.ts:4

___

### isINT128

▸ **isINT128**(`int128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT128.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int128` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT128 } from '@evmts/schemas';
isINT128(BigInt("-170141183460469231731687303715884105728"));  // true
isINT128(BigInt("170141183460469231731687303715884105727"));   // true
isINT128(BigInt("170141183460469231731687303715884105728"));   // false
isINT128(BigInt("-170141183460469231731687303715884105729"));  // false
````

#### Defined in

[schemas/src/SINT.js:285](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L285)

___

### isINT16

▸ **isINT16**(`int16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT16.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int16` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT16 } from '@evmts/schemas';
isINT16(BigInt(-32768));  // true
isINT16(BigInt(32767));   // true
isINT16(BigInt(32768));   // false
isINT16(BigInt(-32769));  // false
````

#### Defined in

[schemas/src/SINT.js:234](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L234)

___

### isINT256

▸ **isINT256**(`int256`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT256.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int256` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT256 } from '@evmts/schemas';
isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639936"));  // true
isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));   // true
isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639936"));   // false
isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639937"));  // false
````

#### Defined in

[schemas/src/SINT.js:302](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L302)

___

### isINT32

▸ **isINT32**(`int32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT32.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int32` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT32 } from '@evmts/schemas';
isINT32(BigInt(-2147483648));  // true
isINT32(BigInt(2147483647));   // true
isINT32(BigInt(2147483648));   // false
isINT32(BigInt(-2147483649));  // false
````

#### Defined in

[schemas/src/SINT.js:251](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L251)

___

### isINT64

▸ **isINT64**(`int64`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT64.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int64` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT64 } from '@evmts/schemas';
isINT64(BigInt("-9223372036854775808"));  // true
isINT64(BigInt("9223372036854775807"));   // true
isINT64(BigInt("9223372036854775808"));   // false
isINT64(BigInt("-9223372036854775809"));  // false
````

#### Defined in

[schemas/src/SINT.js:268](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L268)

___

### isINT8

▸ **isINT8**(`int8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT8.

#### Parameters

| Name | Type |
| :------ | :------ |
| `int8` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isINT8 } from '@evmts/schemas';
isINT8(BigInt(-128));  // true
isINT8(BigInt(127));   // true
isINT8(BigInt(128));   // false
isINT8(BigInt(-129));  // false
````

#### Defined in

[schemas/src/SINT.js:217](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L217)

___

### isUINT128

▸ **isUINT128**(`uint128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT128.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint128` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT128 } from '@evmts/schemas';
isUINT128(BigInt("170141183460469231731687303715884105727"));  // true
isUINT128(BigInt("340282366920938463463374607431768211456"));  // false
````

#### Defined in

[schemas/src/SUINT.js:269](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L269)

___

### isUINT16

▸ **isUINT16**(`uint16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT16.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint16` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT16 } from '@evmts/schemas';
isUINT16(BigInt(32767));  // true
isUINT16(BigInt(65536));  // false
````

#### Defined in

[schemas/src/SUINT.js:227](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L227)

___

### isUINT256

▸ **isUINT256**(`uint256`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT256.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint256` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT256 } from '@evmts/schemas';
isUINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));  // true
isUINT256(BigInt("231584178474632390847141970017375815706539969331281128078915168015826259279872"));  // false
````

#### Defined in

[schemas/src/SUINT.js:283](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L283)

___

### isUINT32

▸ **isUINT32**(`uint32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT32.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint32` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT32 } from '@evmts/schemas';
isUINT32(BigInt(2147483647));  // true
isUINT32(BigInt(4294967296));  // false
````

#### Defined in

[schemas/src/SUINT.js:241](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L241)

___

### isUINT64

▸ **isUINT64**(`uint64`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT64.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint64` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT64 } from '@evmts/schemas';
isUINT64(BigInt("9223372036854775807"));  // true
isUINT64(BigInt("18446744073709551616"));  // false
````

#### Defined in

[schemas/src/SUINT.js:255](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L255)

___

### isUINT8

▸ **isUINT8**(`uint8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT8.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint8` | `unknown` |

#### Returns

`boolean`

**`Example`**

```ts
import { isUINT8 } from '@evmts/schemas';
isUINT8(BigInt(127));  // true
isUINT8(BigInt(256));  // false
````

#### Defined in

[schemas/src/SUINT.js:213](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L213)

___

### isUrl

▸ **isUrl**(`value`): `boolean`

Type guard that returns true if the provided string is a valid URL.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

**`Example`**

```javascript
import { isUrl } from '@evmts/schemas';
isUrl('https://evmts.dev');  // true
isUrl('not a url'); // false
````

#### Defined in

[schemas/src/SUrl.js:33](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUrl.js#L33)

___

### parseAddress

▸ **parseAddress**<`TAddress`\>(`address`): `TAddress`

Parses an Address returning the address or throwing an InvalidAddressError if invalid.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TAddress` | extends Address |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `TAddress` | The address to parse. |

#### Returns

`TAddress`

- The parsed address.

**`Throws`**

- If the address is invalid.

#### Defined in

[schemas/src/SAddress.js:84](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L84)

___

### parseAddressBook

▸ **parseAddressBook**<`TAddressBook`\>(`addressBook`): `TAddressBook`

Parses an address book and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TAddressBook` | extends AddressBook<string> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `TAddressBook` |

#### Returns

`TAddressBook`

**`Example`**

```typescript
import {parseAddressBook} from '@evmts/schemas'
const parsedAddressBook = parseAddressBook({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[schemas/src/SAddressBook.js:121](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddressBook.js#L121)

___

### parseAddressBookSafe

▸ **parseAddressBookSafe**<`TAddressBook`\>(`addressBook`): `Effect`<`never`, [`InvalidAddressBookError`](classes/InvalidAddressBookError.md), `TAddressBook`\>

Safely parses an address book into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TAddressBook` | extends AddressBook<string> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `TAddressBook` |

#### Returns

`Effect`<`never`, [`InvalidAddressBookError`](classes/InvalidAddressBookError.md), `TAddressBook`\>

**`Example`**

```typescript
import {parseAddressBookSafe} from '@evmts/schemas'
const parsedAddressBookEffect = parseAddressBookSafe({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[schemas/src/SAddressBook.js:90](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddressBook.js#L90)

___

### parseAddressSafe

▸ **parseAddressSafe**<`TAddress`\>(`address`): `Effect`<`never`, [`InvalidAddressError`](classes/InvalidAddressError.md), `TAddress`\>

Parses an Address safely into an effect.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TAddress` | extends Address |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `TAddress` | The address to parse. |

#### Returns

`Effect`<`never`, [`InvalidAddressError`](classes/InvalidAddressError.md), `TAddress`\>

- An effect that resolves to the parsed address.

#### Defined in

[schemas/src/SAddress.js:65](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SAddress.js#L65)

___

### parseBlockNumber

▸ **parseBlockNumber**<`TBlockNumber`\>(`blockNumber`): `TBlockNumber`

Parses a BlockNumber and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TBlockNumber` | extends BlockNumber |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `TBlockNumber` |

#### Returns

`TBlockNumber`

**`Example`**

```ts
import { parseBlockNumber } from '@evmts/schemas';
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SBlockNumber.js:109](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SBlockNumber.js#L109)

___

### parseBlockNumberSafe

▸ **parseBlockNumberSafe**<`TBlockNumber`\>(`blockNumber`): `Effect`<`never`, [`InvalidBlockNumberError`](classes/InvalidBlockNumberError.md), `TBlockNumber`\>

Safely parses a BlockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TBlockNumber` | extends BlockNumber |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `TBlockNumber` |

#### Returns

`Effect`<`never`, [`InvalidBlockNumberError`](classes/InvalidBlockNumberError.md), `TBlockNumber`\>

**`Example`**

```ts
import { parseBlockNumberSafe } from '@evmts/schemas';
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SBlockNumber.js:84](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SBlockNumber.js#L84)

___

### parseHexString

▸ **parseHexString**<`THexString`\>(`hex`): `THexString`

Parses a HexString and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `THexString` | extends HexString |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `THexString` |

#### Returns

`THexString`

**`Example`**

```javascript
import { parseHexString } from '@evmts/schemas';
const parsedHexString = parseHexString('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SHexString.js:104](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SHexString.js#L104)

___

### parseHexStringSafe

▸ **parseHexStringSafe**<`THexString`\>(`value`): `Effect`<`never`, [`InvalidHexStringError`](classes/InvalidHexStringError.md), `THexString`\>

Safely parses a HexString into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `THexString` | extends HexString |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `THexString` |

#### Returns

`Effect`<`never`, [`InvalidHexStringError`](classes/InvalidHexStringError.md), `THexString`\>

**`Example`**

```javascript
import { parseHexStringSafe } from '@evmts/schemas';
const parsedHexStringEffect = parseHexStringSafe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SHexString.js:80](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SHexString.js#L80)

___

### parseINT128Safe

▸ **parseINT128Safe**<`TINT128`\>(`int128`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT128`\>

Safely parses an INT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT128` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int128` | `TINT128` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT128`\>

#### Defined in

[schemas/src/SINT.js:451](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L451)

___

### parseINT16Safe

▸ **parseINT16Safe**<`TINT16`\>(`int16`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT16`\>

Safely parses an INT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT16` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int16` | `TINT16` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT16`\>

#### Defined in

[schemas/src/SINT.js:379](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L379)

___

### parseINT256Safe

▸ **parseINT256Safe**<`TINT256`\>(`int256`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT256`\>

Safely parses an INT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT256` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int256` | `TINT256` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT256`\>

#### Defined in

[schemas/src/SINT.js:475](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L475)

___

### parseINT32Safe

▸ **parseINT32Safe**<`TINT32`\>(`int32`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT32`\>

Safely parses an INT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT32` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int32` | `TINT32` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT32`\>

#### Defined in

[schemas/src/SINT.js:403](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L403)

___

### parseINT64Safe

▸ **parseINT64Safe**<`TINT64`\>(`int64`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT64`\>

Safely parses an INT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT64` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int64` | `TINT64` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT64`\>

#### Defined in

[schemas/src/SINT.js:427](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L427)

___

### parseINT8Safe

▸ **parseINT8Safe**<`TINT8`\>(`int8`): `Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT8`\>

Safely parses an INT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT8` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int8` | `TINT8` |

#### Returns

`Effect`<`never`, [`InvalidINTError`](classes/InvalidINTError.md), `TINT8`\>

#### Defined in

[schemas/src/SINT.js:355](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L355)

___

### parseInt128

▸ **parseInt128**<`TINT128`\>(`int128`): `TINT128`

Parses an INT128 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT128` | extends INT128 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int128` | `TINT128` |

#### Returns

`TINT128`

**`Example`**

```ts
import { parseInt128 } from '@evmts/schemas';
const parsedINT128 = parseInt128(BigInt("-170141183460469231731687303715884105728"));
```

#### Defined in

[schemas/src/SINT.js:564](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L564)

___

### parseInt16

▸ **parseInt16**<`TINT16`\>(`int16`): `TINT16`

Parses an INT16 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT16` | extends INT16 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int16` | `TINT16` |

#### Returns

`TINT16`

**`Example`**

```ts
import { parseInt16 } from '@evmts/schemas';
const parsedINT16 = parseInt16(BigInt(-32768));
```

#### Defined in

[schemas/src/SINT.js:519](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L519)

___

### parseInt256

▸ **parseInt256**<`TINT256`\>(`int256`): `TINT256`

Parses an INT256 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT256` | extends INT256 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int256` | `TINT256` |

#### Returns

`TINT256`

**`Example`**

```ts
import { parseInt256 } from '@evmts/schemas';
const parsedINT256 = parseInt256('-0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SINT.js:579](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L579)

___

### parseInt32

▸ **parseInt32**<`TINT32`\>(`int32`): `TINT32`

Parses an INT32 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT32` | extends INT32 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int32` | `TINT32` |

#### Returns

`TINT32`

**`Example`**

```ts
import { parseInt32 } from '@evmts/schemas';
const parsedINT32 = parseInt32(BigInt(-2147483648));
```

#### Defined in

[schemas/src/SINT.js:534](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L534)

___

### parseInt64

▸ **parseInt64**<`TINT64`\>(`int64`): `TINT64`

Parses an INT64 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT64` | extends INT64 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int64` | `TINT64` |

#### Returns

`TINT64`

**`Example`**

```ts
import { parseInt64 } from '@evmts/schemas';
const parsedINT64 = parseInt64(BigInt("-9223372036854775808"));
```

#### Defined in

[schemas/src/SINT.js:549](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L549)

___

### parseInt8

▸ **parseInt8**<`TINT8`\>(`int8`): `TINT8`

Parses an INT8 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TINT8` | extends INT8 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `int8` | `TINT8` |

#### Returns

`TINT8`

**`Example`**

```ts
import { parseInt8 } from '@evmts/schemas';
const parsedINT8 = parseInt8(BigInt(-128));
```

#### Defined in

[schemas/src/SINT.js:504](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SINT.js#L504)

___

### parseUINT128

▸ **parseUINT128**<`TUINT128`\>(`uint128`): `TUINT128`

Parses a UINT128 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT128` | extends UINT128 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint128` | `TUINT128` |

#### Returns

`TUINT128`

**`Example`**

```ts
import { parseUINT128 } from '@evmts/schemas';
const parsedUINT128 = parseUINT128(BigInt("170141183460469231731687303715884105727"));
```

#### Defined in

[schemas/src/SUINT.js:533](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L533)

___

### parseUINT128Safe

▸ **parseUINT128Safe**<`TUINT128`\>(`uint128`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT128`\>

Safely parses a UINT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT128` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint128` | `TUINT128` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT128`\>

#### Defined in

[schemas/src/SUINT.js:420](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L420)

___

### parseUINT16

▸ **parseUINT16**<`TUINT16`\>(`uint16`): `TUINT16`

Parses a UINT16 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT16` | extends UINT16 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint16` | `TUINT16` |

#### Returns

`TUINT16`

**`Example`**

```ts
import { parseUINT16 } from '@evmts/schemas';
const parsedUINT16 = parseUINT16(BigInt(32767));
```

#### Defined in

[schemas/src/SUINT.js:491](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L491)

___

### parseUINT16Safe

▸ **parseUINT16Safe**<`TUINT16`\>(`uint16`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT16`\>

Safely parses a UINT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT16` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint16` | `TUINT16` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT16`\>

#### Defined in

[schemas/src/SUINT.js:349](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L349)

___

### parseUINT256

▸ **parseUINT256**<`TUINT256`\>(`uint256`): `TUINT256`

Parses a UINT256 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT256` | extends UINT256 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint256` | `TUINT256` |

#### Returns

`TUINT256`

**`Example`**

```ts
import { parseUINT256 } from '@evmts/schemas';
const parsedUINT256 = parseUINT256('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SUINT.js:547](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L547)

___

### parseUINT256Safe

▸ **parseUINT256Safe**<`TUINT256`\>(`uint256`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT256`\>

Safely parses a UINT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT256` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint256` | `TUINT256` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT256`\>

**`Example`**

```ts
import { parseUINT256Safe } from '@evmts/schemas';
const parsedUINT256Effect = parseUINT256Safe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[schemas/src/SUINT.js:448](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L448)

___

### parseUINT32

▸ **parseUINT32**<`TUINT32`\>(`uint32`): `TUINT32`

Parses a UINT32 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT32` | extends UINT32 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint32` | `TUINT32` |

#### Returns

`TUINT32`

**`Example`**

```ts
import { parseUINT32 } from '@evmts/schemas';
const parsedUINT32 = parseUINT32(BigInt(2147483647));
```

#### Defined in

[schemas/src/SUINT.js:505](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L505)

___

### parseUINT32Safe

▸ **parseUINT32Safe**<`TUINT32`\>(`uint32`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT32`\>

Safely parses a UINT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT32` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint32` | `TUINT32` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT32`\>

#### Defined in

[schemas/src/SUINT.js:372](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L372)

___

### parseUINT64

▸ **parseUINT64**<`TUINT64`\>(`uint64`): `TUINT64`

Parses a UINT64 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT64` | extends UINT64 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint64` | `TUINT64` |

#### Returns

`TUINT64`

**`Example`**

```ts
import { parseUINT64 } from '@evmts/schemas';
const parsedUINT64 = parseUINT64(BigInt("9223372036854775807"));
```

#### Defined in

[schemas/src/SUINT.js:519](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L519)

___

### parseUINT64Safe

▸ **parseUINT64Safe**<`TUINT64`\>(`uint64`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT64`\>

Safely parses a UINT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT64` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint64` | `TUINT64` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT64`\>

#### Defined in

[schemas/src/SUINT.js:397](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L397)

___

### parseUINT8

▸ **parseUINT8**<`TUINT8`\>(`uint8`): `TUINT8`

Parses a UINT8 and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT8` | extends UINT8 |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint8` | `TUINT8` |

#### Returns

`TUINT8`

**`Example`**

```ts
import { parseUINT8 } from '@evmts/schemas';
const parsedUINT8 = parseUINT8(BigInt(127));
```

#### Defined in

[schemas/src/SUINT.js:477](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L477)

___

### parseUINT8Safe

▸ **parseUINT8Safe**<`TUINT8`\>(`uint8`): `Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT8`\>

Safely parses a UINT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUINT8` | extends bigint |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint8` | `TUINT8` |

#### Returns

`Effect`<`never`, [`InvalidUINTError`](classes/InvalidUINTError.md), `TUINT8`\>

#### Defined in

[schemas/src/SUINT.js:326](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L326)

___

### parseUrl

▸ **parseUrl**<`TUrl`\>(`url`): `TUrl`

Parses a Url and returns the value if no errors.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUrl` | extends Url |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `TUrl` |

#### Returns

`TUrl`

**`Example`**

```javascript
import { parseUrl } from '@evmts/schemas';
const parsedUrl = parseUrl('https://evmts.dev');
```

#### Defined in

[schemas/src/SUrl.js:113](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUrl.js#L113)

___

### parseUrlSafe

▸ **parseUrlSafe**<`TUrl`\>(`url`): `Effect`<`never`, [`InvalidUrlError`](classes/InvalidUrlError.md), `TUrl`\>

Safely parses a Url into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `TUrl` | extends Url |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `TUrl` |

#### Returns

`Effect`<`never`, [`InvalidUrlError`](classes/InvalidUrlError.md), `TUrl`\>

**`Example`**

```javascript
import { parseUrlSafe } from '@evmts/schemas';
const parsedUrlEffect = parseUrlSafe('https://evmts.dev');
```

#### Defined in

[schemas/src/SUrl.js:91](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUrl.js#L91)
