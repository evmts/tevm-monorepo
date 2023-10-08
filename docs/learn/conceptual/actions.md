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

