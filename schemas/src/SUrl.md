# Url Schema

Types and validators for SUrl

## Url

Type representing a valid url

### Import

```typescript
import {type Url} from '@evmts/schemas'
```

### Example

```typescript
import {Url} from '@evmts/schemas'
export const url = 'https://evmts.dev' as const satisfies Url  // [!code focus:2]
```

## SUrl

[Effect schema](https://github.com/Effect-TS/schema) for the Url type

### Typescript Type

```typescript
import {Schema} from '@effect/schema/Schema'
export const SUrl: Schema<string, Url>
```

## isUrl

Type guard that returns true if an url is a valid url

### Import

```typescript
import {isUrl} from '@evmts/schema'
```

### Example

```typescript
import {isUrl} from '@evmts/schemas'
isUrl('https://evmts.dev') // true // [!code focus:2]
isUrl('not an url') // false // [!code focus:2]
```

### Returns

`boolean`

Whether or not the url is valid.

### Parameters

##### url

- Type: `string`

An url to be validated.

## parseUrlSafe

Safely parses an url into an [Effect](https://www.effect.website/docs/essentials/effect-type)

### Import

```typescript
import {parseUrlSafe} from '@evmts/schema'
```

### Example

```typescript
import {parseUrlSafe} from '@evmts/schemas'
const parsedUrlEffect = parseUrlSafe('https://evmts.dev') // true // [!code focus:2]
```

### Returns

`Effect<never, InvalidUrlError, Url>`

Url Effect with `InvalidUrlError` if invalid

### Parameters

#### url

- Type: `string`

An url to be validated.

## parseUrl

Parses an url and returns the value if no errors

### Import

```typescript
import {parseUrl} from '@evmts/schema'
```

### Example

```typescript
import {parseUrl} from '@evmts/schemas'
const parsedUrl = parseUrl('https://evmts.dev') // true // [!code focus:2]
```

### Returns

`Url`

Value typecast to Url if valid

### Throws

- `InvalidUrlError` if url is not valid

### Parameters

#### url

- Type: `string`

An url to be validated.

