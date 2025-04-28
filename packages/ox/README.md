# @tevm/ox

Effect.ts wrapper for the Ox Ethereum Standard Library. This library provides Effect-based versions of all Ox utility functions, allowing you to leverage the power of Effect.ts for better error handling, dependency management, and composition.

## Installation

```bash
npm install @tevm/ox
```

## Features

- Type-safe wrappers for Ox modules using Effect.ts
- Comprehensive error handling with Effect for better debugging
- Dependency injection with Effect Context and Layers
- Composable workflows with Effect combinators
- Full access to Ox's Ethereum utilities

## Usage

### Basic example

```typescript
import { Effect, pipe } from 'effect'
import { HexEffectTag, OxEffectLayer } from '@tevm/ox'

const program = pipe(
  // Use Hex service via dependency injection
  Effect.flatMap(HexEffectTag, (hex) => 
    hex.fromStringEffect('Hello World!')
  ),
  // Convert the hex to a number
  Effect.flatMap((hexValue) => 
    Effect.flatMap(HexEffectTag, (hex) => 
      hex.toNumberEffect(hexValue)
    )
  ),
  // Provide all services
  Effect.provide(OxEffectLayer)
)

// Run the program
Effect.runSync(program) 
// This will throw an error because "Hello World!" doesn't convert to a valid number

// With proper error handling
Effect.runPromise(
  pipe(
    program,
    Effect.catchAll(error => 
      Effect.succeed(`Error occurred: ${error.shortMessage}`)
    )
  )
)
// => "Error occurred: [error message from Ox]"
```

### Working with addresses

```typescript
import { Effect, pipe } from 'effect'
import { AddressEffectTag, OxEffectLayer } from '@tevm/ox'

const program = pipe(
  // Validate an Ethereum address
  Effect.flatMap(AddressEffectTag, (address) => 
    address.validateEffect('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  ),
  // Log validation result
  Effect.tap((isValid) => 
    Effect.log(`Is valid address: ${isValid}`)
  ),
  // Convert to checksum address
  Effect.flatMap(() => 
    Effect.flatMap(AddressEffectTag, (address) =>
      address.fromStringEffect('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    )
  ),
  // Format the address
  Effect.flatMap((addr) => 
    Effect.flatMap(AddressEffectTag, (address) =>
      address.formatEffect(addr, { case: 'uppercase' })
    )
  ),
  // Provide services
  Effect.provide(OxEffectLayer)
)

Effect.runPromise(program).then(console.log)
// => "0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045"
```

### Error handling

All Effect wrappers properly catch and convert Ox errors to `BaseErrorEffect` instances, which can be caught and handled with Effect's error handling facilities:

```typescript
import { Effect, pipe } from 'effect'
import { HexEffectTag, OxEffectLayer } from '@tevm/ox'

const program = pipe(
  Effect.flatMap(HexEffectTag, (hex) => 
    hex.toBooleanEffect('0xabcd') // This will fail because '0xabcd' is not a valid boolean
  ),
  Effect.catchAll(error => {
    console.error('Error:', error.shortMessage)
    console.error('Details:', error.details)
    return Effect.succeed('Recovered from error')
  }),
  Effect.provide(OxEffectLayer)
)

Effect.runPromise(program).then(console.log)
// Will print error details and then "Recovered from error"
```

## Available modules

### Hex

```typescript
import { HexEffectTag, OxEffectLayer } from '@tevm/ox'

// Services available on HexEffectTag:
// - assertEffect
// - concatEffect
// - fromBytesEffect
// - fromBooleanEffect
// - fromNumberEffect
// - fromStringEffect
// - isEqualEffect
// - padLeftEffect
// - padRightEffect
// - randomEffect
// - sizeEffect
// - toBigIntEffect
// - toBooleanEffect
// - toBytesEffect
// - toNumberEffect
// - toStringEffect
```

### Bytes

```typescript
import { BytesEffectTag, OxEffectLayer } from '@tevm/ox'

// Services available on BytesEffectTag:
// - fromArrayEffect
// - fromBooleanEffect
// - fromHexEffect
// - fromNumberEffect
// - fromStringEffect
// - concatEffect
```

### Address

```typescript
import { AddressEffectTag, OxEffectLayer } from '@tevm/ox'

// Services available on AddressEffectTag:
// - assertEffect
// - checksumEffect
// - fromBytesEffect
// - fromHexEffect
// - fromPrivateKeyEffect
// - fromStringEffect
// - formatEffect
// - isAddressEffect
// - isEqualEffect
// - toBytesEffect
// - toHexEffect
// - validateEffect
```

### Errors

```typescript
import { ErrorsEffectTag, OxEffectLayer, BaseErrorEffect } from '@tevm/ox'

// Services available on ErrorsEffectTag:
// - createBaseError
// - fromBaseError

// BaseErrorEffect has a toEffect() method to create failing Effects
const error = new BaseErrorEffect('Something went wrong')
const failingEffect = error.toEffect()
```

## License

MIT