# Tevm - JSR Edition

Tevm is a typesafe Ethereum Virtual Machine (EVM) toolkit written in TypeScript that works in both browser and Node.js environments.

## Features

- **Import Solidity contracts** directly in JavaScript/TypeScript
- **Typecheck Solidity contracts** with full type safety
- **Simulate and debug** EVM execution step-by-step
- **Fork mainnet** or any EVM chain locally in the browser

## Installation

```bash
# Using npm
npm install tevm

# Using JSR
jsr add @tevm/tevm
```

## Usage

```typescript
import { createMemoryClient, http } from '@tevm/tevm'
import { optimism } from '@tevm/tevm/common'
import { encodeFunctionData, parseAbi, decodeFunctionResult, parseEther } from 'viem'

// Create a client as a fork of the Optimism mainnet
const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
    common: optimism,
  },
})

await client.tevmReady()

// Mint 1 ETH for our address
const account = "0x" + "baD60A7".padStart(40, "0")
await client.setBalance({
  address: account,
  value: parseEther("1")
})

// Interact with a smart contract
const greeterContractAddress = "0x10ed0b176048c34d69ffc0712de06CbE95730748"
const greeterAbi = parseAbi([
  'function greet() view returns (string)',
  'function setGreeting(string memory _greeting) public'
])

// Send a transaction
const txHash = await client.sendTransaction({
  account,
  to: greeterContractAddress,
  data: encodeFunctionData({
    abi: greeterAbi,
    functionName: 'setGreeting',
    args: ["Hello from Tevm!"]
  })
})

// Mine the transaction
await client.mine({blocks: 1})
```

## Documentation

For complete documentation, visit [https://tevm.sh](https://tevm.sh)

## License

MIT