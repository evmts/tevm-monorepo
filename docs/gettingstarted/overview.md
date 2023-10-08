# Overview

EVMts whether using vanilla js, react, or any other future integrations has only four concepts one needs to understand. After understanding these simple concepts using EVMts becomes very intuitive.

1. Actions
2. ActionCreators
3. Handlers
4. 🚧 Listeners (under construction)

These concepts will all be explained with a simple ERC20.balanceOf contract read

## Actions

EVMts is completely powered by Actions. Actions are simple JSON serializable objects that tell an EVMts handler what to do. This will make more sense after we explain what an action creator and handler are so keep reading.

Actions are useful for the following reasons

**Example**

Below is an example of a `Contract.read.methodName.call` action that would be used by a `jsonrpc` handler to read balanceOf of a contract

```typescript
{ 
  __type: 'Contract.read.methodName.call',
  __handler: 'eth_call',
  // options is empty object since no options were passed
  options: {
    chain: {
      ...chainInfo
    },
    address: '0x424242424242424242424242'
  },
  args: ['0x121212121212121212121212'],
  abi: {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    args: [{
		  constant: true,
		  inputs: [{ name: 'owner', type: 'address' }],
		  name: 'balanceOf',
		  outputs: [{ name: '', type: 'uint256' }],
		  payable: false,
		  stateMutability: 'view',
		  type: 'function',
    }]
  }
}
```

## Action Creators

Actions are never created manually but instead created by action creators. The different types of ActionCreators will be familiar to those familiar with blockchain development.

Types of action creators
- Contracts - Creates event and function related actions
- Wallets - Creates actions to interact with wallets
- Blocks - Creates actions to interact with block data
- Transactions - Creates actions to interact with tx data
- Bridges - Creates actions to interact with bridges
- Rollups - Creates actions to interact with rollups
- Tokens - Creates actions to interact with ERC20 and ERC720 tokens
- ENS - Creates actions to interact with ENS
- Multicall3 - Takes Contract Actions as an argument to interact with multicall3

- **Example**

The above action can be created from a `contract` action creator as follows

```typescript
import {mainnet} from 'evmts/chains'
// EVMts contract creators can be imported directly from solidity files
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const balanceOfAction = ERC20.read.balanceOf.ethCall('0x121212121212121212121212', {
  address: '0x42424242424242424242424242', 
  chain: mainnet
})
console.log(balanceOfAction) // logs the action in the above Action section
```

## Handlers

To use an action you pass it into a handler. The types of handlers are as follows

- rpc handlers - Handles ethereum json rpc actions
- wallet handlers - handles wallet json rpc actions
- http handlers - Handles actions sent over normal http
- encoding/decoding handlers - Handles lower level functionality of encoding/decoding 

All handlers will have a name matching the action name

- **Example**

We can read our balanceOf action using the rpc handler. Note the handlers will always match the name of the action.

```typescript
import {optimism} from 'evmts/chains'
import {ethCallHandler} from 'evmts/handlers'
import {createClient, ethCallHandler} from 'evmts/client'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const client = createClient().add({handlers: [
  ethCallHandler
]})

// jsonRpc.handle is a wrapper around eth_foo json rpc method
// in this case we are passing in a call
const balance = jsonRpc.ethCall(
  ERC20.read.balanceOf.ethCall('0x121212121212121212121212', {
    address: '0x42424242424242424242424242', 
  })
)
```

- **React Example**

Handlers exist for both react and vanilla js. The action creators are interchangable between the two.

```typescript
import {optimism} from 'evmts/chains'
import {jsonRpc} from '@evmts/react'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const rpc = jsonRpc({
  chain: optimism,
  url: 'https://mainnet.optimism.io'
})

const MyComponent = () => {
  const {data: balance, error, loading} = jsonRpc.useHandle(
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

## 🚧 Listeners (under construction)

Listeners are similar to handlers but are event based. Common examples of listeners
- Listening for logs
- Listening for new blocks
- Listening for new rollup safe heads
- Listening for optimistic state updates
- Listening for updates to a specific contracts storage

- **Example**

We can listen to balanceOf updates. It's recomended to use a socket for this but `jsonRpcListener` can also listen with polling.

```typescript
import {optimism} from 'evmts/chains'
import {jsonRpcSocketListener} from 'evmts/listeners'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const rpcListener = jsonRpcSocketListener({
  chain: optimism,
  webSocket: 'wss://eth-mainnet.ws.g.alchemy.com/v2/demo'
})

// jsonRpc.handle is a wrapper around eth_foo json rpc method
// in this case we are passing in a call
const balance = rpcListener.listen(
  ERC20.read.balanceOf.call('0x121212121212121212121212', {
    address: '0x42424242424242424242424242', 
  })
)
```

Listeners can also be used in react with `import {jsonRpcSocketListener} from '@evmts/react/listeners'`

## Advantages of an Action based API

All of EVMts is powered by actions. This API provides an entire host of advantages.

#### Actions are intuitive to use

The entire EVMts API can be used via actions. You never need to remember what API to use you can simply import a `Contract` or any other `actionCreator` and autocomplete yourself to success.

Want to use a contract? Simply import a contract and you can intuitively find your way to the correct action.

#### Actions are maximally code splittable

Class based APIs like ethers.js are very nice to use but lack in ability to code split. Code splittable apis often suffer from losing some of the ergonomics of class based apis. Action based API gives the best of both worlds.

#### Contract actions provide additional LSP support

Because the contract actions simply returns JSON serializable objects while representing contracts, EVMts LSP can take advantage of this to provide features such as:
- go-to-definition taking one directly to the contract definition
- natspec comments on hover
- minimal magic happening behind solidity contract imports

#### Contract actions are easily pluggable and extendable

It's very easy to build custom handlers, listeners, and actionCreators for EVMts
