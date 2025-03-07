[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [contract](../README.md) / ERC20

# Variable: ERC20

> `const` **ERC20**: [`Contract`](../../index/type-aliases/Contract.md)

Defined in: packages/contract/types/contract-lib/ERC20.d.ts:34

Bytecode and ABI for the ERC20 contract from OpenZeppelin.
This constant represents a standard ERC20 token implementation.

## Examples

Using the ERC20 contract in a deployment script:
```typescript
import { ERC20 } from 'tevm/contract'

// Deploy the ERC20 contract
const deployedERC20 = await tevm.deployContract(ERC20.deploy('MyToken', 'MTK'))
console.log('ERC20 deployed at:', deployedERC20.address)

// Interact with the deployed contract
const balance = await tevm.contract(ERC20.read.balanceOf(deployedERC20.address, '0x1234...'))
console.log('Balance:', balance)
```

Using the ERC20 contract with an existing deployment:
```typescript
import { ERC20 } from 'tevm/contract'

const existingERC20 = ERC20.withAddress('0x1234...')

// Read token name
const name = await tevm.contract(existingERC20.read.name())
console.log('Token name:', name)

// Transfer tokens
await tevm.contract(existingERC20.write.transfer('0x5678...', 1000n))
```
