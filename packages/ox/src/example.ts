import { Effect, pipe } from 'effect'
import {
  HexEffectTag,
  AddressEffectTag,
  BytesEffectTag,
  OxEffectLayer,
  ErrorsEffectTag
} from './index.js'

// Example of using the OxEffect library

/**
 * This is a contrived example that:
 * 1. Converts a string to hex
 * 2. Takes that hex and creates an address from it (for demonstration, not a real address)
 * 3. Formats the address
 * 4. Converts the address to bytes
 * 5. Handles any errors along the way
 */
const program = pipe(
  // Convert string to hex
  Effect.flatMap(HexEffectTag, (hex) => 
    hex.fromStringEffect('Hello, Ethereum with Effect!')
  ),
  
  // Create an "address" from the hex (note: this isn't a real pattern, just for demo)
  Effect.flatMap((hexValue) => 
    Effect.catchAll(
      Effect.flatMap(AddressEffectTag, (address) =>
        address.fromHexEffect(hexValue)
      ),
      (error) => Effect.flatMap(ErrorsEffectTag, (errors) => 
        Effect.flatMap(
          Effect.logError(`Cannot directly convert to address: ${error.shortMessage}`),
          () => Effect.flatMap(HexEffectTag, (hex) => 
            hex.padRightEffect(hexValue.slice(0, 42), 20)
          )
        )
      )
    )
  ),
  
  // Format the address
  Effect.flatMap((addressValue) => 
    Effect.flatMap(AddressEffectTag, (address) =>
      address.formatEffect(addressValue, { case: 'uppercase' })
    )
  ),
  
  // Log the result
  Effect.tap((formattedAddress) =>
    Effect.log(`Formatted address: ${formattedAddress}`)
  ),
  
  // Convert to bytes
  Effect.flatMap((formattedAddress) =>
    Effect.flatMap(AddressEffectTag, (address) =>
      Effect.flatMap(
        address.fromStringEffect(formattedAddress),
        (addr) => address.toBytesEffect(addr)
      )
    )
  ),
  
  // Final processing of bytes
  Effect.flatMap((bytes) =>
    Effect.flatMap(BytesEffectTag, (bytesService) =>
      Effect.map(
        bytesService.fromArrayEffect([...Array.from(bytes), 0, 0, 0]),
        (result) => `Final byte length: ${result.length}`
      )
    )
  ),
  
  // Provide all services
  Effect.provide(OxEffectLayer)
)

// Run the program and log the result
Effect.runPromise(program).then(
  result => console.log('Program succeeded with:', result),
  error => console.error('Program failed with:', error)
)