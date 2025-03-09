---
"@tevm/memory-client": minor
"@tevm/actions": minor
"@tevm/node": minor
---

Added event handlers to tevmCall family of actions that enable real-time introspection of EVM execution. This powerful new feature allows developers to:

1. Monitor EVM execution step-by-step:
```ts
await client.tevmCall({
  to: contractAddress,
  data: encodeFunctionData({
    abi,
    functionName: 'myFunction',
    args: [arg1, arg2]
  }),
  // Get real-time access to each EVM execution step
  onStep: (step, next) => {
    console.log(`Opcode: ${step.opcode.name}, Stack: ${step.stack.length}`)
    next() // Continue execution
  }
})
```

2. Detect new contract deployments:
```ts
await client.tevmCall({
  data: encodeDeployData(myContract),
  onNewContract: (data, next) => {
    console.log(`New contract deployed at: ${data.address}`)
    next()
  }
})
```

3. Observe call message execution:
```ts
await client.tevmCall({
  to: contractAddress,
  data: encodeFunctionData({...}),
  // Track message calls
  onBeforeMessage: (message, next) => {
    console.log(`Call to ${message.to} with value ${message.value}`)
    next()
  },
  onAfterMessage: (result, next) => {
    console.log(`Call completed with ${result.execResult.executionGasUsed} gas used`)
    next()
  }
})
```

This implementation includes:
- Memory-safe event cleanup to prevent leaks
- Support across all tevmCall variants (tevmCall, tevmContract, tevmDeploy)
- Full TypeScript type safety
- Compatible with JSON-RPC protocol (handlers aren't serialized)
