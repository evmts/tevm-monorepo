# Overview

The backbone of EVMts is its Actions. These simple JSON-serializable objects instruct an EVMts handler on which operations to execute. Embracing Actions brings an array of advantages:

- **Predictable**: Actions make the state management and listening of ever changing chain state much safer and predictable
- **Intuitive Usage**: Navigate EVMts seamlessly. No need to remember specific APIs – import a Contract or any actionCreator and utilize autocomplete.
- **Optimal Code Splitting**: While class-based APIs like ethers.js are user-centric, they don't excel in code splitting. Action-based APIs merge the strengths of both worlds.
- **Enhanced LSP Support**: The JSON format of contract actions enables EVMts LSP to offer direct go-to-definition, natspec comments on hover, and transparent solidity contract imports.
- **Debuggable**: Experience advanced dev tools for logging and time-travel debugging.
- **Highly Extendable**: Crafting custom handlers, listeners, and actionCreators for EVMts is a breeze.
- **Powerful**: Actions are the API used to interact with the formidable EVMts VM, maintaining a consistent and intuitive API across EVMts functionalities.
- **Predictable**: Use of EVMts actions create predictable state management on the client

There are 4 main concepts to understand EVMts and it's action based api

1. Actions
2. ActionCreators
3. ActionHandlers
4. ActionListeners 

# Actions

Actions are JSON serializable objects and the API for interacting with all EVMts features. The roles of action creators and handlers will shed more light on how to use Actions. To start let's look at how they look.

**Example**

Below is an example of a `Contract.read.methodName.call` action that would be used by a `jsonrpc` handler to read balanceOf of a contract

```typescript
{ 
  __type: 'Contract.read.methodName.call',
  __handler: 'eth_call',
  args: ['0x121212121212121212121212'],
  abi: ['function balanceOf(address who) external view returns (uint256 balance)'],
  address: '0x424242424242424242424242',
  chain: {
    id: 10,
  },
}
```

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

## ActionListeners

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

