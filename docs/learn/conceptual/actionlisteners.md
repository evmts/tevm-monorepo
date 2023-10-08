# ActionListeners

Listeners are similar to handlers in that they take actions but are event based. Common examples of listeners

- Listening for logs
- Listening for new blocks
- Listening for new rollup safe heads
- Listening for optimistic state updates
- Listening for updates to a specific contracts storage

Like handlers listeners share name with the action they accept. Actions sometimes are acceptable both in a handler and a listener such as the `getBlock` action which can be used both as a listener for new blocks or a 1 time actionHandler to get the block.

- **Example**

The following listener listens for new block events and returns the balanceOf when new blocks are heard.

```typescript
import {optimism} from 'evmts/chains'
import {createClient} from 'evmts/clients'
import {ethGetBlock, ethGetBlockListener, ethCallHandler, httpJsonRpc} from 'evmts'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const client = createClient().add(
  ethGetBlockListener(),
  ethCallHandler({
    rpc: httpJsonRpc({
      [optimism.id]: {
        url: 'https://mainnet.optimism.io'
      }
    })
  })
)

// listen for new blocks
// optionally the parameterless ethGetBlock could be omitted here as it's the default
client.ethGetBlockListener(ethGetBlock())
   // skip every block other than 10
  .filter(({block}) => {
    return block % 10 === 0
  })
  // fetch balanceOf every 10 blocks
  .map(({block}) => {
    const balance = client.ethCallHandler(
      ERC20.read.balanceOf.ethCall('0x121212121212121212121212', {
        address: '0x42424242424242424242424242', 
      }),
      {
        chainId: optimism.id,
      }
    )
    return {balance}
  })
  .subscribe(({balance}) => {
    console.log({balance})
  })
```

## React

Handlers Listeners and Actions can be used for both react and vanilla js. The action creators and handlers are interchangable between the two.

```typescript
import {optimism} from 'evmts/chains'
import {createReactClient} from '@evmts/react'
import {ethCallHandler, httpJsonRpc} from 'evmts'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const client = createReactClient().add(
  ethCallHandler({
    rpc: httpJsonRpc({
      [optimism.id]: {
        url: 'https://mainnet.optimism.io'
      }
    })
  })
)

const MyComponent = () => {
  const {data: balance, error, loading} = jsonRpc.useEthCallHandler(
    ERC20.read.balanceOf.call('0x121212121212121212121212', {
      address: '0x42424242424242424242424242', 
    })
  )
  if (loading) {
    return <div>'...loading'</div>
  }
  // Errors in react are strongly typed
  if (error) return {
    return <div>{error.message}</div>
  }
  return <div>{balance}</div>
}
```

For more information about the react api see the [react docs](../react/overview.md)

