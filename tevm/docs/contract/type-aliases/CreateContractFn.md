[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [contract](../README.md) / CreateContractFn

# Type Alias: CreateContractFn()

> **CreateContractFn** = \<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, code, }`) => [`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Defined in: packages/contract/types/CreateContractFn.d.ts:76

Type of `createContract` factory function.
Creates a tevm Contract instance from a human readable ABI or JSON ABI.

## Type Parameters

### TName

`TName` *extends* `string`

The name of the contract

### TAbi

`TAbi` *extends* readonly `string`[] \| [`Abi`](../../index/type-aliases/Abi.md)

The ABI type (either string[] for human readable or Abi for JSON)

### TAddress

`TAddress` *extends* `undefined` \| [`Address`](../../index/type-aliases/Address.md) = `undefined`

The contract address type (optional)

### TBytecode

`TBytecode` *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

The contract bytecode type (optional)

### TDeployedBytecode

`TDeployedBytecode` *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

The deployed bytecode type (optional)

### TCode

`TCode` *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

The runtime bytecode type (optional)

### THumanReadableAbi

`THumanReadableAbi` *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`FormatAbi`](../../index/type-aliases/FormatAbi.md)\<`TAbi`\> : `never`

## Parameters

### \{ name, humanReadableAbi, bytecode, deployedBytecode, code, \}

[`CreateContractParams`](../../index/type-aliases/CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Examples

Using a human readable ABI:
```typescript
import { type Contract, createContract } from 'tevm/contract'

const contract: Contract = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ],
})
```

Using a JSON ABI (needs to be formatted):
```typescript
import { type Contract, createContract } from 'tevm/contract'
import { formatAbi } from '@tevm/utils'

const jsonAbi = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
]

const contract = createContract({
  name: 'ERC20',
  abi: formatAbi(jsonAbi),
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI token address on Ethereum mainnet
  bytecode: '0x60806040526000805534801561001457600080fd5b50610771806100246000396000f3fe',  // Example bytecode (truncated)
  deployedBytecode: '0x608060405234801561001057600080fd5b50600436106100885760003560e01c806370a082311161005b57806370a08231146101bc', // Example deployed bytecode (truncated)
  code: '0x608060405234801561001057600080fd5b50600436106100885760003560e01c806370a082311161005b57806370a08231146101bc',  // Example runtime code (truncated)
})
```
