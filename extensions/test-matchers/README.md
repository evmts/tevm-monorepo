# @tevm/test-matchers

Custom Vitest matchers for Tevm and EVM-related testing in TypeScript.

## Installation

```bash
pnpm add @tevm/test-matchers -D
# or
npm install @tevm/test-matchers --save-dev
```

## Setup

### Option 1: Automatic Setup (Recommended)

Add to your `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['@tevm/test-matchers'],
  },
})
```

### Option 2: Manual Import

Import in your test files:

```typescript
import '@tevm/test-matchers'
import { expect, test } from 'vitest'

test('example', () => {
  expect(BigInt(42)).toBeBigInt()
})
```

## Available Matchers

### `toBeBigInt()`

Asserts that a value is a BigInt.

```typescript
// ✅ Passes
expect(BigInt(42)).toBeBigInt()
expect(123n).toBeBigInt()

// ❌ Fails
expect(42).toBeBigInt()
expect('123').toBeBigInt()

// Works with .not
expect(42).not.toBeBigInt()
```

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

Asserts that a value is valid hex with optional strict mode and length validation.

```typescript
// ✅ Passes - basic hex validation
expect('0x1234abcd').toBeHex()
expect('0x').toBeHex()
expect('0xABCDEF').toBeHex()

// ✅ Passes - length validation
expect('0x1234').toBeHex({ length: 2 }) // exactly 2 bytes (4 hex chars)
expect('0x').toBeHex({ length: 0 }) // empty hex

// ✅ Passes - non-strict mode
expect('0x1234').toBeHex({ strict: false })

// ❌ Fails - missing 0x prefix
expect('1234').toBeHex() // missing 0x prefix

// ❌ Fails - invalid hex characters
expect('0xghij').toBeHex() // invalid hex characters

// ❌ Fails - wrong length
expect('0x123').toBeHex({ length: 2 }) // wrong length (1.5 bytes instead of 2)

// Options
expect(hex).toBeHex({ strict: true })           // strict hex validation (default)
expect(hex).toBeHex({ strict: false })          // only check for 0x prefix
expect(hex).toBeHex({ length: 32 })             // exactly 32 bytes (64 hex chars)
expect(hex).toBeHex({ strict: true, length: 4 }) // both strict and length
```

## TypeScript Support

All matchers include full TypeScript support with proper type definitions. The matchers will be available on the `expect` object after importing.

## Examples

```typescript
import '@tevm/test-matchers'
import { expect, test } from 'vitest'

test('TEVM result validation', () => {
  const result = {
    executionGasUsed: 21000n,
    to: '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b',
    data: '0x1234abcd'
  }

  expect(result.executionGasUsed).toBeBigInt()
  expect(result.to).toBeAddress() // validates checksum by default
  expect(result.data).toBeHex()
})

test('Transaction hash validation', () => {
  const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  expect(txHash).toBeHex({ length: 32 }) // 32 bytes for transaction hash
})

test('Function selector validation', () => {
  const selector = '0xa9059cbb' // transfer(address,uint256)
  expect(selector).toBeHex({ length: 4 }) // 4 bytes for function selector
})

test('Address validation with different strictness', () => {
  const checksummed = '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
  const lowercase = '0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b'

  expect(checksummed).toBeAddress() // passes (correct checksum)
  expect(lowercase).not.toBeAddress() // fails (incorrect checksum)
  expect(lowercase).toBeAddress({ strict: false }) // passes (any case allowed)
})
```

## License

MIT
