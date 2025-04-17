# @tevm/client

## 1.0.0-next.141

### Minor Changes

- 2e20a42: feat(actions): Deprecate `createTransaction` parameter and add `addToMempool` and `addToBlockchain` parameters.

  This change makes the API more intuitive when working with transactions:

  - Added `addToMempool`: Add the transaction to mempool (requires manual mining later)
  - Added `addToBlockchain`: Add the transaction to mempool and automatically mine it
  - Deprecated `createTransaction`: Still works but shows warning, use `addToMempool` instead

  This helps address a common issue where users forget to mine transactions after creating them. The `addToBlockchain` parameter automatically forces mining mode to "auto" temporarily to ensure the transaction is immediately included in a block.

### Patch Changes

- Updated dependencies [2e20a42]
  - @tevm/actions@1.0.0-next.141
  - @tevm/decorators@1.0.0-next.141

## 1.0.0-next.140

### Patch Changes

- 3e2bead: Fixed bug with json-rpc tx type being wrong. data should be named input
- Updated dependencies [3e2bead]
- Updated dependencies [7751df4]
  - @tevm/actions@1.0.0-next.140
  - @tevm/decorators@1.0.0-next.140
  - @tevm/node@1.0.0-next.140
  - @tevm/evm@1.0.0-next.140

## 1.0.0-next.139

### Patch Changes

- @tevm/actions@1.0.0-next.139
- @tevm/node@1.0.0-next.139
- @tevm/evm@1.0.0-next.139
- @tevm/decorators@1.0.0-next.139

## 1.0.0-next.134

### Patch Changes

- @tevm/actions@1.0.0-next.134
- @tevm/node@1.0.0-next.134
- @tevm/evm@1.0.0-next.134
- @tevm/decorators@1.0.0-next.134

## 1.0.0-next.133

### Patch Changes

- Updated dependencies [7134c77]
  - @tevm/actions@1.0.0-next.133
  - @tevm/decorators@1.0.0-next.133

## 1.0.0-next.132

### Minor Changes

- 5c1da73: Add event handlers to TevmMine similar to TevmCall. This enables real-time monitoring of mining operations with:

  - `onBlock`: Monitor each newly mined block
  - `onReceipt`: Monitor transaction receipts generated during mining
  - `onLog`: Monitor logs emitted by transactions

  This enhances the observability of the mining process, making it easier to build debugging tools and monitor transaction processing.

### Patch Changes

- bda9ff4: Add `deal` action to TevmActionsApi and `tevmDeal` to MemoryClient for dealing ETH and ERC20 tokens to accounts. Improved test coverage and documentation for the feature.
- Updated dependencies [bda9ff4]
- Updated dependencies [5c1da73]
- Updated dependencies [b6d85c8]
- Updated dependencies [7ceb0c5]
- Updated dependencies [3461670]
  - @tevm/actions@1.0.0-next.132
  - @tevm/decorators@1.0.0-next.132
  - @tevm/contract@1.0.0-next.132
  - @tevm/node@1.0.0-next.132
  - @tevm/evm@1.0.0-next.132
  - @tevm/predeploys@1.0.0-next.132
  - @tevm/common@1.0.0-next.132

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages
- Updated dependencies [e91acbc]
  - @tevm/actions@1.0.0-next.131
  - @tevm/common@1.0.0-next.131
  - @tevm/errors@1.0.0-next.131
  - @tevm/utils@1.0.0-next.131
  - @tevm/node@1.0.0-next.131
  - @tevm/evm@1.0.0-next.131
  - @tevm/contract@1.0.0-next.131
  - @tevm/decorators@1.0.0-next.131
  - @tevm/predeploys@1.0.0-next.131

## 1.0.0-next.130

### Minor Changes

- e962176: Improved performance by persisting fork cache across VM instances:

  - Modified `deepCopy.js` and `shallowCopy.js` to share the fork cache object reference between original and copied state
  - Implemented hierarchical cache lookup: first check main cache, then fork cache, then fetch from remote provider
  - Stores data fetched from remote providers in both caches for future access
  - Eliminated redundant remote provider calls when using cloned VMs
  - Significantly reduced network latency for transaction simulations and gas estimations
  - Maintained complete type safety and backward compatibility
  - Enhanced documentation explaining the fork cache persistence approach
  - Added tests to verify proper cache sharing behavior

### Patch Changes

- @tevm/actions@1.0.0-next.130
- @tevm/evm@1.0.0-next.130
- @tevm/node@1.0.0-next.130
- @tevm/decorators@1.0.0-next.130

## 1.0.0-next.129

### Minor Changes

