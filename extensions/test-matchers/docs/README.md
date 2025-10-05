**@tevm/test-matchers**

***

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

If your `tsconfig.json` includes a `compilerOptions.types` array, add `@tevm/test-matchers` to it. Otherwise, types will be extended by default.

## Available Matchers

### Basic Matchers

#### `toBeAddress(opts?)`
Validates Ethereum addresses. Default requires EIP-55 checksum.
```typescript
expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b').toBeAddress() // checksummed
expect('0x742d35cc5db4c8e9f8d4dc1ef70c4c7c8e5b7a6b').toBeAddress({ strict: false }) // any case
```

#### `toBeHex(opts?)`
Validates hex strings with optional size verification.
```typescript
expect('0x1234abcd').toBeHex()
expect('0xa9059cbb').toBeHex({ size: 4 }) // function selector (4 bytes)
expect(txHash).toBeHex({ size: 32 }) // transaction hash (32 bytes)
```

#### `toEqualAddress(expected)`
Case-insensitive address comparison.
```typescript
expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toEqualAddress('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac')
```

#### `toEqualHex(expected, opts?)`
Hex comparison with normalization by default (trims leading zeros).
```typescript
expect('0x000123').toEqualHex('0x123') // normalized (default)
expect('0x000123').toEqualHex('0x000123', { exact: true }) // exact match
```

### Balance Matchers

#### `toChangeBalance(client, account, expectedChange)`
Tests ETH balance changes for a single account. Use `toChangeBalances` for multiple accounts.
```typescript
await expect(txHash).toChangeBalance(client, '0x123...', 100n) // gained 100 wei
await expect(txHash).toChangeBalance(client, account, -50n) // lost 50 wei
```

#### `toChangeBalances(client, balanceChanges)`
Tests ETH balance changes for multiple accounts in a single transaction.
```typescript
await expect(txHash).toChangeBalances(client, [
  { account: sender, amount: -100n },   // sender loses 100
  { account: recipient, amount: 100n }, // recipient gains 100
])
```

#### `toChangeTokenBalance(client, token, account, expectedChange)`
Tests ERC20 token balance changes. Use `toChangeTokenBalances` for multiple accounts.
```typescript
await expect(txHash).toChangeTokenBalance(client, tokenAddress, '0x123...', 100n)
await expect(txHash).toChangeTokenBalance(client, tokenContract, account, -50n)
```

#### `toChangeTokenBalances(client, token, balanceChanges)`
Tests token balance changes for multiple accounts.
```typescript
await expect(txHash).toChangeTokenBalances(client, tokenAddress, [
  { account: sender, amount: -100n },
  { account: recipient, amount: 100n },
])
```

### Event Matchers

#### `toEmit(contract, eventName)`
Tests if a transaction emitted a specific event.
```typescript
await expect(contract.write.transfer('0x123...', 100n))
  .toEmit(contract, 'Transfer')

// Alternative: use signature or selector
await expect(transaction)
  .toEmit('Transfer(address,address,uint256)')
  .toEmit('0xddf252ad...') // event selector
```

#### `withEventArgs(...args)` / `withEventNamedArgs(args)`
Chain with `toEmit` to test event arguments.
```typescript
// Positional arguments
await expect(contract.write.transfer(to, 100n))
  .toEmit(contract, 'Transfer')
  .withEventArgs(from, to, 100n)

// Named arguments (partial matching supported)
await expect(contract.write.transfer(to, 100n))
  .toEmit(contract, 'Transfer')
  .withEventNamedArgs({ value: 100n })
```

**Limitation**: Cannot use `.not` before `withEventArgs`/`withEventNamedArgs`.

### Error Matchers

#### `toBeReverted(client?)`
Tests if a transaction reverted for any reason.
```typescript
await expect(writeContract(client, contract.write.failingFunction()))
  .toBeReverted(client)
```

#### `toBeRevertedWithString(client, message)`
Tests for specific revert string messages.
```typescript
await expect(writeContract(client, contract.write.requirePositive(-1)))
  .toBeRevertedWithString(client, 'Amount must be positive')
```

#### `toBeRevertedWithError(client, contract, errorName)`
Tests for custom contract errors. Use `toBeRevertedWithString` for `revert()` messages.
```typescript
await expect(writeContract(client, contract.write.transfer(to, 1000n)))
  .toBeRevertedWithError(client, contract, 'InsufficientBalance')

// Alternative: use signature or selector
await expect(transaction)
  .toBeRevertedWithError(client, 'InsufficientBalance(uint256,uint256)')
  .toBeRevertedWithError(client, '0x356680b7') // error selector
```

#### `withErrorArgs(...args)` / `withErrorNamedArgs(args)`
Chain with `toBeRevertedWithError` to test error arguments.
```typescript
// Positional arguments
await expect(transaction)
  .toBeRevertedWithError(client, contract, 'InsufficientBalance')
  .withErrorArgs(50n, 1000n) // available: 50, required: 1000

// Named arguments (partial matching supported)
await expect(transaction)
  .toBeRevertedWithError(client, contract, 'InsufficientBalance')
  .withErrorNamedArgs({ required: 1000n })
```

