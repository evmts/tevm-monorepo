# @tevm/inline-sol

Inline Solidity support for Tevm using template literals.

## Installation

```bash
npm install tevm
```

## Usage

```typescript
import { sol } from 'tevm'
import { createMemoryClient } from 'tevm'

// Define contract inline
const Counter = sol`
  pragma solidity ^0.8.19;
  
  contract Counter {
    uint256 private count = 0;
    
    function increment() public {
      count += 1;
    }
    
    function count() public view returns (uint256) {
      return count;
    }
  }
`

// Use with client.deployContract, client.readContract, etc.
const client = createMemoryClient()
const deployed = await client.deployContract(Counter)
const count = await deployed.read.count()
```

## How it works

The `sol` template tag compiles Solidity code inline at runtime, generating a unique filename based on the source file and position. The compiled contract is returned as a Tevm Contract instance with full type information.

## License

MIT