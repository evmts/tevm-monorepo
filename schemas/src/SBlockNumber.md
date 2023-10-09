# BlockNumber Schema

Types and validators for SBlockNumber

## BlockNumber

Type representing a valid BlockNumber. A valid BlockNumber is a `number` >= 0

### Import

```typescript
import {type BlockNumber} from '@evmts/schemas'
```

### Example

```typescript
import {BlockNumber} from '@evmts/schemas'
export const blockNumber = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies BlockNumber  // [!code focus:2]
```

## SBlockNumber

[Effect schema](https://github.com/Effect-TS/schema) for the BlockNumber type

### Typescript Type

```typescript
import {Schema} from '@effect/schema/Schema'
export const SBlockNumber: Schema<number, BlockNumber>
```

## isBlockNumber

Type guard that returns true if an blockNumber is a valid blockNumber

### Import

```typescript
import {isBlockNumber} from '@evmts/schema'
```

### Example

```typescript
import {isBlockNumber} from '@evmts/schemas'
isBlockNumber('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
isBlockNumber('not an blockNumber') // false // [!code focus:2]
```

### Returns

`boolean`

Whether or not the blockNumber is valid.

### Parameters

##### blockNumber

- Type: `number`

An blockNumber to be validated.

## parseBlockNumberSafe

Safely parses an blockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type)

### Import

```typescript
import {parseBlockNumberSafe} from '@evmts/schema'
```

### Example

```typescript
import {parseBlockNumberSafe} from '@evmts/schemas'
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`Effect<never, InvalidBlockNumberError, BlockNumber>`

BlockNumber Effect with `InvalidBlockNumberError` if invalid

### Parameters

#### blockNumber

- Type: `number`

An Ethereum blockNumber to be validated.

## parseBlockNumber

Parses an blockNumber and returns the value if no errors

### Import

```typescript
import {parseBlockNumber} from '@evmts/schema'
```

### Example

```typescript
import {parseBlockNumber} from '@evmts/schemas'
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`BlockNumber`

Value typecast to BlockNumber if valid

### Throws

- `InvalidBlockNumberError` if blockNumber is not valid

### Parameters

#### blockNumber

- Type: `number`

An Ethereum blockNumber to be validated.

