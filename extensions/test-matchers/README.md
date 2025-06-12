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

## Event Matchers

### `toEmit(contract, eventName)`

Asserts that a transaction emitted a specific event from a contract.

```typescript
import { expect, test } from 'vitest'
import '@tevm/test-matchers'

// Contract with typed ABI
const contract = {
  abi: [
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'to', type: 'address', indexed: true },
        { name: 'value', type: 'uint256', indexed: false }
      ]
    }
  ],
  address: '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
}

test('contract event emission', async () => {
  // ✅ Passes - event was emitted
  await expect(contract.write.transfer('0x123...', 100n))
    .toEmit(contract, 'Transfer')

  // ❌ Fails - event was not emitted
  await expect(contract.read.balanceOf('0x123...'))
    .toEmit(contract, 'Transfer')

  // Works with .not
  await expect(contract.read.balanceOf('0x123...'))
    .not.toEmit(contract, 'Transfer')
})
```

### `toEmit(eventSignature)` and `toEmit(eventSelector)`

Alternative ways to specify events using signature strings or hex selectors.

```typescript
test('event emission with signature', async () => {
  // Using event signature string
  await expect(contract.write.transfer('0x123...', 100n))
    .toEmit('Transfer(address,address,uint256)')

  // Using event selector (hex)
  await expect(contract.write.transfer('0x123...', 100n))
    .toEmit('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
})
```

### `withEventArgs(...expectedArgs)`

Chains with `toEmit` to assert specific event arguments in positional order.

```typescript
test('event with specific arguments', async () => {
  const fromAddr = '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
  const toAddr = '0x123d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
  const amount = 100n

  // ✅ Passes - exact argument match
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventArgs(fromAddr, toAddr, amount)

  // ❌ Fails - wrong arguments
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventArgs(fromAddr, toAddr, 200n) // wrong amount

  // Works with event signatures too
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit('Transfer(address,address,uint256)')
    .withEventArgs(fromAddr, toAddr, amount)
})
```

### `withEventNamedArgs(expectedArgs)`

Chains with `toEmit` to assert specific event arguments by name. Supports partial matching.

```typescript
test('event with named arguments', async () => {
  const toAddr = '0x123d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
  const amount = 100n

  // ✅ Passes - partial named argument match
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({
      to: toAddr,
      value: amount
    })

  // ✅ Passes - can check just one argument
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({ value: amount })

  // ✅ Passes - empty object matches any event
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({})

  // ❌ Fails - wrong named arguments
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({ value: 200n })

  // ❌ Fails - invalid argument name
  await expect(contract.write.transfer(toAddr, amount))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({ invalidArg: 100n })
})
```

### Event Matcher Limitations

**Important:** Due to how Chai's `.not` property works, you cannot use `.not` directly before `withEventArgs` or `withEventNamedArgs`. Meaning that you _can_ test that an event was not emitted, but you _cannot_ test that an event was emitted but not with certain arguments.

```typescript
// ❌ Does NOT work - .not breaks the chain
await expect(transaction)
  .toEmit(contract, 'Transfer')
  .not.withEventArgs(100n) // This will fail with an error

// ✅ Works - use .not before toEmit
await expect(transaction)
  .not.toEmit(contract, 'Transfer') // Event should not be emitted at all

// ✅ Alternative - assert the positive case
await expect(transaction)
  .toEmit(contract, 'Transfer')
  .withEventArgs(200n) // Assert it has different args instead
```

## Error Matchers

### `toBeReverted(client?)`

Asserts that a transaction reverted for any reason (string revert, custom error, or panic).

```typescript
import { expect, test } from 'vitest'
import '@tevm/test-matchers'

test('basic revert detection', async () => {
  // ✅ Passes - transaction reverted (any reason)
  await expect(writeContract(client, contract.write.transferBeyondBalance()))
    .toBeReverted(client)

  // ❌ Fails - transaction succeeded
  await expect(writeContract(client, contract.write.transfer('0x123...', 10n)))
    .toBeReverted(client)

  // Works with .not
  await expect(writeContract(client, contract.write.transfer('0x123...', 10n)))
    .not.toBeReverted(client)

  // Client parameter is optional for some transaction types
  await expect(someTevmCall())
    .toBeReverted()
})
```

### `toBeRevertedWithString(client, expectedString)`

Asserts that a transaction reverted with a specific revert string (e.g., `revert("message")`).

```typescript
test('string revert detection', async () => {
  // ✅ Passes - transaction reverted with exact string
  await expect(writeContract(client, contract.write.requirePositiveAmount(-1)))
    .toBeRevertedWithString(client, 'Amount must be positive')

  // ❌ Fails - transaction reverted with different string
  await expect(writeContract(client, contract.write.requirePositiveAmount(-1)))
    .toBeRevertedWithString(client, 'Invalid amount')

  // ❌ Fails - transaction reverted with custom error (not string)
  await expect(writeContract(client, contract.write.transferBeyondBalance()))
    .toBeRevertedWithString(client, 'Amount must be positive')

  // Works with .not
  await expect(writeContract(client, contract.write.transfer('0x123...', 10n)))
    .not.toBeRevertedWithString(client, 'Amount must be positive')
})

### `toBeRevertedWithError(client, contract, errorName)`

Asserts that a transaction reverted with a specific custom error from a contract.

```typescript
import { expect, test } from 'vitest'
import '@tevm/test-matchers'

