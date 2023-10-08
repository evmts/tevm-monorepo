# ActionHandlers

To use an action you pass it into a handler. Handlers are just dispatchers and they have names that match the action they are dispatching.

- **Example**

We can read our balanceOf action using the rpc handler as follows:

1. import the handler. It's name will match the name of the actionCreator
2. Initiate the handler. `ethCall` and other similar actions like `estimateGas` take a `httpJsonRpc` as an argument. Handlers should be passed into `client.add()`
3. Pass your action into your handler to execute the action

```typescript
import {optimism} from 'evmts/chains'
import {createClient} from 'evmts/clients'
import {ethCallHandler, httpJsonRpc} from 'evmts'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const client = createClient().add(
  ethCallHandler({
    rpc: httpJsonRpc({
      [optimism.id]: {
        url: 'https://mainnet.optimism.io'
      }
    })
  })
)

const balance = client.ethCallHandler(
  ERC20.read.balanceOf.ethCall('0x121212121212121212121212', {
    address: '0x42424242424242424242424242', 
  }),
  // In addition to the action handlers can accept an options object as the second parameter
  {
    chainId: optimism.id,
  }
)
```