**Limitation**: Cannot use `.not` before `withErrorArgs`/`withErrorNamedArgs`.

### Contract Call Matchers

#### `toCallContractFunction(client, contract, functionName)`
Tests if a transaction called a specific contract function.
```typescript
await expect(txHash)
  .toCallContractFunction(client, contract, 'transfer')

// Alternative: use function signature or selector
await expect(txHash)
  .toCallContractFunction(client, 'transfer(address,uint256)')
await expect(txHash)
  .toCallContractFunction(client, '0xa9059cbb')
```

#### `withFunctionArgs(...args)` / `withFunctionNamedArgs(args)`
Chain with `toCallContractFunction` to test function call arguments.
```typescript
// Positional arguments
await expect(txHash)
  .toCallContractFunction(client, contract, 'transfer')
  .withFunctionArgs(recipient, 100n)

// Named arguments (partial matching supported)
await expect(txHash)
  .toCallContractFunction(client, contract, 'transfer')
  .withFunctionNamedArgs({ to: recipient, value: 100n })
```

**Limitation**: Cannot use `.not` before `withFunctionArgs`/`withFunctionNamedArgs`.

### State Matchers

#### `toBeInitializedAccount(client)`
Tests if an address contains deployed contract code.
```typescript
await expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b')
  .toBeInitializedAccount(client)
```

#### `toHaveState(client, expectedState)`
Tests account state properties (balance, nonce, code, storage).
```typescript
await expect('0x742d35Cc5dB4c8E9f8D4Dc1Ef70c4c7c8E5b7A6b')
  .toHaveState(client, {
    balance: 1000n,
    nonce: 5n,
    code: '0x6080...',
    storage: { '0x0': '0x1' }
  })
```

#### `toHaveStorageAt(client, expectedStorage)`
Tests contract storage values at specific slots.
```typescript
// Single slot
await expect(contractAddress)
  .toHaveStorageAt(client, { slot: '0x0', value: '0x1' })

// Multiple slots
await expect(contractAddress)
  .toHaveStorageAt(client, [
    { slot: '0x0', value: '0x1' },
    { slot: '0x1', value: '0x2' }
  ])
```

## TypeScript Support

All matchers include full TypeScript support with proper type definitions. The matchers will be available on the `expect` object after importing.

## Complete Example

```typescript
import { expect, it } from 'vitest'
import { createMemoryClient } from 'tevm'
import { writeContract } from 'viem/actions'

it('ERC20 transfer with all matchers', async () => {
  const client = createMemoryClient()
  const token = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
  const sender = '0x742d35Cc6274c36e1019e41D77d0A4aa7D7dE01e'
  const recipient = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

  // Validate addresses
  expect(sender).toBeAddress()
  expect(recipient).toEqualAddress('0x5aAeb6053f3e94c9b9a09f33669435e7ef1beaed')

  // Execute transfer
  const txHash = await writeContract(client, {
    address: token,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [recipient, 1000n],
    account: sender,
  })

  // Test balance changes
  await expect(txHash).toChangeTokenBalances(client, token, [
    { account: sender, amount: -1000n },
    { account: recipient, amount: 1000n },
  ])

  // Test event emission
  await expect(txHash)
    .toEmit(token, 'Transfer')
    .withEventNamedArgs({
      from: sender,
      to: recipient,
      value: 1000n
    })

  // Test function call
  await expect(txHash)
    .toCallContractFunction(client, token, 'transfer')
    .withFunctionArgs(recipient, 1000n)

  // Test transaction hash format
  expect(txHash).toBeHex({ size: 32 })
})

it('Failed transfer with custom error', async () => {
  const client = createMemoryClient()

  // This should fail with InsufficientBalance error
  await expect(
    writeContract(client, {
      address: token,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, 1000000n], // more than balance
      account: sender,
    })
  )
    .toBeRevertedWithError(client, token, 'InsufficientBalance')
    .withErrorNamedArgs({ required: 1000000n })
})
```

## Gotchas & Best Practices

1. **Balance Changes**: When testing multiple balance changes with `.not`, i.e. `not.toChangeBalances` or `not.toChangeTokenBalances`, the assertion will pass as long as at least one of the specified changes is not met.
2. **Event Testing**: Use `withEventNamedArgs` for partial matching when you only care about specific arguments.
3. **Error Testing**: Use `toBeRevertedWithString` for `revert("message")` or `require(false, "message")` and `toBeRevertedWithError` for custom errors.
4. **Address Comparison**: Use `toEqualAddress` for case-insensitive comparison, `toBeAddress` for validation.
5. **Hex Comparison**: Default behavior normalizes (trims leading zeros). Use `{ exact: true }` for strict comparison.
6. **Chainable Limitations**: Cannot use `.not` before `withEventArgs`, `withEventNamedArgs`, `withErrorArgs`, or `withErrorNamedArgs`.
