[@tevm/schemas](../README.md) / [Modules](../modules.md) / common

# Module: common

## Table of contents

### Classes

- [InvalidBlockNumberError](../classes/common.InvalidBlockNumberError.md)
- [InvalidUrlError](../classes/common.InvalidUrlError.md)

### Type Aliases

- [BlockNumber](common.md#blocknumber)
- [Url](common.md#url)

### Variables

- [SBlockNumber](common.md#sblocknumber)
- [SUrl](common.md#surl)

### Functions

- [isBlockNumber](common.md#isblocknumber)
- [isUrl](common.md#isurl)
- [parseBlockNumber](common.md#parseblocknumber)
- [parseBlockNumberSafe](common.md#parseblocknumbersafe)
- [parseUrl](common.md#parseurl)
- [parseUrlSafe](common.md#parseurlsafe)

## Type Aliases

### BlockNumber

Ƭ **BlockNumber**\<\>: `number`

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L16)

___

### Url

Ƭ **Url**\<\>: `string`

#### Defined in

[packages/schemas/src/common/SUrl.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L14)

## Variables

### SBlockNumber

• `Const` **SBlockNumber**: `Schema`\<`number`, `number`\>

[Effect schema](https://github.com/Effect-TS/schema) for the BlockNumber type.

**`Example`**

```typescript
import { Schema } from '@effect/schema/Schema';
export const SBlockNumber: Schema<number, BlockNumber>;
```

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L33)

___

### SUrl

• `Const` **SUrl**: `Schema`\<`string`, `string`\>

[Effect schema](https://github.com/Effect-TS/schema) for the Url type.

**`Example`**

```javascript
import { Schema } from '@effect/schema/Schema';
export const SUrl: Schema<string, Url>;
```

#### Defined in

[packages/schemas/src/common/SUrl.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L51)

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
import { isBlockNumber } from '@tevm/schemas';
isBlockNumber('0x1234567890abcdef1234567890abcdef12345678');  // true
isBlockNumber('not a blockNumber'); // false
````

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L46)

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
import { isUrl } from '@tevm/schemas';
isUrl('https://tevm.dev');  // true
isUrl('not a url'); // false
````

#### Defined in

[packages/schemas/src/common/SUrl.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L33)

___

### parseBlockNumber

▸ **parseBlockNumber**\<`TBlockNumber`\>(`blockNumber`): `TBlockNumber`

Parses a BlockNumber and returns the value if no errors.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TBlockNumber` | extends `number` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `TBlockNumber` |

#### Returns

`TBlockNumber`

**`Example`**

```ts
import { parseBlockNumber } from '@tevm/schemas';
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L109)

___

### parseBlockNumberSafe

▸ **parseBlockNumberSafe**\<`TBlockNumber`\>(`blockNumber`): `Effect`\<`never`, [`InvalidBlockNumberError`](../classes/common.InvalidBlockNumberError.md), `TBlockNumber`\>

Safely parses a BlockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TBlockNumber` | extends `number` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `TBlockNumber` |

#### Returns

`Effect`\<`never`, [`InvalidBlockNumberError`](../classes/common.InvalidBlockNumberError.md), `TBlockNumber`\>

**`Example`**

```ts
import { parseBlockNumberSafe } from '@tevm/schemas';
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
```

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L84)

___

### parseUrl

▸ **parseUrl**\<`TUrl`\>(`url`): `TUrl`

Parses a Url and returns the value if no errors.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TUrl` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `TUrl` |

#### Returns

`TUrl`

**`Example`**

```javascript
import { parseUrl } from '@tevm/schemas';
const parsedUrl = parseUrl('https://tevm.dev');
```

#### Defined in

[packages/schemas/src/common/SUrl.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L113)

___

### parseUrlSafe

▸ **parseUrlSafe**\<`TUrl`\>(`url`): `Effect`\<`never`, [`InvalidUrlError`](../classes/common.InvalidUrlError.md), `TUrl`\>

Safely parses a Url into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TUrl` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `TUrl` |

#### Returns

`Effect`\<`never`, [`InvalidUrlError`](../classes/common.InvalidUrlError.md), `TUrl`\>

**`Example`**

```javascript
import { parseUrlSafe } from '@tevm/schemas';
const parsedUrlEffect = parseUrlSafe('https://tevm.dev');
```

#### Defined in

[packages/schemas/src/common/SUrl.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SUrl.js#L91)
