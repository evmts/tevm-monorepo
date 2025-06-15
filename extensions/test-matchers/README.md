# @tevm/test-matchers

Custom Vitest matchers for Tevm and EVM-related testing in TypeScript.

## Installation

```bash
pnpm add @tevm/test-matchers -D
# or
npm install @tevm/test-matchers --save-dev
```

## Setup

Add to your `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['@tevm/test-matchers'],
  },
})
```

If your `tsconfig.json` includes a `compilerOptions.types` array, add `@tevm/test-matchers` to it.

## Available Matchers

### `toBeAddress(opts?)`

Asserts that a value is a valid Ethereum address with optional checksum validation.

```typescript
// ✅ Passes - checksummed addresses (default behavior)
expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b').toBeAddress()
expect('0x0000000000000000000000000000000000000000').toBeAddress()

// ✅ Passes - any case when strict: false
expect('0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b').toBeAddress({ strict: false })

// ❌ Fails - incorrect checksum (default strict: true)
expect('0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b').toBeAddress()

// ❌ Fails - invalid format
expect('0x123').toBeAddress() // too short
expect('invalid').toBeAddress() // not hex
expect(123).toBeAddress() // not string

// Options
expect(address).toBeAddress({ strict: true })  // enforce EIP-55 checksum (default)
expect(address).toBeAddress({ strict: false }) // accept any case
```

### `toBeHex(opts?)`

Asserts that a value is valid hex with optional strict mode and size validation.

```typescript
// ✅ Passes - basic hex validation
expect('0x1234abcd').toBeHex()
expect('0x').toBeHex()
expect('0xABCDEF').toBeHex()

// ✅ Passes - size validation
expect('0x1234').toBeHex({ size: 2 }) // exactly 2 bytes (4 hex chars)
expect('0x').toBeHex({ size: 0 }) // empty hex

// ✅ Passes - non-strict mode
expect('0x1234').toBeHex({ strict: false })

// ❌ Fails - missing 0x prefix
expect('1234').toBeHex() // missing 0x prefix

// ❌ Fails - invalid hex characters
expect('0xghij').toBeHex() // invalid hex characters

// ❌ Fails - wrong size
expect('0x123').toBeHex({ size: 2 }) // wrong size (1.5 bytes instead of 2)

// Options
expect(hex).toBeHex({ strict: true })           // strict hex validation (default)
expect(hex).toBeHex({ strict: false })          // only check for 0x prefix
expect(hex).toBeHex({ size: 32 })             // exactly 32 bytes (64 hex chars)
expect(hex).toBeHex({ strict: true, size: 4 }) // both strict and size
```

### `toEqualAddress(expected)`

Asserts that two addresses are equal (case-insensitive comparison using viem's `isAddressEqual`).

```typescript
// ✅ Passes - same address different cases
expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toEqualAddress('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac')
expect('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed').toEqualAddress('0x5AAEB6053F3E94C9B9A09F33669435E7EF1BEAED')

// ❌ Fails - different addresses
expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toEqualAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')

// Works with .not
expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').not.toEqualAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
```

### `toEqualHex(expected, opts?)`

Asserts that two hex strings are equal by comparing their byte values. By default, normalizes hex strings before comparison.

```typescript
// ✅ Passes - same hex different cases
expect('0x1234abcd').toEqualHex('0x1234ABCD')
expect('0xdeadbeef').toEqualHex('0xDEADBEEF')

// ✅ Passes - normalized comparison (default behavior)
expect('0x0').toEqualHex('0x00')        // leading zeros trimmed
expect('0x000123').toEqualHex('0x123')  // leading zeros trimmed
expect('0x0000').toEqualHex('0x0')      // both normalize to same value

// ❌ Fails - different hex values
expect('0x1234abcd').toEqualHex('0x1234abce')

// Exact comparison (no normalization)
expect('0x00123').toEqualHex('0x00123', { exact: true })  // ✅ passes
expect('0x00123').toEqualHex('0x123', { exact: true })    // ❌ fails

// Options
expect(hex1).toEqualHex(hex2)                    // normalized comparison (default)
expect(hex1).toEqualHex(hex2, { exact: false }) // normalized comparison
expect(hex1).toEqualHex(hex2, { exact: true })  // exact string comparison

// Works with .not
expect('0x1234abcd').not.toEqualHex('0x1234abce')
```

## TypeScript Support

All matchers include full TypeScript support with proper type definitions. The matchers will be available on the `expect` object after importing.

## Examples

```typescript
import '@tevm/test-matchers'
import { expect, test } from 'vitest'

test('TEVM result validation', () => {
  const result = {
    to: '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b',
    data: '0x1234abcd'
  }

  expect(result.to).toBeAddress() // validates checksum by default
  expect(result.data).toBeHex()
})

test('Transaction comparison', () => {
  const tx1 = {
    to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
    data: '0x1234abcd'
  }

  const tx2 = {
    to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac', // different case
    data: '0x1234ABCD' // different case
  }

  // These should be equal despite case differences
  expect(tx1.to).toEqualAddress(tx2.to)
  expect(tx1.data).toEqualHex(tx2.data)
})

test('Hex comparison with normalization', () => {
  // Default behavior normalizes leading zeros
  expect('0x000123').toEqualHex('0x123')     // ✅ passes (normalized)
  expect('0x0').toEqualHex('0x00')           // ✅ passes (normalized)

  // Exact comparison preserves leading zeros
  expect('0x000123').toEqualHex('0x123', { exact: true })  // ❌ fails
  expect('0x000123').toEqualHex('0x000123', { exact: true }) // ✅ passes
})

test('Transaction hash validation', () => {
  const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  expect(txHash).toBeHex({ size: 32 }) // 32 bytes for transaction hash

  // Compare with different case
  const sameHashDifferentCase = '0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF'
  expect(txHash).toEqualHex(sameHashDifferentCase)
})

test('Function selector validation', () => {
  const selector = '0xa9059cbb' // transfer(address,uint256)
  expect(selector).toBeHex({ size: 4 }) // 4 bytes for function selector

  // Compare with different case
  expect(selector).toEqualHex('0xA9059CBB')
})

test('Address validation with different strictness', () => {
  const checksummed = '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
  const lowercase = '0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b'

  expect(checksummed).toBeAddress() // passes (correct checksum)
  expect(lowercase).not.toBeAddress() // fails (incorrect checksum)
  expect(lowercase).toBeAddress({ strict: false }) // passes (any case allowed)

  // But they should be equal as addresses
  expect(checksummed).toEqualAddress(lowercase) // passes (same address)
})
```

## License

MIT
