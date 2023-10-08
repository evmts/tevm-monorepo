# Viem integration

The `@evmts/viem` package has a viem extension for consuming a subset of EVMts actions. This is especially useful for consuming contract actions.

- **Example**

The following example shows how to use EVMts with viem

:::
```typescript [example.ts]
import {publicClient} from './client'
import {ERC721} from '@openzeppelin/contracts/tokens/ERC20/ERC20.sol'

const balance = await publicClient.evmts(
  ERC721.read.ownerOf(BigInt(1))
)
console.log(balance)
```
```typescript [client.ts]
import {evmtsViemExtension} from '@evmts/viem'
import {createPublicClient, transport, http} from 'viem'
import {optimism} from 'viem/chains'

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http('https://mainnet.optimism.io')
}).extend(evmtsViemExtension())
```
:::

Currently only contract actions are supported. Contributions to add support for more actions are welcome.
