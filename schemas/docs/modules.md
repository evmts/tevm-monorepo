[@evmts/schemas](README.md) / Exports

# @evmts/schemas

## Table of contents

### Classes

- [InvalidAddressBookError](classes/InvalidAddressBookError.md)
- [InvalidAddressError](classes/InvalidAddressError.md)
- [InvalidBlockNumberError](classes/InvalidBlockNumberError.md)
- [InvalidHexStringError](classes/InvalidHexStringError.md)
- [InvalidUrlError](classes/InvalidUrlError.md)

### Interfaces

- [AddressBookEntry](interfaces/AddressBookEntry.md)
- [SchemaOptions](interfaces/SchemaOptions.md)

### Type Aliases

- [Address](modules.md#address)
- [AddressBook](modules.md#addressbook)
- [BlockNumber](modules.md#blocknumber)
- [HexString](modules.md#hexstring)
- [IsAddressBook](modules.md#isaddressbook)
- [SAddress](modules.md#saddress)
- [SAddressSchema](modules.md#saddressschema)
- [Url](modules.md#url)

### Variables

- [SAddress](modules.md#saddress-1)
- [SAddressBook](modules.md#saddressbook)
- [SBlockNumber](modules.md#sblocknumber)
- [SHexString](modules.md#shexstring)
- [SUrl](modules.md#surl)

### Functions

- [isAddress](modules.md#isaddress)
- [isAddressBook](modules.md#isaddressbook-1)
- [isBlockNumber](modules.md#isblocknumber)
- [isHexString](modules.md#ishexstring)
- [isUrl](modules.md#isurl)
- [parseAddress](modules.md#parseaddress)
- [parseAddressBook](modules.md#parseaddressbook)
- [parseAddressBookSafe](modules.md#parseaddressbooksafe)
- [parseAddressSafe](modules.md#parseaddresssafe)
- [parseBlockNumber](modules.md#parseblocknumber)
- [parseBlockNumberSafe](modules.md#parseblocknumbersafe)
- [parseHexString](modules.md#parsehexstring)
- [parseHexStringSafe](modules.md#parsehexstringsafe)
- [parseUrl](modules.md#parseurl)
- [parseUrlSafe](modules.md#parseurlsafe)

## Type Aliases

### Address

Ƭ **Address**<\>: \`0x${string}\`

Type representing a valid Ethereum address

#### Defined in

[schemas/src/SAddress.js:11](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L11)

___

### AddressBook

Ƭ **AddressBook**<\>: `__module`

#### Defined in

[schemas/src/SAddressBook.js:26](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddressBook.js#L26)

___

### BlockNumber

Ƭ **BlockNumber**<\>: `number`

#### Defined in

[schemas/src/SBlockNumber.js:16](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SBlockNumber.js#L16)

___

### HexString

Ƭ **HexString**<\>: `string`

#### Defined in

[schemas/src/SHexString.js:14](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SHexString.js#L14)

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

[schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/types.d.ts#L27)

___

### SAddress

Ƭ **SAddress**<\>: [`SAddressSchema`](modules.md#saddressschema)

Effect/schema for Address type.

#### Defined in

[schemas/src/SAddress.js:26](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L26)

[schemas/src/SAddress.js:24](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L24)

___

### SAddressSchema

Ƭ **SAddressSchema**<\>: `Schema`

#### Defined in

[schemas/src/SAddress.js:20](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L20)

___

### Url

Ƭ **Url**<\>: `string`

#### Defined in

[schemas/src/SUrl.js:14](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SUrl.js#L14)

## Variables

### SAddress

• `Const` **SAddress**: `Schema`<`string`, \`0x${string}\`\>

#### Defined in

[schemas/src/SAddress.js:26](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L26)

[schemas/src/SAddress.js:24](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L24)

___

### SAddressBook

• `Const` **SAddressBook**: `Schema`<`__module`, `__module`\>

[Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type.

#### Defined in

[schemas/src/SAddressBook.js:46](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddressBook.js#L46)

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

[schemas/src/SBlockNumber.js:33](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SBlockNumber.js#L33)

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

[schemas/src/SHexString.js:31](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SHexString.js#L31)

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

[schemas/src/SUrl.js:51](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SUrl.js#L51)

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

[schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/types.d.ts#L27)

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

[schemas/src/SBlockNumber.js:46](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SBlockNumber.js#L46)

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

[schemas/src/SUrl.js:33](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SUrl.js#L33)

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

[schemas/src/SAddress.js:84](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L84)

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

[schemas/src/SAddressBook.js:121](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddressBook.js#L121)

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

[schemas/src/SAddressBook.js:90](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddressBook.js#L90)

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

[schemas/src/SAddress.js:65](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L65)

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

[schemas/src/SBlockNumber.js:109](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SBlockNumber.js#L109)

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

[schemas/src/SBlockNumber.js:84](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SBlockNumber.js#L84)

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

[schemas/src/SHexString.js:104](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SHexString.js#L104)

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

[schemas/src/SHexString.js:80](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SHexString.js#L80)

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

[schemas/src/SUrl.js:113](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SUrl.js#L113)

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

[schemas/src/SUrl.js:91](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SUrl.js#L91)
