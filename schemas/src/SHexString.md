# HexString Schema

Types and validators for SHexString

## HexString

Type representing a valid hex

### Import

```typescript
import {type HexString} from '@evmts/schemas'
```

### Example

```typescript
import {HexString} from '@evmts/schemas'
export const hex = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies HexString  // [!code focus:2]
```

## SHexString

[Effect schema](https://github.com/Effect-TS/schema) for the HexString type

### Typescript Type

```typescript
import {Schema} from '@effect/schema/Schema'
export const SHexString: Schema<string, HexString>
```

## isHexString

Type guard that returns true if an hex is a valid hex

### Import

```typescript
import {isHexString} from '@evmts/schema'
```

### Example

```typescript
import {isHexString} from '@evmts/schemas'
isHexString('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
isHexString('not an hex') // false // [!code focus:2]
```

### Returns

`boolean`

Whether or not the hex is valid.

### Parameters

##### hex

- Type: `string`

An hex to be validated.

## parseHexStringSafe

Safely parses an hex into an [Effect](https://www.effect.website/docs/essentials/effect-type)

### Import

```typescript
import {parseHexStringSafe} from '@evmts/schema'
```

### Example

```typescript
import {parseHexStringSafe} from '@evmts/schemas'
const parsedHexStringEffect = parseHexStringSafe('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`Effect<never, InvalidHexStringError, HexString>`

HexString Effect with `InvalidHexStringError` if invalid

### Parameters

#### hex

- Type: `string`

An hex to be validated.

## parseHexString

Parses an hex and returns the value if no errors

### Import

```typescript
import {parseHexString} from '@evmts/schema'
```

### Example

```typescript
import {parseHexString} from '@evmts/schemas'
const parsedHexString = parseHexString('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`HexString`

Value typecast to HexString if valid

### Throws

- `InvalidHexStringError` if hex is not valid

### Parameters

#### hex

- Type: `string`

An hex to be validated.

