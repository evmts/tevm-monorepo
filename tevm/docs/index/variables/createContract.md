[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createContract

# Variable: createContract

> `const` **createContract**: [`CreateContractFn`](../../contract/type-aliases/CreateContractFn.md)

Defined in: packages/contract/types/createContract.d.ts:67

Creates a Tevm Contract instance from a human-readable ABI or JSON ABI.
This function is the core of Tevm's contract interaction capabilities,
allowing for type-safe and easy-to-use contract interfaces.

## Throws

If neither humanReadableAbi nor abi is provided.

## Examples

Using a human-readable ABI:
```typescript
import { createContract } from 'tevm/contract'

const contract = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI token address
})

// Read contract state
const balanceAction = contract.read.balanceOf('0x1234...')
const balance = await tevm.contract(balanceAction)

// Write to contract
const transferAction = contract.write.transfer('0x5678...', 1000n)
const result = await tevm.contract(transferAction)

// Create event filter
const transferFilter = contract.events.Transfer({ fromBlock: 'latest' })
const logs = await tevm.eth.getLogs(transferFilter)
```

Using a JSON ABI:
```typescript
import { createContract } from 'tevm/contract'

const contract = createContract({
  name: 'ERC20',
  abi: [
    {
      "inputs": [{"name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    // ... other ABI entries
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  bytecode: '0x60806040...', // Optional: Creation bytecode
  deployedBytecode: '0x608060405...', // Optional: Deployed bytecode
  code: '0x608060405...' // Optional: Runtime bytecode
})

// Use the contract as in the previous example
```

## See

 - [Contract](../type-aliases/Contract.md) for the full API of the returned Contract instance.
 - [https://tevm.sh/learn/contracts/](https://tevm.sh/learn/contracts/) for more information on working with contracts in Tevm.
 - [https://tevm.sh/reference/tevm/contract/types/Contract/](https://tevm.sh/reference/tevm/contract/types/Contract/) for detailed Contract type documentation.
