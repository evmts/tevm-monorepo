[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [contract](../README.md) / SimpleContract

# Variable: SimpleContract

> `const` **SimpleContract**: [`Contract`](../../index/type-aliases/Contract.md)

Defined in: packages/contract/types/contract-lib/SimpleContract.s.sol.d.ts:36

Bytecode and ABI for a simple contract with a single state variable.
This constant represents a basic contract that can get and set a uint256 value.

## Examples

Using the SimpleContract in a deployment script:
```typescript
import { SimpleContract } from 'tevm/contract'

// Deploy the SimpleContract with an initial value
const deployedSimpleContract = await tevm.deployContract(SimpleContract.deploy(42n))
console.log('SimpleContract deployed at:', deployedSimpleContract.address)

// Interact with the deployed contract
const value = await tevm.contract(SimpleContract.read.get())
console.log('Current value:', value)
```

Using the SimpleContract with an existing deployment:
```typescript
import { SimpleContract } from 'tevm/contract'

const existingSimpleContract = SimpleContract.withAddress('0x1234...')

// Read current value
const currentValue = await tevm.contract(existingSimpleContract.read.get())
console.log('Current value:', currentValue)

// Set a new value
await tevm.contract(existingSimpleContract.write.set(100n))
console.log('New value set')
```
