# Chains

Chains are JSON serializable objects to represent individual chains. 

## Type

```typescript
type ChainContract = {
  address: Address,
  blockCreated: number,
}
type Chain {
  id: number,
  name: string,
  gasToken: {
    decimals: number,
    name: string,
    symbol: string,
  },
  rpcUrls: Array<{
    http: Array<string>,
    ws: Array<string>,
  }>,
  blockExplorers: Array<{
    name: string,
    url: string,
  }>,
  contracts: {
    multicall3?: ChainContract
  },
}
```

## Known chains

Known chains can be imported directly from evmts/chains. All known chains are listed below. If your chain is not supported consider [opening a pr](https://todo.todo)

```typescript
import {
  ethereum,
  optimism,
  base,
  zora,
  hardhat,
  anvil,
  opAnvil,
} from 'evmts/chains'
```

## Custom chains

A custom chain can be created via the defineChain method

```typescript
import {
  defineChain
} from 'evmts/chains'

const myCustomChain = defineChain({
  id: 9876543210,
  name: 'MyCustomChain',
  gasToken: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    http: 'https://localhost:9555',
    ws: 'https://localhost:9556',
  },
  blockExplorers: Array<{
    name: 'Local blockscout'
    url: 'https://localhost:4444',
  }>,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11'},
      blockCreated: 0,
    }
  },
})
```
