# ActionCreators

Actions are created using ActionCreators. For an in-depth understanding of all the actions, visit our reference documentation. A brief overview includes:

- **Example**

Contract ActionCreators can be imported directly from solidity files. The [above eth_call action](./overview.md/##Actions) is created from a `contract` action creator as follows. 

```typescript
import {mainnet} from 'evmts/chains'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const balanceOfAction = ERC20.read.balanceOf.ethCall('0x121212121212121212121212', {
  address: '0x42424242424242424242424242', 
  chain: mainnet
})
console.log(balanceOfAction) // logs the action in the above Action section
```

