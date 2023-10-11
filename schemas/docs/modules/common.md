[@evmts/schemas](../README.md) / [Modules](../modules.md) / common

# Module: common

## Table of contents

### Classes

- [InvalidBlockNumberError](../classes/common.InvalidBlockNumberError.md)
- [InvalidHexStringError](../classes/common.InvalidHexStringError.md)
- [InvalidUrlError](../classes/common.InvalidUrlError.md)

### Type Aliases

- [BlockNumber](common.md#blocknumber)
- [HexString](common.md#hexstring)
- [Url](common.md#url)

### Variables

- [SBlockNumber](common.md#sblocknumber)
- [SHexString](common.md#shexstring)
- [SUrl](common.md#surl)

### Functions

- [isBlockNumber](common.md#isblocknumber)
- [isHexString](common.md#ishexstring)
- [isUrl](common.md#isurl)
- [parseBlockNumber](common.md#parseblocknumber)
- [parseBlockNumberSafe](common.md#parseblocknumbersafe)
- [parseHexString](common.md#parsehexstring)
- [parseHexStringSafe](common.md#parsehexstringsafe)
- [parseUrl](common.md#parseurl)
- [parseUrlSafe](common.md#parseurlsafe)

## Type Aliases

### BlockNumber

Ƭ **BlockNumber**<\>: `number`

#### Defined in

schemas/src/common/SBlockNumber.js:16

___

### HexString

Ƭ **HexString**<\>: `string`

#### Defined in

schemas/src/common/SHexString.js:14

___

### Url

Ƭ **Url**<\>: `string`

#### Defined in

schemas/src/common/SUrl.js:14

## Variables

### SBlockNumber

• `Const` **SBlockNumber**: `Schema`<`number`, `number`\>

[Effect schema](https://github.com/Effect-TS/schema) for the BlockNumber type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SBlockNumber: Schema<number, BlockNumber>;
```

#### Defined in

schemas/src/common/SBlockNumber.js:33

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

schemas/src/common/SHexString.js:31

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

schemas/src/common/SUrl.js:51

## Functions

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

schemas/src/common/SBlockNumber.js:46

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

schemas/src/common/SUrl.js:33

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

schemas/src/common/SBlockNumber.js:109

___

### parseBlockNumberSafe

▸ **parseBlockNumberSafe**<`TBlockNumber`\>(`blockNumber`): `Effect`<`never`, [`InvalidBlockNumberError`](../classes/common.InvalidBlockNumberError.md), `TBlockNumber`\>

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

`Effect`<`never`, [`InvalidBlockNumberError`](../classes/common.InvalidBlockNumberError.md), `TBlockNumber`\>

**`Example`**

```ts
import { parseBlockNumberSafe } from '@evmts/schemas';
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

schemas/src/common/SBlockNumber.js:84

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

schemas/src/common/SHexString.js:104

___

### parseHexStringSafe

▸ **parseHexStringSafe**<`THexString`\>(`value`): `Effect`<`never`, [`InvalidHexStringError`](../classes/common.InvalidHexStringError.md), `THexString`\>

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

`Effect`<`never`, [`InvalidHexStringError`](../classes/common.InvalidHexStringError.md), `THexString`\>

**`Example`**

```javascript
import { parseHexStringSafe } from '@evmts/schemas';
const parsedHexStringEffect = parseHexStringSafe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

schemas/src/common/SHexString.js:80

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

schemas/src/common/SUrl.js:113

___

### parseUrlSafe

▸ **parseUrlSafe**<`TUrl`\>(`url`): `Effect`<`never`, [`InvalidUrlError`](../classes/common.InvalidUrlError.md), `TUrl`\>

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

`Effect`<`never`, [`InvalidUrlError`](../classes/common.InvalidUrlError.md), `TUrl`\>

**`Example`**

```javascript
import { parseUrlSafe } from '@evmts/schemas';
const parsedUrlEffect = parseUrlSafe('https://evmts.dev');
```

#### Defined in

schemas/src/common/SUrl.js:91
