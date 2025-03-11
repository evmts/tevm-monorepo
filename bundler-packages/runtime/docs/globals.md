[**@tevm/runtime**](README.md)

***

# @tevm/runtime

## Example

```javascript
import { generateRuntime } from '@tevm/runtime'
import { runPromise } from 'effect/Effect'

// Example artifacts from Solidity compilation
const artifacts = {
  "Counter": {
    "abi": [
      {
        "inputs": [],
        "name": "count",
        "outputs": [{"type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      // ... more ABI entries
    ],
    "evm": {
      "bytecode": { "object": "608060..." },
      "deployedBytecode": { "object": "608060..." }
    }
  }
}

// Generate TypeScript code
const tsCode = await runPromise(
  generateRuntime(
    artifacts,
    'ts',          // Output module type
    true,          // Include bytecode
    '@tevm/contract' // Package to import from
  )
)

console.log(tsCode)
// The generated code will look something like:
// import { createContract } from '@tevm/contract'
// const _Counter = {
//   name: "Counter",
//   humanReadableAbi: ["function count() view returns (uint256)"],
//   bytecode: "0x608060...",
//   deployedBytecode: "0x608060..."
// } as const
// export const Counter = createContract(_Counter)
```

## Type Aliases

- [ModuleType](type-aliases/ModuleType.md)

## Functions

- [generateRuntime](functions/generateRuntime.md)
