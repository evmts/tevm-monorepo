# Address Schema

Types and validators for SAddress

## Address

Type representing a valid Ethereum address

### Import

```typescript
import {type Address} from '@evmts/schemas'
```

### Example

```typescript
import {Address} from '@evmts/schemas'
export const address = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies Address  // [!code focus:2]
```

## SAddress

[Effect schema](https://github.com/Effect-TS/schema) for the Address type

### Typescript Type

```typescript
import {Schema} from '@effect/schema/Schema'
export const SAddress: Schema<string, Address>
```

## isAddress

Type guard that returns true if an address is a valid address

### Import

```typescript
import {isAddress} from '@evmts/schema'
```

### Example

```typescript
import {isAddress} from '@evmts/schemas'
isAddress('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
isAddress('not an address') // false // [!code focus:2]
```

### Returns

`boolean`

Whether or not the address is valid and will typeguard the address

### Parameters

##### address

- Type: `string`

An Ethereum address to be validated.

## parseAddressSafe

Safely parses an address into an [Effect](https://www.effect.website/docs/essentials/effect-type)

### Import

```typescript
import {parseAddressSafe} from '@evmts/schema'
```

### Example

```typescript
import {parseAddressSafe} from '@evmts/schemas'
const parsedAddressEffect = parseAddressSafe('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`Effect<never, InvalidAddressError, Address>`

Address Effect with `InvalidAddressError` if invalid

### Parameters

#### address

- Type: `string`

An Ethereum address to be validated.

## parseAddress

Parses an address and returns the value if no errors

### Import

```typescript
import {parseAddress} from '@evmts/schema'
```

### Example

```typescript
import {parseAddress} from '@evmts/schemas'
const parsedAddress = parseAddress('0x1234567890abcdef1234567890abcdef12345678') // true // [!code focus:2]
```

### Returns

`Address`

Value typecast to Address if valid

### Throws

- `InvalidAddressError` if address is not valid

### Parameters

#### address

- Type: `string`

An Ethereum address to be validated.