- edbfc70: Added event handlers to tevmCall family of actions that enable real-time introspection of EVM execution. This powerful new feature allows developers to:

  1. Monitor EVM execution step-by-step:

  ```ts
  await client.tevmCall({
    to: contractAddress,
    data: encodeFunctionData({
      abi,
      functionName: "myFunction",
      args: [arg1, arg2],
    }),
    // Get real-time access to each EVM execution step
    onStep: (step, next) => {
      console.log(`Opcode: ${step.opcode.name}, Stack: ${step.stack.length}`);
      next(); // Continue execution
    },
  });
  ```

  2. Detect new contract deployments:

  ```ts
  await client.tevmCall({
    data: encodeDeployData(myContract),
    onNewContract: (data, next) => {
      console.log(`New contract deployed at: ${data.address}`);
      next();
    },
  });
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

### Patch Changes

- Updated dependencies [edbfc70]
  - @tevm/actions@1.0.0-next.129
  - @tevm/node@1.0.0-next.129
  - @tevm/decorators@1.0.0-next.129

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages
- Updated dependencies [bc0c4a1]
  - @tevm/actions@1.0.0-next.128
  - @tevm/common@1.0.0-next.128
  - @tevm/contract@1.0.0-next.128
  - @tevm/decorators@1.0.0-next.128
  - @tevm/errors@1.0.0-next.128
  - @tevm/evm@1.0.0-next.128
  - @tevm/node@1.0.0-next.128
  - @tevm/predeploys@1.0.0-next.128
  - @tevm/utils@1.0.0-next.128

## 1.0.0-next.127

### Patch Changes

- Updated dependencies [141b5da]
  - @tevm/actions@1.0.0-next.127
  - @tevm/decorators@1.0.0-next.127

## 1.0.0-next.126

### Minor Changes

- b99de65: Added eth_createAccessList and anvil_deal json-rpc requests
  Added MemoryClient.deal action

### Patch Changes

- Updated dependencies [b99de65]
  - @tevm/decorators@1.0.0-next.126
  - @tevm/actions@1.0.0-next.126

## 1.0.0-next.125

### Patch Changes

- Updated dependencies [42590c1]
  - @tevm/actions@1.0.0-next.125
  - @tevm/decorators@1.0.0-next.125

## 1.0.0-next.124

### Patch Changes

- Updated dependencies [d501679]
  - @tevm/actions@1.0.0-next.124
  - @tevm/decorators@1.0.0-next.124
  - @tevm/node@1.0.0-next.124
  - @tevm/evm@1.0.0-next.124

## 1.0.0-next.123

### Patch Changes

- Updated dependencies [7ed32d3]
- Updated dependencies [3419055]
  - @tevm/actions@1.0.0-next.123
  - @tevm/node@1.0.0-next.123
  - @tevm/decorators@1.0.0-next.123

## 1.0.0-next.122

### Patch Changes

- Updated dependencies [96ca3f3]
  - @tevm/actions@1.0.0-next.122
  - @tevm/decorators@1.0.0-next.122

## 1.0.0-next.121

### Patch Changes

- Updated dependencies [3f8119e]
- Updated dependencies [3f8119e]
  - @tevm/actions@1.0.0-next.121
  - @tevm/decorators@1.0.0-next.121

## 1.0.0-next.120

### Patch Changes

- Updated dependencies [34ac999]
- Updated dependencies [34ac999]
  - @tevm/actions@1.0.0-next.120
  - @tevm/node@1.0.0-next.120
  - @tevm/decorators@1.0.0-next.120
  - @tevm/evm@1.0.0-next.120

## 1.0.0-next.119

### Patch Changes

- Updated dependencies [8d58d91]
  - @tevm/actions@1.0.0-next.119
  - @tevm/decorators@1.0.0-next.119

## 1.0.0-next.118

### Patch Changes

- bfba3e7: Updated every dependency in entire tevm monorepo to latest
- Updated dependencies [bfba3e7]
- Updated dependencies [1727e82]
  - @tevm/actions@1.0.0-next.118
  - @tevm/errors@1.0.0-next.118
  - @tevm/utils@1.0.0-next.118
  - @tevm/evm@1.0.0-next.118
  - @tevm/common@1.0.0-next.118
  - @tevm/contract@1.0.0-next.118
  - @tevm/decorators@1.0.0-next.118
  - @tevm/node@1.0.0-next.118
  - @tevm/predeploys@1.0.0-next.118

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake
- Updated dependencies [23bb9d3]
- Updated dependencies [ec30a0e]
- Updated dependencies [23bb9d3]
- Updated dependencies [b53712d]
- Updated dependencies [23bb9d3]
- Updated dependencies [23bb9d3]
- Updated dependencies [23bb9d3]
  - @tevm/procedures@1.0.0-next.117
  - @tevm/errors@1.0.0-next.117
  - @tevm/contract@1.0.0-next.117
  - @tevm/decorators@1.0.0-next.117
  - @tevm/predeploys@1.0.0-next.117
  - @tevm/actions@1.0.0-next.117
  - @tevm/common@1.0.0-next.117
  - @tevm/utils@1.0.0-next.117
  - @tevm/node@1.0.0-next.117
  - @tevm/evm@1.0.0-next.117

## 1.0.0-next.116

### Patch Changes

- Updated dependencies [1879fe0]
  - @tevm/common@1.0.0-next.116
  - @tevm/actions@1.0.0-next.116
  - @tevm/evm@1.0.0-next.116
  - @tevm/node@1.0.0-next.116
  - @tevm/procedures@1.0.0-next.116
  - @tevm/decorators@1.0.0-next.116

## 1.0.0-next.115

### Patch Changes

- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
  - @tevm/common@1.0.0-next.115
  - @tevm/actions@1.0.0-next.115
  - @tevm/evm@1.0.0-next.115
  - @tevm/node@1.0.0-next.115
  - @tevm/procedures@1.0.0-next.115
  - @tevm/decorators@1.0.0-next.115

## 1.0.0-next.113

### Patch Changes

- Updated dependencies [3bac5c8]
  - @tevm/procedures@1.0.0-next.113
  - @tevm/decorators@1.0.0-next.113

## 1.0.0-next.112

### Patch Changes

- Updated dependencies [5942568]
  - @tevm/procedures@1.0.0-next.112
  - @tevm/decorators@1.0.0-next.112

## 1.0.0-next.111

### Patch Changes

- Updated dependencies [bc00e14]
- Updated dependencies [bc00e14]
  - @tevm/actions@1.0.0-next.111
  - @tevm/decorators@1.0.0-next.111
  - @tevm/procedures@1.0.0-next.111

## 1.0.0-next.110

### Patch Changes

- @tevm/actions@1.0.0-next.110
- @tevm/evm@1.0.0-next.110
- @tevm/node@1.0.0-next.110
- @tevm/procedures@1.0.0-next.110
- @tevm/decorators@1.0.0-next.110

## 1.0.0-next.109

### Patch Changes

- 4c9746e: Upgrade all dependencies to latest
- Updated dependencies [da74460]
- Updated dependencies [4c9746e]
  - @tevm/common@1.0.0-next.109
  - @tevm/decorators@1.0.0-next.109
  - @tevm/contract@1.0.0-next.109
  - @tevm/actions@1.0.0-next.109
  - @tevm/errors@1.0.0-next.109
  - @tevm/utils@1.0.0-next.109
  - @tevm/node@1.0.0-next.109
  - @tevm/evm@1.0.0-next.109
  - @tevm/procedures@1.0.0-next.109
  - @tevm/predeploys@1.0.0-next.109

## 1.0.0-next.108

### Patch Changes

- @tevm/actions@1.0.0-next.108
- @tevm/node@1.0.0-next.108
- @tevm/procedures@1.0.0-next.108
- @tevm/decorators@1.0.0-next.108
- @tevm/evm@1.0.0-next.108

## 2.0.0-next.107

### Patch Changes

- Updated dependencies [[`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29)]:
  - @tevm/actions@2.0.0-next.107
  - @tevm/procedures@2.0.0-next.107
  - @tevm/utils@2.0.0-next.107
  - @tevm/decorators@2.0.0-next.107
  - @tevm/common@2.0.0-next.107
  - @tevm/contract@2.0.0-next.107
  - @tevm/evm@2.0.0-next.107
  - @tevm/node@2.0.0-next.107
  - @tevm/predeploys@2.0.0-next.107