// Contract with custom error in ABI
const contract = {
  abi: [
    {
      type: 'error',
      name: 'InsufficientBalance',
      inputs: [
        { name: 'available', type: 'uint256' },
        { name: 'required', type: 'uint256' }
      ]
    }
  ],
  address: '0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b'
}

test('contract custom error detection', async () => {
  // ✅ Passes - transaction reverted with specific error
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')

  // ❌ Fails - transaction succeeded
  await expect(writeContract(client, contract.write.transfer('0x123...', 10n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')

  // ❌ Fails - wrong error
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'Unauthorized')

  // Works with .not
  await expect(writeContract(client, contract.write.transfer('0x123...', 10n)))
    .not.toBeRevertedWithError(client, contract, 'InsufficientBalance')
})
```

### `toBeRevertedWithError(client, errorSignature)` and `toBeRevertedWithError(client, errorSelector)`

Alternative ways to specify errors using signature strings or hex selectors.

```typescript
test('error detection with signature', async () => {
  // Using error signature string
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, 'InsufficientBalance(uint256,uint256)')

  // Using error selector (hex)
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, '0x356680b7') // InsufficientBalance selector
})
```

### `withErrorArgs(...expectedArgs)`

Chains with `toBeRevertedWithError` to assert specific error arguments in positional order.

```typescript
test('error with specific arguments', async () => {
  // ✅ Passes - exact argument match
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorArgs(50n, 1000n) // available: 50, required: 1000

  // ❌ Fails - wrong arguments
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorArgs(100n, 1000n) // wrong available amount

  // Works with error signatures too
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, 'InsufficientBalance(uint256,uint256)')
    .withErrorArgs(50n, 1000n)
})
```

### `withErrorNamedArgs(expectedArgs)`

Chains with `toBeRevertedWithError` to assert specific error arguments by name. Supports partial matching.

```typescript
test('error with named arguments', async () => {
  // ✅ Passes - partial named argument match
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({
      available: 50n,
      required: 1000n
    })

  // ✅ Passes - can check just one argument
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({ required: 1000n })

  // ✅ Passes - empty object matches any error
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({})

  // ❌ Fails - wrong named arguments
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({ available: 100n })

  // ❌ Fails - invalid argument name
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({ invalidArg: 50n })
})
```

### Error Matcher Limitations

**Important:** Similar to event matchers, you cannot use `.not` directly before `withErrorArgs` or `withErrorNamedArgs`. You can test that a transaction did not revert with a specific error, but you cannot test that it reverted with an error but not with certain arguments.

```typescript
// ❌ Does NOT work - .not breaks the chain
await expect(transaction)
  .toBeRevertedWithError(client, contract, 'InsufficientBalance')
  .not.withErrorArgs(50n, 1000n) // This will fail

// ✅ Works - use .not before toBeRevertedWithError
await expect(transaction)
  .not.toBeRevertedWithError(client, contract, 'InsufficientBalance')

// ✅ Alternative - assert the positive case with different args
await expect(transaction)
  .toBeRevertedWithError(client, contract, 'InsufficientBalance')
  .withErrorArgs(100n, 1000n) // Assert it has different args
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

test('Event testing examples', async () => {
  const client = // ... your TEVM client

  // Basic event testing
  await expect(client.tevmContract(contract.write.transfer('0x123...', 100n)))
    .toEmit(contract, 'Transfer')

  // Event with specific arguments
  await expect(client.tevmContract(contract.write.transfer('0x123...', 100n)))
    .toEmit(contract, 'Transfer')
    .withEventArgs('0x742d35Cc...', '0x123...', 100n)

  // Event with named arguments (partial matching)
  await expect(client.tevmContract(contract.write.transfer('0x123...', 100n)))
    .toEmit(contract, 'Transfer')
    .withEventNamedArgs({ value: 100n })

  // Using event signatures instead of contracts
  await expect(transaction)
    .toEmit('Transfer(address,address,uint256)')
    .withEventArgs(fromAddr, toAddr, amount)
})

test('Error testing examples', async () => {
  const client = // ... your TEVM client

  // Basic revert testing (any reason)
  await expect(writeContract(client, contract.write.failingFunction()))
    .toBeReverted(client)

  // String revert testing
  await expect(writeContract(client, contract.write.requirePositiveAmount(-1)))
    .toBeRevertedWithString(client, 'Amount must be positive')

  // Custom error testing
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')

  // Error with specific arguments
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorArgs(50n, 1000n)

  // Error with named arguments (partial matching)
  await expect(writeContract(client, contract.write.transfer('0x123...', 1000n)))
    .toBeRevertedWithError(client, contract, 'InsufficientBalance')
    .withErrorNamedArgs({ required: 1000n })

  // Using error signatures instead of contracts
  await expect(transaction)
    .toBeRevertedWithError(client, 'InsufficientBalance(uint256,uint256)')
    .withErrorArgs(50n, 1000n)
})
```