## 2.0.0-next.105

### Minor Changes

- [#1370](https://github.com/evmts/tevm-monorepo/pull/1370) [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed tevm/base-client to tevm/node

### Patch Changes

- Updated dependencies [[`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f)]:
  - @tevm/decorators@2.0.0-next.105
  - @tevm/predeploys@2.0.0-next.105
  - @tevm/procedures@2.0.0-next.105
  - @tevm/actions@2.0.0-next.105
  - @tevm/common@2.0.0-next.105
  - @tevm/errors@2.0.0-next.105
  - @tevm/utils@2.0.0-next.105
  - @tevm/node@2.0.0-next.105
  - @tevm/evm@2.0.0-next.105
  - @tevm/contract@2.0.0-next.105

## 2.0.0-next.103

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@2.0.0-next.103
  - @tevm/base-client@2.0.0-next.103
  - @tevm/procedures@2.0.0-next.103
  - @tevm/decorators@2.0.0-next.103
  - @tevm/evm@2.0.0-next.103

## 2.0.0-next.102

### Patch Changes

- Updated dependencies [[`f69b86f`](https://github.com/evmts/tevm-monorepo/commit/f69b86f7c26d519900d224647b1bbc1ebe415a0e)]:
  - @tevm/base-client@2.0.0-next.102
  - @tevm/actions@2.0.0-next.102
  - @tevm/decorators@2.0.0-next.102
  - @tevm/procedures@2.0.0-next.102
  - @tevm/evm@2.0.0-next.102

## 2.0.0-next.101

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@2.0.0-next.101
  - @tevm/base-client@2.0.0-next.101
  - @tevm/procedures@2.0.0-next.101
  - @tevm/decorators@2.0.0-next.101
  - @tevm/evm@2.0.0-next.101

## 1.1.0-next.100

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

- Updated dependencies [[`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5), [`45950f7`](https://github.com/evmts/tevm-monorepo/commit/45950f758ff2a97334cd0edafca3cca656ed8f7c), [`419b19f`](https://github.com/evmts/tevm-monorepo/commit/419b19f4c493636f3624ae9dd474cbade42daa26)]:
  - @tevm/base-client@1.1.0-next.100
  - @tevm/decorators@1.1.0-next.100
  - @tevm/predeploys@1.1.0-next.100
  - @tevm/procedures@1.1.0-next.100
  - @tevm/contract@1.1.0-next.100
  - @tevm/actions@1.1.0-next.100
  - @tevm/common@1.1.0-next.100
  - @tevm/errors@1.1.0-next.100
  - @tevm/utils@1.1.0-next.100
  - @tevm/evm@1.1.0-next.100

## 1.1.0-next.99

### Patch Changes

- Updated dependencies [[`de2a2ab`](https://github.com/evmts/tevm-monorepo/commit/de2a2ab90a262c084eea9d955d544531c41af506), [`a8c810b`](https://github.com/evmts/tevm-monorepo/commit/a8c810b87f682fb3504e6db8a0ace6ef4220e842), [`de2a2ab`](https://github.com/evmts/tevm-monorepo/commit/de2a2ab90a262c084eea9d955d544531c41af506)]:
  - @tevm/procedures@1.1.0-next.99
  - @tevm/actions@1.1.0-next.99
  - @tevm/base-client@1.1.0-next.99
  - @tevm/decorators@1.1.0-next.99
  - @tevm/evm@1.1.0-next.99

## 1.1.0-next.98

### Patch Changes

- Updated dependencies [[`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53), [`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53), [`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53)]:
  - @tevm/actions@1.1.0-next.98
  - @tevm/decorators@1.1.0-next.98
  - @tevm/procedures@1.1.0-next.98

## 1.1.0-next.97

### Patch Changes

- Updated dependencies [[`277ed48`](https://github.com/evmts/tevm-monorepo/commit/277ed48697e1e094af5ee8bed0955c823123570e), [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e)]:
  - @tevm/utils@1.1.0-next.97
  - @tevm/actions@1.1.0-next.97
  - @tevm/base-client@1.1.0-next.97
  - @tevm/common@1.1.0-next.97
  - @tevm/contract@1.1.0-next.97
  - @tevm/decorators@1.1.0-next.97
  - @tevm/evm@1.1.0-next.97
  - @tevm/predeploys@1.1.0-next.97
  - @tevm/procedures@1.1.0-next.97

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

- Updated dependencies [[`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6)]:
  - @tevm/base-client@1.1.0-next.96
  - @tevm/decorators@1.1.0-next.96
  - @tevm/predeploys@1.1.0-next.96
  - @tevm/procedures@1.1.0-next.96
  - @tevm/contract@1.1.0-next.96
  - @tevm/actions@1.1.0-next.96
  - @tevm/common@1.1.0-next.96
  - @tevm/errors@1.1.0-next.96
  - @tevm/utils@1.1.0-next.96
  - @tevm/evm@1.1.0-next.96

## 1.1.0-next.95

### Patch Changes

- Updated dependencies [[`e626b40`](https://github.com/evmts/tevm-monorepo/commit/e626b40d7004e528dabf02f59c34436c9c6667ee)]:
  - @tevm/contract@1.1.0-next.95
  - @tevm/predeploys@1.1.0-next.95
  - @tevm/procedures@1.1.0-next.95
  - @tevm/base-client@1.1.0-next.95
  - @tevm/evm@1.1.0-next.95
  - @tevm/decorators@1.1.0-next.95
  - @tevm/actions@1.1.0-next.95

## 1.1.0-next.94

### Patch Changes

- Updated dependencies [[`9cff1bb`](https://github.com/evmts/tevm-monorepo/commit/9cff1bbb1a5d87eadff5b01b288e5f46732f7c71)]:
  - @tevm/contract@1.1.0-next.94
  - @tevm/predeploys@1.1.0-next.94
  - @tevm/procedures@1.1.0-next.94
  - @tevm/base-client@1.1.0-next.94
  - @tevm/evm@1.1.0-next.94
  - @tevm/decorators@1.1.0-next.94
  - @tevm/actions@1.1.0-next.94

## 1.1.0-next.92

### Patch Changes

- [#1290](https://github.com/evmts/tevm-monorepo/pull/1290) [`254a16a`](https://github.com/evmts/tevm-monorepo/commit/254a16aad38e4017c7621028aa405504d2e38029) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with memory client transport not being strongly typed

- Updated dependencies [[`7af1917`](https://github.com/evmts/tevm-monorepo/commit/7af1917c2cedfed22f62f3e6edf3e6e15a8b7ac8)]:
  - @tevm/utils@1.1.0-next.92
  - @tevm/actions@1.1.0-next.92
  - @tevm/base-client@1.1.0-next.92
  - @tevm/common@1.1.0-next.92
  - @tevm/contract@1.1.0-next.92
  - @tevm/decorators@1.1.0-next.92
  - @tevm/evm@1.1.0-next.92
  - @tevm/predeploys@1.1.0-next.92
  - @tevm/procedures@1.1.0-next.92

## 1.1.0-next.91

### Patch Changes

- Updated dependencies [[`7216932`](https://github.com/evmts/tevm-monorepo/commit/72169323bb89aba7165fcbedae7d024c71664333), [`17dd822`](https://github.com/evmts/tevm-monorepo/commit/17dd82285cb3e2664179e38b62f35509d911f1a0)]:
  - @tevm/utils@1.1.0-next.91
  - @tevm/procedures@1.1.0-next.91
  - @tevm/actions@1.1.0-next.91
  - @tevm/base-client@1.1.0-next.91
  - @tevm/common@1.1.0-next.91
  - @tevm/contract@1.1.0-next.91
  - @tevm/decorators@1.1.0-next.91
  - @tevm/evm@1.1.0-next.91
  - @tevm/predeploys@1.1.0-next.91

## 1.1.0-next.90

### Patch Changes

- Updated dependencies [[`9141ab4`](https://github.com/evmts/tevm-monorepo/commit/9141ab4a767e811f12c77535f9d3259986e825d3), [`9141ab4`](https://github.com/evmts/tevm-monorepo/commit/9141ab4a767e811f12c77535f9d3259986e825d3)]:
  - @tevm/procedures@1.1.0-next.90
  - @tevm/actions@1.1.0-next.90
  - @tevm/decorators@1.1.0-next.90
  - @tevm/base-client@1.1.0-next.90
  - @tevm/evm@1.1.0-next.90

## 1.1.0-next.88

### Minor Changes

- [#1252](https://github.com/evmts/tevm-monorepo/pull/1252) [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented a tree shakable api built on top of viem

### Patch Changes

- Updated dependencies [[`cb2dd84`](https://github.com/evmts/tevm-monorepo/commit/cb2dd844a043fd956ab72b90ec21b80c4f606a64), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`e6f57e8`](https://github.com/evmts/tevm-monorepo/commit/e6f57e8ec4765b0520c850cff92370de50b1cc47), [`0136b52`](https://github.com/evmts/tevm-monorepo/commit/0136b528fade3f557406ee52d24be35cfc2a752c), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60)]:
  - @tevm/evm@1.1.0-next.88
  - @tevm/actions@1.1.0-next.88
  - @tevm/utils@1.1.0-next.88
  - @tevm/decorators@1.1.0-next.88
  - @tevm/contract@1.1.0-next.88
  - @tevm/base-client@1.1.0-next.88
  - @tevm/procedures@1.1.0-next.88
  - @tevm/common@1.1.0-next.88
  - @tevm/predeploys@1.1.0-next.88

## 2.0.0-next.87

### Patch Changes

- Updated dependencies [[`fe67a05`](https://github.com/evmts/tevm-monorepo/commit/fe67a05a49302f9753c60170846fb95295a75396), [`fe67a05`](https://github.com/evmts/tevm-monorepo/commit/fe67a05a49302f9753c60170846fb95295a75396)]:
  - @tevm/procedures@2.0.0-next.87
  - @tevm/decorators@2.0.0-next.87

## 2.0.0-next.86

### Minor Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Added underlying viem options to MemoryClientOptions. Now options like `account` can be passed to the underlying viem client

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

- Updated dependencies [[`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8)]:
  - @tevm/procedures@2.0.0-next.86
  - @tevm/base-client@2.0.0-next.86
  - @tevm/decorators@2.0.0-next.86
  - @tevm/predeploys@2.0.0-next.86
  - @tevm/contract@2.0.0-next.86
  - @tevm/common@2.0.0-next.86
  - @tevm/utils@2.0.0-next.86
  - @tevm/evm@2.0.0-next.86

## 2.0.0-next.85

### Patch Changes

- [#1238](https://github.com/evmts/tevm-monorepo/pull/1238) [`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated jsdoc and test coverage

- Updated dependencies [[`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1), [`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1)]:
  - @tevm/common@2.0.0-next.85
  - @tevm/evm@2.0.0-next.85
  - @tevm/base-client@2.0.0-next.85
  - @tevm/decorators@2.0.0-next.85
  - @tevm/procedures@2.0.0-next.85

## 2.0.0-next.84

### Patch Changes

- [#1234](https://github.com/evmts/tevm-monorepo/pull/1234) [`6595da4`](https://github.com/evmts/tevm-monorepo/commit/6595da4f4db76565057113baebce8e93e1a516f4) Thanks [@roninjin10](https://github.com/roninjin10)! - Add more jsdoc to MemoryClient docs

- Updated dependencies [[`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd)]:
  - @tevm/utils@2.0.0-next.84
  - @tevm/procedures@2.0.0-next.84
  - @tevm/decorators@2.0.0-next.84
  - @tevm/base-client@2.0.0-next.84
  - @tevm/common@2.0.0-next.84
  - @tevm/contract@2.0.0-next.84
  - @tevm/evm@2.0.0-next.84
  - @tevm/predeploys@2.0.0-next.84

## 2.0.0-next.83

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@2.0.0-next.83
  - @tevm/evm@2.0.0-next.83
  - @tevm/procedures@2.0.0-next.83
  - @tevm/decorators@2.0.0-next.83

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

- Updated dependencies [[`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d)]:
  - @tevm/base-client@2.0.0-next.80
  - @tevm/common@2.0.0-next.80
  - @tevm/contract@2.0.0-next.80
  - @tevm/decorators@2.0.0-next.80
  - @tevm/evm@2.0.0-next.80
  - @tevm/predeploys@2.0.0-next.80
  - @tevm/procedures@2.0.0-next.80
  - @tevm/utils@2.0.0-next.80

## 2.0.0-next.79

### Minor Changes

- [#1210](https://github.com/evmts/tevm-monorepo/pull/1210) [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911) Thanks [@roninjin10](https://github.com/roninjin10)! - Add compatability for viem code property

### Patch Changes

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Update all packages for new tevm contract changes"

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- Updated dependencies [[`6469208`](https://github.com/evmts/tevm-monorepo/commit/646920872b48bb48984b104c2e3960d31b4ecb0a), [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d), [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911), [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81)]:
  - @tevm/contract@2.0.0-next.79
  - @tevm/base-client@2.0.0-next.79
  - @tevm/decorators@2.0.0-next.79
  - @tevm/predeploys@2.0.0-next.79
  - @tevm/procedures@2.0.0-next.79
  - @tevm/common@2.0.0-next.79
  - @tevm/utils@2.0.0-next.79
  - @tevm/evm@2.0.0-next.79

## 1.1.0-next.78

### Patch Changes

- Updated dependencies [[`4b5b546`](https://github.com/evmts/tevm-monorepo/commit/4b5b546914362f48e30c088f2eee15d1eba8256d)]:
  - @tevm/procedures@1.1.0-next.78
  - @tevm/decorators@1.1.0-next.78
  - @tevm/base-client@1.1.0-next.78
  - @tevm/evm@1.1.0-next.78

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

- Updated dependencies [[`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d)]:
  - @tevm/base-client@1.1.0-next.77
  - @tevm/common@1.1.0-next.77
  - @tevm/contract@1.1.0-next.77
  - @tevm/decorators@1.1.0-next.77
  - @tevm/evm@1.1.0-next.77
  - @tevm/predeploys@1.1.0-next.77
  - @tevm/procedures@1.1.0-next.77
  - @tevm/utils@1.1.0-next.77

## 1.1.0-next.76

### Patch Changes

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.76
  - @tevm/procedures@1.1.0-next.76
  - @tevm/base-client@1.1.0-next.76
  - @tevm/evm@1.1.0-next.76

## 1.1.0-next.75

### Patch Changes

- Updated dependencies [[`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7)]:
  - @tevm/utils@1.1.0-next.75
  - @tevm/procedures@1.1.0-next.75
  - @tevm/base-client@1.1.0-next.75
  - @tevm/common@1.1.0-next.75
  - @tevm/contract@1.1.0-next.75
  - @tevm/decorators@1.1.0-next.75
  - @tevm/evm@1.1.0-next.75
  - @tevm/predeploys@1.1.0-next.75

## 1.1.0-next.74

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

- Updated dependencies [[`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a)]:
  - @tevm/base-client@1.1.0-next.74
  - @tevm/decorators@1.1.0-next.74
  - @tevm/predeploys@1.1.0-next.74
  - @tevm/procedures@1.1.0-next.74
  - @tevm/contract@1.1.0-next.74
  - @tevm/common@1.1.0-next.74
  - @tevm/utils@1.1.0-next.74
  - @tevm/evm@1.1.0-next.74

## 1.1.0-next.73

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.73
  - @tevm/evm@1.1.0-next.73
  - @tevm/decorators@1.1.0-next.73

## 1.1.0-next.72

### Minor Changes

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Breaking change. default to createTransaction: true if state mutability is payable or nonpayable and continue defaulting to false otherwise. Before all calls do not create a transaction unless createTransaction: true is set.

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more opstack gas information

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

### Patch Changes

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - New opstack related types

- Updated dependencies [[`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32), [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa)]:
  - @tevm/utils@1.1.0-next.72
  - @tevm/base-client@1.1.0-next.72
  - @tevm/common@1.1.0-next.72
  - @tevm/contract@1.1.0-next.72
  - @tevm/decorators@1.1.0-next.72
  - @tevm/evm@1.1.0-next.72
  - @tevm/predeploys@1.1.0-next.72

## 1.1.0-next.71

### Patch Changes

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed and tested type error bug with anvil_mine. Also failed to await a promise.

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed more anvil\_ methods that accepted wrong params shape

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in tevm_setAccount sometimes not padding storage key bytes to 32

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with param type for anvil_setCode not matching anvil

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with anvil_getAutomine returning wrong value

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.71

## 1.1.0-next.70

### Patch Changes

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated viem to latest

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

- Updated dependencies [[`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113)]:
  - @tevm/base-client@1.1.0-next.70
  - @tevm/decorators@1.1.0-next.70
  - @tevm/common@1.1.0-next.70
  - @tevm/utils@1.1.0-next.70
  - @tevm/evm@1.1.0-next.70
  - @tevm/contract@1.1.0-next.70
  - @tevm/predeploys@1.1.0-next.70

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

- Updated dependencies [[`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e)]:
  - @tevm/base-client@1.1.0-next.69
  - @tevm/common@1.1.0-next.69
  - @tevm/contract@1.1.0-next.69
  - @tevm/decorators@1.1.0-next.69
  - @tevm/evm@1.1.0-next.69
  - @tevm/utils@1.1.0-next.69

## 1.1.0-next.68

### Minor Changes

- [#1158](https://github.com/evmts/tevm-monorepo/pull/1158) [`7b4b13e`](https://github.com/evmts/tevm-monorepo/commit/7b4b13e3b56b43956ee1635f0517720aa70fa05c) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed all test actions from MemoryClient

### Patch Changes

- Updated dependencies [[`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d), [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d)]:
  - @tevm/base-client@1.1.0-next.68
  - @tevm/decorators@1.1.0-next.68

## 1.1.0-next.67

### Patch Changes

- Updated dependencies [[`551e000`](https://github.com/evmts/tevm-monorepo/commit/551e0002a9b6112fb409faa6fd5e37ec76a429fd), [`551e000`](https://github.com/evmts/tevm-monorepo/commit/551e0002a9b6112fb409faa6fd5e37ec76a429fd)]:
  - @tevm/base-client@1.1.0-next.67
  - @tevm/decorators@1.1.0-next.67

## 1.1.0-next.66

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.66
  - @tevm/evm@1.1.0-next.62
  - @tevm/decorators@1.1.0-next.64

## 1.1.0-next.65

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.65
  - @tevm/evm@1.1.0-next.62
  - @tevm/decorators@1.1.0-next.64

## 1.1.0-next.64

### Minor Changes

- [#1145](https://github.com/evmts/tevm-monorepo/pull/1145) [`4d287aa`](https://github.com/evmts/tevm-monorepo/commit/4d287aacfbd969ec7e8243135bafc1214ef46352) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for automining.

  ```typescript
  const tevm = createMemoryClient({
    miningConfig: {
      type: "auto",
    },
  });
  ```

### Patch Changes

- Updated dependencies [[`6197cba`](https://github.com/evmts/tevm-monorepo/commit/6197cba905cf0445013ce8c20a67a0b04321e8bd), [`4d287aa`](https://github.com/evmts/tevm-monorepo/commit/4d287aacfbd969ec7e8243135bafc1214ef46352)]:
  - @tevm/base-client@1.1.0-next.64
  - @tevm/decorators@1.1.0-next.64

## 1.1.0-next.63

### Patch Changes

- [#1143](https://github.com/evmts/tevm-monorepo/pull/1143) [`b3d1468`](https://github.com/evmts/tevm-monorepo/commit/b3d1468c06d254b6ccad2df2d7f51231489c6000) Thanks [@roninjin10](https://github.com/roninjin10)! - Made major improvements to tevm performance

  before: 2.38s
  after: 0.83s

  before: 6.69s
  after: 0.683s

  before: 8.42s
  after: 0.219s

  before: 4.07s
  after: 0.01s

- Updated dependencies [[`b3d1468`](https://github.com/evmts/tevm-monorepo/commit/b3d1468c06d254b6ccad2df2d7f51231489c6000)]:
  - @tevm/base-client@1.1.0-next.63
  - @tevm/decorators@1.1.0-next.62
  - @tevm/evm@1.1.0-next.62

## 1.1.0-next.62

### Minor Changes

- [#1136](https://github.com/evmts/tevm-monorepo/pull/1136) [`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2) Thanks [@roninjin10](https://github.com/roninjin10)! - Added multicall3 on genesis to tevm devnet

### Patch Changes

- [#1136](https://github.com/evmts/tevm-monorepo/pull/1136) [`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where the chain was not getting passed into memory client if defaulting to tevmDefault

- [#1136](https://github.com/evmts/tevm-monorepo/pull/1136) [`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with not handling an error in estimateGas"

- Updated dependencies [[`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2), [`efc5998`](https://github.com/evmts/tevm-monorepo/commit/efc5998db8b0f90cd68e6d7fc906826a4b55951c)]:
  - @tevm/base-client@1.1.0-next.62
  - @tevm/common@1.1.0-next.62
  - @tevm/contract@1.1.0-next.62
  - @tevm/decorators@1.1.0-next.62
  - @tevm/evm@1.1.0-next.62

## 1.1.0-next.61

### Patch Changes

- Updated dependencies [[`09e9a22`](https://github.com/evmts/tevm-monorepo/commit/09e9a22eecf8ccbdf97f5e80f94857a74bd4f82d)]:
  - @tevm/base-client@1.1.0-next.61
  - @tevm/decorators@1.1.0-next.61

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

- Updated dependencies [[`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6)]:
  - @tevm/base-client@1.1.0-next.60
  - @tevm/common@1.1.0-next.60
  - @tevm/contract@1.1.0-next.60
  - @tevm/decorators@1.1.0-next.60
  - @tevm/evm@1.1.0-next.60
  - @tevm/utils@1.1.0-next.60

## 1.1.0-next.59

### Patch Changes

- [#1118](https://github.com/evmts/tevm-monorepo/pull/1118) [`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with block number block tags not being properly decoded to a bigint

- [#1118](https://github.com/evmts/tevm-monorepo/pull/1118) [`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82) Thanks [@roninjin10](https://github.com/roninjin10)! - [BREAKING] Removed eip hardfork and chain options in favor of common

- Updated dependencies [[`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82)]:
  - @tevm/base-client@1.1.0-next.59
  - @tevm/common@1.1.0-next.59
  - @tevm/evm@1.1.0-next.59
  - @tevm/decorators@1.1.0-next.59

## 1.1.0-next.58

### Minor Changes

- [#1114](https://github.com/evmts/tevm-monorepo/pull/1114) [`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new JSON-RPC endpoints eth_getBlockByHash, eth_getBlockByNumber, eth_getBlockTransactionCountByHash, eth_getBlockTransactionCountByNumber, eth_getTransactionByHash, eth_getTransactionByBlockHashAndIndex, eth_getTransactionByBlockNumberAndIndex, and eth_blobBaseFee

### Patch Changes

- [#1114](https://github.com/evmts/tevm-monorepo/pull/1114) [`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27) Thanks [@roninjin10](https://github.com/roninjin10)! - Added verification tests to Viem PublicActions getEnsAvatar, getEnsName, getEnsResolver, getEnsText, , getTransactions, getTransactionConfirmations

- Updated dependencies [[`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27), [`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27)]:
  - @tevm/common@1.1.0-next.58
  - @tevm/base-client@1.1.0-next.58
  - @tevm/decorators@1.1.0-next.58

## 1.1.0-next.57

### Minor Changes

- [#1112](https://github.com/evmts/tevm-monorepo/pull/1112) [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59) Thanks [@roninjin10](https://github.com/roninjin10)! - Breaking: Removed the chainId property in favor of `TevmChain` from `@tevm/common`. TevmChain extends ViemChain and ethereumjs Common for a common interface for specifying chain/common info

- [#1112](https://github.com/evmts/tevm-monorepo/pull/1112) [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for the customCrypto option to @tevm/common and @tevm/base-client. This allows kzg to be passed for 4844 supports

### Patch Changes

- Updated dependencies [[`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59), [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59), [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59)]:
  - @tevm/decorators@1.1.0-next.57
  - @tevm/base-client@1.1.0-next.57
  - @tevm/common@1.1.0-next.57
  - @tevm/evm@1.1.0-next.57

## 1.1.0-next.56

### Patch Changes

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/contract@1.1.0-next.56
  - @tevm/decorators@1.1.0-next.56
  - @tevm/base-client@1.1.0-next.56
  - @tevm/evm@1.1.0-next.56

## 1.1.0-next.55

### Patch Changes

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.55
  - @tevm/base-client@1.1.0-next.55
  - @tevm/evm@1.1.0-next.55

## 1.1.0-next.54

### Patch Changes

- [#1095](https://github.com/evmts/tevm-monorepo/pull/1095) [`f04be52`](https://github.com/evmts/tevm-monorepo/commit/f04be524126dde2d1642e53af6ab54c3b42d9cf7) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed storage keys of access list to be prefixed with 0x

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.54

## 1.1.0-next.53

### Minor Changes

- [#1093](https://github.com/evmts/tevm-monorepo/pull/1093) [`db1fe77`](https://github.com/evmts/tevm-monorepo/commit/db1fe776b0e0f0f2ccd5421109e9ec8b6bb78eff) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for generating access lists

### Patch Changes

- [#1092](https://github.com/evmts/tevm-monorepo/pull/1092) [`214a814`](https://github.com/evmts/tevm-monorepo/commit/214a81453d7a4dab647e7c1f91fa4ada3d3939da) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where eth_getBalance which previously was implemented for block tag 'pending' was not updated. Now eth_getBalance works for all block tags except pending.

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.53

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/base-client@1.1.0-next.52
  - @tevm/contract@1.1.0-next.52
  - @tevm/decorators@1.1.0-next.52
  - @tevm/evm@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52

## 1.1.0-next.51

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.51
  - @tevm/evm@1.1.0-next.50
  - @tevm/decorators@1.1.0-next.50

## 1.1.0-next.50

### Patch Changes

- Updated dependencies []:
  - @tevm/decorators@1.1.0-next.50
  - @tevm/base-client@1.1.0-next.50
  - @tevm/evm@1.1.0-next.50

## 1.1.0-next.49

### Patch Changes

- Updated dependencies [[`a6655fc`](https://github.com/evmts/tevm-monorepo/commit/a6655fc2414d06b3bd2caf72f88ec2ccff20a075)]:
  - @tevm/base-client@1.1.0-next.49
  - @tevm/decorators@1.1.0-next.49
  - @tevm/evm@1.1.0-next.47

## 1.1.0-next.48

### Minor Changes

- [#1067](https://github.com/evmts/tevm-monorepo/pull/1067) [`dad4eb0`](https://github.com/evmts/tevm-monorepo/commit/dad4eb0025c68be4b1f3177a7726e0e8d55a4c8c) Thanks [@roninjin10](https://github.com/roninjin10)! - [BREAKING] Implemented MemoryClient as a viem client

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/base-client@1.1.0-next.47
  - @tevm/contract@1.1.0-next.47
  - @tevm/decorators@1.1.0-next.47
  - @tevm/evm@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47

## 1.1.0-next.46

### Minor Changes

- [#1062](https://github.com/evmts/tevm-monorepo/pull/1062) [`d77e373`](https://github.com/evmts/tevm-monorepo/commit/d77e373694960e268a4b56a94dea676911ec0af1) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployHandler to tevm

### Patch Changes

- [#1057](https://github.com/evmts/tevm-monorepo/pull/1057) [`2a7e1db`](https://github.com/evmts/tevm-monorepo/commit/2a7e1db74c68f8e803026b95a1ce957445db1388) Thanks [@roninjin10](https://github.com/roninjin10)! - Optimized performance of forking

- Updated dependencies [[`c0c9e30`](https://github.com/evmts/tevm-monorepo/commit/c0c9e302c6900ed9ad31c50667813d35dc5366e9), [`d77e373`](https://github.com/evmts/tevm-monorepo/commit/d77e373694960e268a4b56a94dea676911ec0af1), [`2a7e1db`](https://github.com/evmts/tevm-monorepo/commit/2a7e1db74c68f8e803026b95a1ce957445db1388)]:
  - @tevm/base-client@1.1.0-next.46
  - @tevm/decorators@1.1.0-next.46
  - @tevm/evm@1.1.0-next.46

## 1.1.0-next.45

### Minor Changes

- [#1036](https://github.com/evmts/tevm-monorepo/pull/1036) [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new traceConfig option to call, script, and contract methods to optionally return a trace

### Patch Changes

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- Updated dependencies [[`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8), [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/decorators@1.1.0-next.45
  - @tevm/base-client@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45
  - @tevm/evm@1.1.0-next.45
  - @tevm/contract@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.0.0-next.42
  - @tevm/decorators@1.0.0-next.42

## 1.0.0-next.41

### Minor Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `ready()` method. The promise resolves when BaseClient or any client extending it is ready to accept requests

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] Removed the chainId property in favor of a getChainId property. Removed vm property in favor of a getVm property. These changes allow the tevm memory client and base client to be instanciated syncronously.

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [BREAKING] Removed requestBulk and request in favor of send and sendBulk. Added back a new request method that is now EIP-1193 compatible request fn based on Viem types.

- [#973](https://github.com/evmts/tevm-monorepo/pull/973) [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new JSON-RPC support

  - eth_coinbase
  - eth_sendTransaction
  - eth_mining (always false for now)
  - eth_syncing (always false for now)
  - anvil_setCode hardhat_setCode ganache_setCode
  - anvil_setBalance hardhat_setBalance ganache_setBalance
  - anvil_setChainId hardhat_setChainId ganache_setChainId
  - anvil_setNonce hardhat_setNonce ganache_setNonce

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Added EIP-1193 eventemitter support

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] Made both createMemoryClient and createBaseClient synchronous

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Added EIP-1193 request fn support

### Patch Changes

- Updated dependencies [[`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619)]:
  - @tevm/base-client@1.0.0-next.41
  - @tevm/decorators@1.0.0-next.41

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a), [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/base-client@1.0.0-next.40
  - @tevm/utils@1.0.0-next.40
  - @tevm/contract@1.0.0-next.40
  - @tevm/decorators@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/base-client@1.0.0-next.39
  - @tevm/decorators@1.0.0-next.39
  - @tevm/contract@1.0.0-next.39
  - @tevm/utils@1.0.0-next.39

## 1.0.0-next.38

### Patch Changes

- [#940](https://github.com/evmts/tevm-monorepo/pull/940) [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with JSON-RPC not correctly using fork urls in action handlers

- [#940](https://github.com/evmts/tevm-monorepo/pull/940) [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with proxy mode not correctly forwarding it's forkUrl to other tevm methods

- [#940](https://github.com/evmts/tevm-monorepo/pull/940) [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug preventing eth_call from working because it was calling tevm_call instead

- Updated dependencies [[`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc), [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc)]:
  - @tevm/procedures@1.0.0-next.38

## 1.0.0-next.37

### Minor Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/vm package to wrap the ethereumjs vm with a TevmVm class that handles custom tevm functionality

### Patch Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with load storage incorrectly hashing storage value

- Updated dependencies [[`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888), [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888)]:
  - @tevm/actions@1.0.0-next.37
  - @tevm/procedures@1.0.0-next.37
  - @tevm/vm@1.0.0-next.37

## 1.0.0-next.34

### Patch Changes

- Updated dependencies [[`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d), [`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d)]:
  - @tevm/actions@1.0.0-next.34
  - @tevm/contract@1.0.0-next.34
  - @tevm/procedures@1.0.0-next.34

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

### Patch Changes

- Updated dependencies [[`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73)]:
  - @tevm/procedures@1.0.0-next.33
  - @tevm/actions@1.0.0-next.33

## 1.0.0-next.32

### Patch Changes

- [#817](https://github.com/evmts/tevm-monorepo/pull/817) [`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where some supported methods such as eth_signTransaction were falsely being filtered as unsupported methods by some tevm clients

- Updated dependencies [[`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360)]:
  - @tevm/procedures@1.0.0-next.32
  - @tevm/actions@1.0.0-next.31

## 1.0.0-next.31

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@1.0.0-next.31
  - @tevm/procedures@1.0.0-next.31

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

### Patch Changes

- Updated dependencies [[`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56)]:
  - @tevm/procedures@1.0.0-next.30
  - @tevm/actions@1.0.0-next.30

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/actions@1.0.0-next.28
  - @tevm/contract@1.0.0-next.28
  - @tevm/errors@1.0.0-next.28
  - @tevm/jsonrpc@1.0.0-next.28
  - @tevm/procedures@1.0.0-next.28

## 1.0.0-next.26

### Minor Changes

- [#904](https://github.com/evmts/tevm-monorepo/pull/904) [`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth_accounts eth_sign and eth_signTransaction JSON-RPC support. Added ethAccounts ethSign and ethSignTransaction actions. Added `accounts` prop to tevm client. The accounts used are the test accounts that are also used by ganache anvil and hardhat

### Patch Changes

- Updated dependencies [[`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d)]:
  - @tevm/procedures@1.0.0-next.26
  - @tevm/actions@1.0.0-next.26

## 1.0.0-next.25

### Minor Changes

- [#888](https://github.com/evmts/tevm-monorepo/pull/888) [`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for eth_call JSON-RPC and the matching client.eth.call action

### Patch Changes

- Updated dependencies [[`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116)]:
  - @tevm/procedures@1.0.0-next.25
  - @tevm/actions@1.0.0-next.25

## 1.0.0-next.24

### Minor Changes

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed gasLimit to gas in all params to be more consistent with ethereum spec

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ethCall support to all clients

- [#865](https://github.com/evmts/tevm-monorepo/pull/865) [`1056dbdf11533d1bcb402ff506194b381b1dd70c`](https://github.com/evmts/tevm-monorepo/commit/1056dbdf11533d1bcb402ff506194b381b1dd70c) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more options to TevmMemoryRouterOptions including

  - hardfork to set hardfork
  - eips to set custom eips
  - profiler options to turn profiler on or off

### Patch Changes

- Updated dependencies [[`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d)]:
  - @tevm/actions@1.0.0-next.24
  - @tevm/procedures@1.0.0-next.24

## 1.0.0-next.23

### Minor Changes

- [#821](https://github.com/evmts/tevm-monorepo/pull/821) [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Added Load State and Dump State to the API.

  These handlers allow one to read and write the entire tevm state similar to [load state and dump state in anvil](https://book.getfoundry.sh/reference/cli/anvil). This can be used to persist the state on disk or browser cache

### Patch Changes

- [#837](https://github.com/evmts/tevm-monorepo/pull/837) [`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed createTevm createMemoryClient

- [#837](https://github.com/evmts/tevm-monorepo/pull/837) [`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed the name of import('@tevm/memory-client').Tevm to MemoryTevm. This disambigouates it from the import('@tevm/actions-types').Tevm type that it extends.

- [#837](https://github.com/evmts/tevm-monorepo/pull/837) [`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm to not proxy any json rpc requests it doesn't support. Proxying creates confusion because some methods operate off of the tevm state and others may be using the RPC state creating confusing mismatches. This means for now all unsupported rpc methods to a MemoryTevm will throw.

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`de81ac31460bb642dad401571ad3c1d81bdbef2d`](https://github.com/evmts/tevm-monorepo/commit/de81ac31460bb642dad401571ad3c1d81bdbef2d), [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539), [`37b936fd4a8095cd79875f5f1ca43f09442e653f`](https://github.com/evmts/tevm-monorepo/commit/37b936fd4a8095cd79875f5f1ca43f09442e653f)]:
  - @tevm/jsonrpc@1.0.0-next.23
  - @tevm/actions@1.0.0-next.23
  - @tevm/contract@1.0.0-next.23
  - @tevm/errors@1.0.0-next.23
  - @tevm/procedures@1.0.0-next.23

## 1.0.0-next.22

### Patch Changes

- Updated dependencies [[`8b3218b1`](https://github.com/evmts/tevm-monorepo/commit/8b3218b129ed43cf173a369cbe6b636365748e77), [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80), [`3b5f6729`](https://github.com/evmts/tevm-monorepo/commit/3b5f67291550b590dda16471059a05bd10fe324d), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`98d76506`](https://github.com/evmts/tevm-monorepo/commit/98d76506e5947678eb34127dcc6e4da7fa13cb68)]:
  - @tevm/vm@1.0.0-next.22
  - @tevm/viem@1.0.0-next.22
  - @tevm/contract@1.0.0-next.22
