# @tevm/client

## 1.0.0-next.144

### Patch Changes

- Updated dependencies [93c7b32]
- Updated dependencies [93c7b32]
  - @tevm/txpool@1.0.0-next.144

## 1.0.0-next.143

### Patch Changes

- Updated dependencies [0a2f876]
  - @tevm/vm@1.0.0-next.143
  - @tevm/txpool@1.0.0-next.143

## 1.0.0-next.142

### Patch Changes

- 407646e: BUmp every package
- Updated dependencies [407646e]
  - @tevm/address@1.0.0-next.142
  - @tevm/block@1.0.0-next.142
  - @tevm/blockchain@1.0.0-next.142
  - @tevm/common@1.0.0-next.142
  - @tevm/evm@1.0.0-next.142
  - @tevm/jsonrpc@1.0.0-next.142
  - @tevm/logger@1.0.0-next.142
  - @tevm/predeploys@1.0.0-next.142
  - @tevm/receipt-manager@1.0.0-next.142
  - @tevm/state@1.0.0-next.142
  - @tevm/sync-storage-persister@1.0.0-next.142
  - @tevm/tx@1.0.0-next.142
  - @tevm/txpool@1.0.0-next.142
  - @tevm/utils@1.0.0-next.142
  - @tevm/vm@1.0.0-next.142

## 1.0.0-next.140

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.140
- @tevm/evm@1.0.0-next.140
- @tevm/sync-storage-persister@1.0.0-next.140
- @tevm/txpool@1.0.0-next.140
- @tevm/vm@1.0.0-next.140

## 1.0.0-next.139

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.139
- @tevm/evm@1.0.0-next.139
- @tevm/sync-storage-persister@1.0.0-next.139
- @tevm/txpool@1.0.0-next.139
- @tevm/vm@1.0.0-next.139

## 1.0.0-next.134

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.134
- @tevm/evm@1.0.0-next.134
- @tevm/sync-storage-persister@1.0.0-next.134
- @tevm/txpool@1.0.0-next.134
- @tevm/vm@1.0.0-next.134

## 1.0.0-next.132

### Patch Changes

- 7ceb0c5: Added missing jsdoc to all packages
- Updated dependencies [7ceb0c5]
  - @tevm/sync-storage-persister@1.0.0-next.132
  - @tevm/blockchain@1.0.0-next.132
  - @tevm/logger@1.0.0-next.132
  - @tevm/block@1.0.0-next.132
  - @tevm/state@1.0.0-next.132
  - @tevm/vm@1.0.0-next.132
  - @tevm/evm@1.0.0-next.132
  - @tevm/receipt-manager@1.0.0-next.132
  - @tevm/txpool@1.0.0-next.132
  - @tevm/predeploys@1.0.0-next.132
  - @tevm/common@1.0.0-next.132

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages
- Updated dependencies [e91acbc]
  - @tevm/common@1.0.0-next.131
  - @tevm/state@1.0.0-next.131
  - @tevm/utils@1.0.0-next.131
  - @tevm/evm@1.0.0-next.131
  - @tevm/vm@1.0.0-next.131
  - @tevm/address@1.0.0-next.131
  - @tevm/block@1.0.0-next.131
  - @tevm/blockchain@1.0.0-next.131
  - @tevm/jsonrpc@1.0.0-next.131
  - @tevm/logger@1.0.0-next.131
  - @tevm/predeploys@1.0.0-next.131
  - @tevm/receipt-manager@1.0.0-next.131
  - @tevm/sync-storage-persister@1.0.0-next.131
  - @tevm/tx@1.0.0-next.131
  - @tevm/txpool@1.0.0-next.131

## 1.0.0-next.130

### Patch Changes

- Updated dependencies [e962176]
  - @tevm/state@1.0.0-next.130
  - @tevm/evm@1.0.0-next.130
  - @tevm/sync-storage-persister@1.0.0-next.130
  - @tevm/txpool@1.0.0-next.130
  - @tevm/vm@1.0.0-next.130

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

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages
- Updated dependencies [bc0c4a1]
  - @tevm/address@1.0.0-next.128
  - @tevm/block@1.0.0-next.128
  - @tevm/blockchain@1.0.0-next.128
  - @tevm/common@1.0.0-next.128
  - @tevm/evm@1.0.0-next.128
  - @tevm/jsonrpc@1.0.0-next.128
  - @tevm/logger@1.0.0-next.128
  - @tevm/predeploys@1.0.0-next.128
  - @tevm/receipt-manager@1.0.0-next.128
  - @tevm/state@1.0.0-next.128
  - @tevm/sync-storage-persister@1.0.0-next.128
  - @tevm/tx@1.0.0-next.128
  - @tevm/txpool@1.0.0-next.128
  - @tevm/utils@1.0.0-next.128
  - @tevm/vm@1.0.0-next.128

## 1.0.0-next.124

### Patch Changes

- @tevm/blockchain@1.0.0-next.118
- @tevm/state@1.0.0-next.124
- @tevm/evm@1.0.0-next.124
- @tevm/sync-storage-persister@1.0.0-next.124
- @tevm/txpool@1.0.0-next.124
- @tevm/vm@1.0.0-next.124

## 1.0.0-next.123

### Patch Changes

- 7ed32d3: Fixed bug with anvil_impersonateAccount woudln't properly throw an error for invalid addresses

## 1.0.0-next.120

### Patch Changes

- Updated dependencies [34ac999]
  - @tevm/vm@1.0.0-next.120
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/state@1.0.0-next.120
  - @tevm/txpool@1.0.0-next.120
  - @tevm/evm@1.0.0-next.120
  - @tevm/sync-storage-persister@1.0.0-next.120

## 1.0.0-next.118

### Patch Changes

- Updated dependencies [bfba3e7]
  - @tevm/jsonrpc@1.0.0-next.118
  - @tevm/logger@1.0.0-next.118
  - @tevm/state@1.0.0-next.118
  - @tevm/utils@1.0.0-next.118
  - @tevm/evm@1.0.0-next.118
  - @tevm/vm@1.0.0-next.118
  - @tevm/address@1.0.0-next.118
  - @tevm/block@1.0.0-next.118
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/common@1.0.0-next.118
  - @tevm/predeploys@1.0.0-next.118
  - @tevm/receipt-manager@1.0.0-next.118
  - @tevm/sync-storage-persister@1.0.0-next.118
  - @tevm/tx@1.0.0-next.118
  - @tevm/txpool@1.0.0-next.118

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake
- Updated dependencies [5ff4b12]
- Updated dependencies [23bb9d3]
- Updated dependencies [b53712d]
- Updated dependencies [23bb9d3]
  - @tevm/address@1.0.0-next.117
  - @tevm/state@1.0.0-next.117
  - @tevm/sync-storage-persister@1.0.0-next.117
  - @tevm/receipt-manager@1.0.0-next.117
  - @tevm/blockchain@1.0.0-next.117
  - @tevm/predeploys@1.0.0-next.117
  - @tevm/jsonrpc@1.0.0-next.117
  - @tevm/common@1.0.0-next.117
  - @tevm/logger@1.0.0-next.117
  - @tevm/txpool@1.0.0-next.117
  - @tevm/block@1.0.0-next.117
  - @tevm/utils@1.0.0-next.117
  - @tevm/evm@1.0.0-next.117
  - @tevm/tx@1.0.0-next.117
  - @tevm/vm@1.0.0-next.117

## 1.0.0-next.116

### Patch Changes

- Updated dependencies [1879fe0]
  - @tevm/common@1.0.0-next.116
  - @tevm/block@1.0.0-next.116
  - @tevm/blockchain@1.0.0-next.116
  - @tevm/evm@1.0.0-next.116
  - @tevm/receipt-manager@1.0.0-next.116
  - @tevm/state@1.0.0-next.116
  - @tevm/txpool@1.0.0-next.116
  - @tevm/vm@1.0.0-next.116
  - @tevm/sync-storage-persister@1.0.0-next.116

## 1.0.0-next.115

### Patch Changes

- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
  - @tevm/common@1.0.0-next.115
  - @tevm/block@1.0.0-next.115
  - @tevm/blockchain@1.0.0-next.115
  - @tevm/evm@1.0.0-next.115
  - @tevm/receipt-manager@1.0.0-next.115
  - @tevm/state@1.0.0-next.115
  - @tevm/txpool@1.0.0-next.115
  - @tevm/vm@1.0.0-next.115
  - @tevm/sync-storage-persister@1.0.0-next.115

## 1.0.0-next.110

### Patch Changes

- Updated dependencies [19370ed]
  - @tevm/blockchain@1.0.0-next.110
  - @tevm/evm@1.0.0-next.110
  - @tevm/receipt-manager@1.0.0-next.110
  - @tevm/txpool@1.0.0-next.110
  - @tevm/vm@1.0.0-next.110

## 1.0.0-next.109

### Patch Changes

- 4c9746e: Upgrade all dependencies to latest
- Updated dependencies [da74460]
- Updated dependencies [4c9746e]
  - @tevm/common@1.0.0-next.109
  - @tevm/blockchain@1.0.0-next.109
  - @tevm/address@1.0.0-next.109
  - @tevm/jsonrpc@1.0.0-next.109
  - @tevm/logger@1.0.0-next.109
  - @tevm/state@1.0.0-next.109
  - @tevm/utils@1.0.0-next.109
  - @tevm/evm@1.0.0-next.109
  - @tevm/tx@1.0.0-next.109
  - @tevm/vm@1.0.0-next.109
  - @tevm/block@1.0.0-next.109
  - @tevm/receipt-manager@1.0.0-next.109
  - @tevm/txpool@1.0.0-next.109
  - @tevm/predeploys@1.0.0-next.109
  - @tevm/sync-storage-persister@1.0.0-next.109

## 1.0.0-next.108

### Patch Changes

- @tevm/blockchain@0.0.0-next.107
- @tevm/state@1.0.0-next.108
- @tevm/evm@1.0.0-next.108
- @tevm/sync-storage-persister@1.0.0-next.108
- @tevm/txpool@1.0.0-next.108
- @tevm/vm@1.0.0-next.108

## 2.0.0-next.107

### Patch Changes

- Updated dependencies [[`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29)]:
  - @tevm/utils@2.0.0-next.107
  - @tevm/address@2.0.0-next.107
  - @tevm/block@2.0.0-next.107
  - @tevm/blockchain@2.0.0-next.107
  - @tevm/common@2.0.0-next.107
  - @tevm/evm@2.0.0-next.107
  - @tevm/predeploys@2.0.0-next.107
  - @tevm/receipt-manager@2.0.0-next.107
  - @tevm/state@2.0.0-next.107
  - @tevm/tx@2.0.0-next.107
  - @tevm/txpool@2.0.0-next.107
  - @tevm/vm@2.0.0-next.107
  - @tevm/sync-storage-persister@2.0.0-next.107

## 2.0.0-next.105

### Minor Changes

- [#1370](https://github.com/evmts/tevm-monorepo/pull/1370) [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed tevm/base-client to tevm/node

### Patch Changes

- Updated dependencies [[`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f), [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f)]:
  - @tevm/state@2.0.0-next.105
  - @tevm/blockchain@2.0.0-next.105
  - @tevm/predeploys@2.0.0-next.105
  - @tevm/address@2.0.0-next.105
  - @tevm/common@2.0.0-next.105
  - @tevm/utils@2.0.0-next.105
  - @tevm/evm@2.0.0-next.105
  - @tevm/sync-storage-persister@2.0.0-next.105
  - @tevm/txpool@2.0.0-next.105
  - @tevm/vm@2.0.0-next.105
  - @tevm/receipt-manager@2.0.0-next.105
  - @tevm/block@2.0.0-next.105
  - @tevm/tx@2.0.0-next.105

## 2.0.0-next.103

### Patch Changes

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.103
  - @tevm/evm@2.0.0-next.103
  - @tevm/sync-storage-persister@2.0.0-next.103
  - @tevm/txpool@2.0.0-next.103
  - @tevm/vm@2.0.0-next.103

## 2.0.0-next.102

### Patch Changes

- [#1338](https://github.com/evmts/tevm-monorepo/pull/1338) [`f69b86f`](https://github.com/evmts/tevm-monorepo/commit/f69b86f7c26d519900d224647b1bbc1ebe415a0e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where unused client option was still on typescript type

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.102
  - @tevm/evm@2.0.0-next.102
  - @tevm/sync-storage-persister@2.0.0-next.102
  - @tevm/txpool@2.0.0-next.102
  - @tevm/vm@2.0.0-next.102

## 2.0.0-next.101

### Patch Changes

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.101
  - @tevm/evm@2.0.0-next.101
  - @tevm/sync-storage-persister@2.0.0-next.101
  - @tevm/txpool@2.0.0-next.101
  - @tevm/vm@2.0.0-next.101

## 1.1.0-next.100

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

- Updated dependencies [[`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131), [`1028d01`](https://github.com/evmts/tevm-monorepo/commit/1028d01f546938f16db73f012a33626cc71fa9ca), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131)]:
  - @tevm/sync-storage-persister@1.1.0-next.100
  - @tevm/receipt-manager@1.1.0-next.100
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/predeploys@1.1.0-next.100
  - @tevm/address@1.1.0-next.100
  - @tevm/jsonrpc@1.1.0-next.100
  - @tevm/common@1.1.0-next.100
  - @tevm/logger@1.1.0-next.100
  - @tevm/txpool@1.1.0-next.100
  - @tevm/block@1.1.0-next.100
  - @tevm/state@1.1.0-next.100
  - @tevm/utils@1.1.0-next.100
  - @tevm/evm@1.1.0-next.100
  - @tevm/tx@1.1.0-next.100
  - @tevm/vm@1.1.0-next.100

## 1.1.0-next.99

### Minor Changes

- [#1312](https://github.com/evmts/tevm-monorepo/pull/1312) [`a8c810b`](https://github.com/evmts/tevm-monorepo/commit/a8c810b87f682fb3504e6db8a0ace6ef4220e842) Thanks [@roninjin10](https://github.com/roninjin10)! - Add deepCopy method to BaseClient ReceiptManager and TxPool

### Patch Changes

- Updated dependencies [[`a8c810b`](https://github.com/evmts/tevm-monorepo/commit/a8c810b87f682fb3504e6db8a0ace6ef4220e842), [`c71445a`](https://github.com/evmts/tevm-monorepo/commit/c71445a1aa729f079737ff8e53bc8b39cb70d37b)]:
  - @tevm/receipt-manager@1.1.0-next.99
  - @tevm/txpool@1.1.0-next.99
  - @tevm/blockchain@1.1.0-next.99
  - @tevm/evm@1.1.0-next.99
  - @tevm/vm@1.1.0-next.99

## 1.1.0-next.97

### Patch Changes

- Updated dependencies [[`277ed48`](https://github.com/evmts/tevm-monorepo/commit/277ed48697e1e094af5ee8bed0955c823123570e), [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e)]:
  - @tevm/utils@1.1.0-next.97
  - @tevm/address@1.1.0-next.97
  - @tevm/block@1.1.0-next.97
  - @tevm/blockchain@1.1.0-next.97
  - @tevm/common@1.1.0-next.97
  - @tevm/evm@1.1.0-next.97
  - @tevm/predeploys@1.1.0-next.97
  - @tevm/receipt-manager@1.1.0-next.97
  - @tevm/state@1.1.0-next.97
  - @tevm/tx@1.1.0-next.97
  - @tevm/txpool@1.1.0-next.97
  - @tevm/vm@1.1.0-next.97
  - @tevm/sync-storage-persister@1.1.0-next.97

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

- Updated dependencies [[`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6)]:
  - @tevm/sync-storage-persister@1.1.0-next.96
  - @tevm/receipt-manager@1.1.0-next.96
  - @tevm/blockchain@1.1.0-next.96
  - @tevm/predeploys@1.1.0-next.96
  - @tevm/address@1.1.0-next.96
  - @tevm/jsonrpc@1.1.0-next.96
  - @tevm/common@1.1.0-next.96
  - @tevm/logger@1.1.0-next.96
  - @tevm/txpool@1.1.0-next.96
  - @tevm/block@1.1.0-next.96
  - @tevm/state@1.1.0-next.96
  - @tevm/utils@1.1.0-next.96
  - @tevm/evm@1.1.0-next.96
  - @tevm/tx@1.1.0-next.96
  - @tevm/vm@1.1.0-next.96

## 1.1.0-next.95

### Patch Changes

- Updated dependencies []:
  - @tevm/predeploys@1.1.0-next.95
  - @tevm/vm@1.1.0-next.95
  - @tevm/evm@1.1.0-next.95
  - @tevm/state@1.1.0-next.95
  - @tevm/sync-storage-persister@1.1.0-next.95
  - @tevm/txpool@1.1.0-next.95

## 1.1.0-next.94

### Patch Changes

- Updated dependencies []:
  - @tevm/predeploys@1.1.0-next.94
  - @tevm/vm@1.1.0-next.94
  - @tevm/evm@1.1.0-next.94
  - @tevm/state@1.1.0-next.94
  - @tevm/sync-storage-persister@1.1.0-next.94
  - @tevm/txpool@1.1.0-next.94

## 1.1.0-next.92

### Patch Changes

- Updated dependencies [[`7af1917`](https://github.com/evmts/tevm-monorepo/commit/7af1917c2cedfed22f62f3e6edf3e6e15a8b7ac8)]:
  - @tevm/utils@1.1.0-next.92
  - @tevm/address@1.1.0-next.92
  - @tevm/block@1.1.0-next.92
  - @tevm/blockchain@1.1.0-next.92
  - @tevm/common@1.1.0-next.92
  - @tevm/evm@1.1.0-next.92
  - @tevm/predeploys@1.1.0-next.92
  - @tevm/receipt-manager@1.1.0-next.92
  - @tevm/state@1.1.0-next.92
  - @tevm/tx@1.1.0-next.92
  - @tevm/txpool@1.1.0-next.92
  - @tevm/vm@1.1.0-next.92
  - @tevm/sync-storage-persister@1.1.0-next.92

## 1.1.0-next.91

### Patch Changes

- Updated dependencies [[`7216932`](https://github.com/evmts/tevm-monorepo/commit/72169323bb89aba7165fcbedae7d024c71664333)]:
  - @tevm/utils@1.1.0-next.91
  - @tevm/block@1.1.0-next.91
  - @tevm/blockchain@1.1.0-next.91
  - @tevm/common@1.1.0-next.91
  - @tevm/evm@1.1.0-next.91
  - @tevm/predeploys@1.1.0-next.91
  - @tevm/receipt-manager@1.1.0-next.91
  - @tevm/state@1.1.0-next.91
  - @tevm/tx@1.1.0-next.91
  - @tevm/txpool@1.1.0-next.91
  - @tevm/vm@1.1.0-next.91
  - @tevm/sync-storage-persister@1.1.0-next.91

## 1.1.0-next.90

### Patch Changes

- Updated dependencies [[`396157c`](https://github.com/evmts/tevm-monorepo/commit/396157c8ee742fcabeb768ba737c37a400908e3f)]:
  - @tevm/state@1.1.0-next.90
  - @tevm/evm@1.1.0-next.90
  - @tevm/sync-storage-persister@1.1.0-next.90
  - @tevm/vm@1.1.0-next.90
  - @tevm/txpool@1.1.0-next.90

## 1.1.0-next.88

### Patch Changes

- Updated dependencies [[`cb2dd84`](https://github.com/evmts/tevm-monorepo/commit/cb2dd844a043fd956ab72b90ec21b80c4f606a64), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`e6f57e8`](https://github.com/evmts/tevm-monorepo/commit/e6f57e8ec4765b0520c850cff92370de50b1cc47), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60), [`0136b52`](https://github.com/evmts/tevm-monorepo/commit/0136b528fade3f557406ee52d24be35cfc2a752c), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60)]:
  - @tevm/evm@1.1.0-next.88
  - @tevm/vm@1.1.0-next.88
  - @tevm/utils@1.1.0-next.88
  - @tevm/block@1.1.0-next.88
  - @tevm/state@1.1.0-next.88
  - @tevm/txpool@1.1.0-next.88
  - @tevm/blockchain@1.1.0-next.88
  - @tevm/common@1.1.0-next.88
  - @tevm/predeploys@1.1.0-next.88
  - @tevm/receipt-manager@1.1.0-next.88
  - @tevm/tx@1.1.0-next.88
  - @tevm/sync-storage-persister@1.1.0-next.88

## 2.0.0-next.86

### Minor Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Made Common generic but optional on BaseClientOptions

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

- Updated dependencies [[`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8)]:
  - @tevm/sync-storage-persister@2.0.0-next.86
  - @tevm/receipt-manager@2.0.0-next.86
  - @tevm/blockchain@2.0.0-next.86
  - @tevm/predeploys@2.0.0-next.86
  - @tevm/jsonrpc@2.0.0-next.86
  - @tevm/common@2.0.0-next.86
  - @tevm/logger@2.0.0-next.86
  - @tevm/txpool@2.0.0-next.86
  - @tevm/block@2.0.0-next.86
  - @tevm/state@2.0.0-next.86
  - @tevm/utils@2.0.0-next.86
  - @tevm/evm@2.0.0-next.86
  - @tevm/tx@2.0.0-next.86
  - @tevm/vm@2.0.0-next.86

## 2.0.0-next.85

### Patch Changes

- Updated dependencies [[`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1), [`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1)]:
  - @tevm/common@2.0.0-next.85
  - @tevm/evm@2.0.0-next.85
  - @tevm/block@2.0.0-next.85
  - @tevm/blockchain@2.0.0-next.85
  - @tevm/receipt-manager@2.0.0-next.85
  - @tevm/state@2.0.0-next.85
  - @tevm/vm@2.0.0-next.85
  - @tevm/txpool@2.0.0-next.85
  - @tevm/sync-storage-persister@2.0.0-next.85

## 2.0.0-next.84

### Patch Changes

- Updated dependencies [[`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd)]:
  - @tevm/jsonrpc@2.0.0-next.84
  - @tevm/utils@2.0.0-next.84
  - @tevm/block@2.0.0-next.84
  - @tevm/state@2.0.0-next.84
  - @tevm/tx@2.0.0-next.84
  - @tevm/vm@2.0.0-next.84
  - @tevm/blockchain@2.0.0-next.84
  - @tevm/common@2.0.0-next.84
  - @tevm/evm@2.0.0-next.84
  - @tevm/predeploys@2.0.0-next.84
  - @tevm/receipt-manager@2.0.0-next.84
  - @tevm/txpool@2.0.0-next.84
  - @tevm/sync-storage-persister@2.0.0-next.84

## 2.0.0-next.83

### Patch Changes

- Updated dependencies []:
  - @tevm/state@2.0.0-next.83
  - @tevm/evm@2.0.0-next.83
  - @tevm/sync-storage-persister@2.0.0-next.83
  - @tevm/vm@2.0.0-next.83
  - @tevm/txpool@2.0.0-next.83

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

- Updated dependencies [[`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d)]:
  - @tevm/block@2.0.0-next.80
  - @tevm/blockchain@2.0.0-next.80
  - @tevm/common@2.0.0-next.80
  - @tevm/evm@2.0.0-next.80
  - @tevm/jsonrpc@2.0.0-next.80
  - @tevm/logger@2.0.0-next.80
  - @tevm/predeploys@2.0.0-next.80
  - @tevm/receipt-manager@2.0.0-next.80
  - @tevm/state@2.0.0-next.80
  - @tevm/sync-storage-persister@2.0.0-next.80
  - @tevm/tx@2.0.0-next.80
  - @tevm/txpool@2.0.0-next.80
  - @tevm/utils@2.0.0-next.80
  - @tevm/vm@2.0.0-next.80

## 2.0.0-next.79

### Minor Changes

- [#1210](https://github.com/evmts/tevm-monorepo/pull/1210) [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911) Thanks [@roninjin10](https://github.com/roninjin10)! - Add compatability for viem code property

### Patch Changes

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Update all packages for new tevm contract changes"

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- [#1213](https://github.com/evmts/tevm-monorepo/pull/1213) [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies except effect to latest

- Updated dependencies [[`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d), [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911), [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81)]:
  - @tevm/state@2.0.0-next.79
  - @tevm/blockchain@2.0.0-next.79
  - @tevm/predeploys@2.0.0-next.79
  - @tevm/jsonrpc@2.0.0-next.79
  - @tevm/common@2.0.0-next.79
  - @tevm/utils@2.0.0-next.79
  - @tevm/evm@2.0.0-next.79
  - @tevm/block@2.0.0-next.79
  - @tevm/logger@2.0.0-next.79
  - @tevm/receipt-manager@2.0.0-next.79
  - @tevm/sync-storage-persister@2.0.0-next.79
  - @tevm/tx@2.0.0-next.79
  - @tevm/txpool@2.0.0-next.79
  - @tevm/vm@2.0.0-next.79

## 1.1.0-next.78

### Patch Changes

- Updated dependencies []:
  - @tevm/state@1.1.0-next.78
  - @tevm/evm@1.1.0-next.78
  - @tevm/sync-storage-persister@1.1.0-next.78
  - @tevm/vm@1.1.0-next.78
  - @tevm/txpool@1.1.0-next.78

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

- Updated dependencies [[`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d)]:
  - @tevm/block@1.1.0-next.77
  - @tevm/blockchain@1.1.0-next.77
  - @tevm/common@1.1.0-next.77
  - @tevm/evm@1.1.0-next.77
  - @tevm/jsonrpc@1.1.0-next.77
  - @tevm/logger@1.1.0-next.77
  - @tevm/predeploys@1.1.0-next.77
  - @tevm/receipt-manager@1.1.0-next.77
  - @tevm/state@1.1.0-next.77
  - @tevm/sync-storage-persister@1.1.0-next.77
  - @tevm/tx@1.1.0-next.77
  - @tevm/txpool@1.1.0-next.77
  - @tevm/utils@1.1.0-next.77
  - @tevm/vm@1.1.0-next.77

## 1.1.0-next.76

### Patch Changes

- Updated dependencies [[`4650d32`](https://github.com/evmts/tevm-monorepo/commit/4650d32e2ee03f6ffc3cecbedec0b079b44f2081)]:
  - @tevm/tx@1.1.0-next.76
  - @tevm/vm@1.1.0-next.76
  - @tevm/block@1.1.0-next.76
  - @tevm/receipt-manager@1.1.0-next.76
  - @tevm/txpool@1.1.0-next.76
  - @tevm/blockchain@1.1.0-next.76
  - @tevm/evm@1.1.0-next.76

## 1.1.0-next.75

### Patch Changes

- Updated dependencies [[`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7)]:
  - @tevm/utils@1.1.0-next.75
  - @tevm/block@1.1.0-next.75
  - @tevm/state@1.1.0-next.75
  - @tevm/tx@1.1.0-next.75
  - @tevm/vm@1.1.0-next.75
  - @tevm/blockchain@1.1.0-next.75
  - @tevm/common@1.1.0-next.75
  - @tevm/evm@1.1.0-next.75
  - @tevm/predeploys@1.1.0-next.75
  - @tevm/receipt-manager@1.1.0-next.75
  - @tevm/txpool@1.1.0-next.75
  - @tevm/sync-storage-persister@1.1.0-next.75

## 1.1.0-next.74

### Minor Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

- Updated dependencies [[`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a)]:
  - @tevm/sync-storage-persister@1.1.0-next.74
  - @tevm/blockchain@1.1.0-next.74
  - @tevm/predeploys@1.1.0-next.74
  - @tevm/jsonrpc@1.1.0-next.74
  - @tevm/common@1.1.0-next.74
  - @tevm/txpool@1.1.0-next.74
  - @tevm/block@1.1.0-next.74
  - @tevm/state@1.1.0-next.74
  - @tevm/utils@1.1.0-next.74
  - @tevm/evm@1.1.0-next.74
  - @tevm/tx@1.1.0-next.74
  - @tevm/vm@1.1.0-next.74
  - @tevm/receipt-manager@1.1.0-next.74
  - @tevm/logger@1.1.0-next.74

## 1.1.0-next.73

### Patch Changes

- Updated dependencies []:
  - @tevm/state@1.1.0-next.73
  - @tevm/evm@1.1.0-next.73
  - @tevm/sync-storage-persister@1.1.0-next.73
  - @tevm/vm@1.1.0-next.73
  - @tevm/txpool@1.1.0-next.73

## 1.1.0-next.72

### Minor Changes

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more opstack gas information

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

### Patch Changes

- [#1177](https://github.com/evmts/tevm-monorepo/pull/1177) [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies to latest

- Updated dependencies [[`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32), [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa)]:
  - @tevm/utils@1.1.0-next.72
  - @tevm/vm@1.1.0-next.72
  - @tevm/jsonrpc@1.1.0-next.72
  - @tevm/state@1.1.0-next.72
  - @tevm/common@1.1.0-next.72
  - @tevm/logger@1.1.0-next.72
  - @tevm/tx@1.1.0-next.72
  - @tevm/block@1.1.0-next.72
  - @tevm/blockchain@1.1.0-next.72
  - @tevm/evm@1.1.0-next.72
  - @tevm/predeploys@1.1.0-next.72
  - @tevm/receipt-manager@1.1.0-next.72
  - @tevm/sync-storage-persister@1.1.0-next.72
  - @tevm/txpool@1.1.0-next.72

## 1.1.0-next.70

### Patch Changes

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated viem to latest

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with impersonatedAccount never being updated

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

- Updated dependencies [[`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113)]:
  - @tevm/blockchain@1.1.0-next.70
  - @tevm/jsonrpc@1.1.0-next.70
  - @tevm/common@1.1.0-next.70
  - @tevm/state@1.1.0-next.70
  - @tevm/utils@1.1.0-next.70
  - @tevm/receipt-manager@1.1.0-next.70
  - @tevm/txpool@1.1.0-next.70
  - @tevm/evm@1.1.0-next.70
  - @tevm/vm@1.1.0-next.70
  - @tevm/block@1.1.0-next.70
  - @tevm/sync-storage-persister@1.1.0-next.70
  - @tevm/predeploys@1.1.0-next.70
  - @tevm/tx@1.1.0-next.70

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

- Updated dependencies [[`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e)]:
  - @tevm/block@1.1.0-next.69
  - @tevm/blockchain@1.1.0-next.69
  - @tevm/common@1.1.0-next.69
  - @tevm/evm@1.1.0-next.69
  - @tevm/jsonrpc@1.1.0-next.69
  - @tevm/logger@1.1.0-next.69
  - @tevm/predeploys@1.1.0-next.69
  - @tevm/receipt-manager@1.1.0-next.69
  - @tevm/state@1.1.0-next.69
  - @tevm/sync-storage-persister@1.1.0-next.69
  - @tevm/tx@1.1.0-next.69
  - @tevm/txpool@1.1.0-next.69
  - @tevm/utils@1.1.0-next.69
  - @tevm/vm@1.1.0-next.69

## 1.1.0-next.68

### Minor Changes

- [#1154](https://github.com/evmts/tevm-monorepo/pull/1154) [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated BaseClient to emit a 'connect' event after it is ready

- [#1154](https://github.com/evmts/tevm-monorepo/pull/1154) [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated base-client log filters type to include more information such as the tx hash and block hash

## 1.1.0-next.67

### Minor Changes

- [#1151](https://github.com/evmts/tevm-monorepo/pull/1151) [`551e000`](https://github.com/evmts/tevm-monorepo/commit/551e0002a9b6112fb409faa6fd5e37ec76a429fd) Thanks [@roninjin10](https://github.com/roninjin10)! - Added event emitter support to BaseClient

## 1.1.0-next.66

### Patch Changes

- Updated dependencies []:
  - @tevm/state@1.1.0-next.66
  - @tevm/evm@1.1.0-next.62
  - @tevm/sync-storage-persister@1.1.0-next.66
  - @tevm/vm@1.1.0-next.62

## 1.1.0-next.65

### Patch Changes

- Updated dependencies []:
  - @tevm/state@1.1.0-next.65
  - @tevm/evm@1.1.0-next.62
  - @tevm/sync-storage-persister@1.1.0-next.65
  - @tevm/vm@1.1.0-next.62

## 1.1.0-next.64

### Minor Changes

- [#1140](https://github.com/evmts/tevm-monorepo/pull/1140) [`6197cba`](https://github.com/evmts/tevm-monorepo/commit/6197cba905cf0445013ce8c20a67a0b04321e8bd) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new filter registration methods to base client

- [#1145](https://github.com/evmts/tevm-monorepo/pull/1145) [`4d287aa`](https://github.com/evmts/tevm-monorepo/commit/4d287aacfbd969ec7e8243135bafc1214ef46352) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for automining.

  ```typescript
  const tevm = createMemoryClient({
    miningConfig: {
      type: "auto",
    },
  });
  ```

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
  - @tevm/state@1.1.0-next.63
  - @tevm/evm@1.1.0-next.62
  - @tevm/sync-storage-persister@1.1.0-next.63
  - @tevm/vm@1.1.0-next.62

## 1.1.0-next.62

### Minor Changes

- [#1136](https://github.com/evmts/tevm-monorepo/pull/1136) [`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2) Thanks [@roninjin10](https://github.com/roninjin10)! - Added multicall3 on genesis to tevm devnet

### Patch Changes

- Updated dependencies [[`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2)]:
  - @tevm/common@1.1.0-next.62
  - @tevm/blockchain@1.1.0-next.62
  - @tevm/evm@1.1.0-next.62
  - @tevm/receipt-manager@1.1.0-next.62
  - @tevm/state@1.1.0-next.62
  - @tevm/vm@1.1.0-next.62
  - @tevm/predeploys@1.1.0-next.62
  - @tevm/txpool@1.1.0-next.62
  - @tevm/sync-storage-persister@1.1.0-next.62

## 1.1.0-next.61

### Minor Changes

- [#1133](https://github.com/evmts/tevm-monorepo/pull/1133) [`09e9a22`](https://github.com/evmts/tevm-monorepo/commit/09e9a22eecf8ccbdf97f5e80f94857a74bd4f82d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more json-rpc methods

### Patch Changes

- Updated dependencies [[`09e9a22`](https://github.com/evmts/tevm-monorepo/commit/09e9a22eecf8ccbdf97f5e80f94857a74bd4f82d)]:
  - @tevm/vm@1.1.0-next.61
  - @tevm/txpool@1.1.0-next.60

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

- Updated dependencies [[`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6)]:
  - @tevm/blockchain@1.1.0-next.60
  - @tevm/common@1.1.0-next.60
  - @tevm/evm@1.1.0-next.60
  - @tevm/jsonrpc@1.1.0-next.60
  - @tevm/logger@1.1.0-next.60
  - @tevm/predeploys@1.1.0-next.60
  - @tevm/receipt-manager@1.1.0-next.60
  - @tevm/state@1.1.0-next.60
  - @tevm/sync-storage-persister@1.1.0-next.60
  - @tevm/txpool@1.1.0-next.60
  - @tevm/utils@1.1.0-next.60
  - @tevm/vm@1.1.0-next.60

## 1.1.0-next.59

### Patch Changes

- [#1118](https://github.com/evmts/tevm-monorepo/pull/1118) [`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82) Thanks [@roninjin10](https://github.com/roninjin10)! - [BREAKING] Removed eip hardfork and chain options in favor of common

- Updated dependencies [[`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82)]:
  - @tevm/blockchain@1.1.0-next.59
  - @tevm/common@1.1.0-next.59
  - @tevm/evm@1.1.0-next.59
  - @tevm/vm@1.1.0-next.59
  - @tevm/receipt-manager@1.1.0-next.59
  - @tevm/state@1.1.0-next.59
  - @tevm/txpool@1.1.0-next.59
  - @tevm/sync-storage-persister@1.1.0-next.59

## 1.1.0-next.58

### Patch Changes

- [#1114](https://github.com/evmts/tevm-monorepo/pull/1114) [`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with not passing in customCrypto correctly for non forked mode

- Updated dependencies [[`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27)]:
  - @tevm/common@1.1.0-next.58

## 1.1.0-next.57

### Minor Changes

- [#1112](https://github.com/evmts/tevm-monorepo/pull/1112) [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59) Thanks [@roninjin10](https://github.com/roninjin10)! - Breaking: Removed the chainId property in favor of `TevmChain` from `@tevm/common`. TevmChain extends ViemChain and ethereumjs Common for a common interface for specifying chain/common info

- [#1112](https://github.com/evmts/tevm-monorepo/pull/1112) [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for the customCrypto option to @tevm/common and @tevm/base-client. This allows kzg to be passed for 4844 supports

### Patch Changes

- Updated dependencies [[`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59), [`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59)]:
  - @tevm/common@1.1.0-next.57
  - @tevm/common@1.1.0-next.57
  - @tevm/blockchain@1.1.0-next.57
  - @tevm/evm@1.1.0-next.57
  - @tevm/receipt-manager@1.1.0-next.57
  - @tevm/state@1.1.0-next.57
  - @tevm/vm@1.1.0-next.57
  - @tevm/txpool@1.1.0-next.57
  - @tevm/sync-storage-persister@1.1.0-next.57

## 1.1.0-next.56

### Patch Changes

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/receipt-manager@1.1.0-next.56
  - @tevm/predeploys@1.1.0-next.56
  - @tevm/state@1.1.0-next.56
  - @tevm/blockchain@1.1.0-next.56
  - @tevm/txpool@1.1.0-next.56
  - @tevm/vm@1.1.0-next.56
  - @tevm/evm@1.1.0-next.56
  - @tevm/sync-storage-persister@1.1.0-next.56

## 1.1.0-next.55

### Patch Changes

- Updated dependencies [[`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8)]:
  - @tevm/blockchain@1.1.0-next.55
  - @tevm/evm@1.1.0-next.55
  - @tevm/receipt-manager@1.1.0-next.55
  - @tevm/vm@1.1.0-next.55
  - @tevm/txpool@1.1.0-next.52

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/blockchain@1.1.0-next.52
  - @tevm/common@1.1.0-next.52
  - @tevm/evm@1.1.0-next.52
  - @tevm/jsonrpc@1.1.0-next.52
  - @tevm/logger@1.1.0-next.52
  - @tevm/predeploys@1.1.0-next.52
  - @tevm/receipt-manager@1.1.0-next.52
  - @tevm/state@1.1.0-next.52
  - @tevm/sync-storage-persister@1.1.0-next.52
  - @tevm/txpool@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52
  - @tevm/vm@1.1.0-next.52

## 1.1.0-next.51

### Patch Changes

- Updated dependencies [[`93b04d6`](https://github.com/evmts/tevm-monorepo/commit/93b04d6a3cd06180e3567d07bec655c7a135a8c3)]:
  - @tevm/state@1.1.0-next.51
  - @tevm/evm@1.1.0-next.50
  - @tevm/sync-storage-persister@1.1.0-next.51
  - @tevm/vm@1.1.0-next.50

## 1.1.0-next.50

### Patch Changes

- Updated dependencies [[`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4), [`71e5c1e`](https://github.com/evmts/tevm-monorepo/commit/71e5c1ead386f43a3bfbdd53acffcb5b49ad3433)]:
  - @tevm/blockchain@1.1.0-next.50
  - @tevm/receipt-manager@1.1.0-next.50
  - @tevm/evm@1.1.0-next.50
  - @tevm/vm@1.1.0-next.50
  - @tevm/txpool@1.1.0-next.49

## 1.1.0-next.49

### Minor Changes

- [#1069](https://github.com/evmts/tevm-monorepo/pull/1069) [`a6655fc`](https://github.com/evmts/tevm-monorepo/commit/a6655fc2414d06b3bd2caf72f88ec2ccff20a075) Thanks [@roninjin10](https://github.com/roninjin10)! - Exported `prefundedAccount` as an array of contract addresses that are prefunded. These map to the the same accounts prefunded by anvil and hardhat.

### Patch Changes

- Updated dependencies [[`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8), [`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8), [`2ba2c27`](https://github.com/evmts/tevm-monorepo/commit/2ba2c278c11e524a7fbb0a8201e7f82c8ec9a4f5)]:
  - @tevm/txpool@1.1.0-next.49
  - @tevm/state@1.1.0-next.49
  - @tevm/evm@1.1.0-next.47
  - @tevm/sync-storage-persister@1.1.0-next.49
  - @tevm/vm@1.1.0-next.47

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/blockchain@1.1.0-next.47
  - @tevm/common@1.1.0-next.47
  - @tevm/evm@1.1.0-next.47
  - @tevm/jsonrpc@1.1.0-next.47
  - @tevm/logger@1.1.0-next.47
  - @tevm/predeploys@1.1.0-next.47
  - @tevm/state@1.1.0-next.47
  - @tevm/sync-storage-persister@1.1.0-next.47
  - @tevm/txpool@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47
  - @tevm/vm@1.1.0-next.47

## 1.1.0-next.46

### Patch Changes

- [#1056](https://github.com/evmts/tevm-monorepo/pull/1056) [`c0c9e30`](https://github.com/evmts/tevm-monorepo/commit/c0c9e302c6900ed9ad31c50667813d35dc5366e9) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with state persistance not working in forked mode

- [#1057](https://github.com/evmts/tevm-monorepo/pull/1057) [`2a7e1db`](https://github.com/evmts/tevm-monorepo/commit/2a7e1db74c68f8e803026b95a1ce957445db1388) Thanks [@roninjin10](https://github.com/roninjin10)! - Optimized performance of forking

- Updated dependencies [[`4da1830`](https://github.com/evmts/tevm-monorepo/commit/4da1830d2c0df764156b79f12508d11702694b3d), [`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc), [`2a7e1db`](https://github.com/evmts/tevm-monorepo/commit/2a7e1db74c68f8e803026b95a1ce957445db1388), [`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc)]:
  - @tevm/common@1.1.0-next.46
  - @tevm/jsonrpc@1.1.0-next.46
  - @tevm/state@1.1.0-next.46
  - @tevm/blockchain@1.1.0-next.46
  - @tevm/evm@1.1.0-next.46
  - @tevm/vm@1.1.0-next.46
  - @tevm/sync-storage-persister@1.1.0-next.46
  - @tevm/txpool@1.1.0-next.46

## 1.1.0-next.45

### Minor Changes

- [#1036](https://github.com/evmts/tevm-monorepo/pull/1036) [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added logConfig option to base client options to configure log level of client

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- Updated dependencies [[`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8), [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921), [`7c172f9`](https://github.com/evmts/tevm-monorepo/commit/7c172f9da63c490e89f93b831309e4f0183e8da7)]:
  - @tevm/errors@1.1.0-next.45
  - @tevm/blockchain@1.1.0-next.45
  - @tevm/predeploys@1.1.0-next.45
  - @tevm/common@1.1.0-next.45
  - @tevm/txpool@1.1.0-next.45
  - @tevm/state@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45
  - @tevm/evm@1.1.0-next.45
  - @tevm/vm@1.1.0-next.45
  - @tevm/sync-storage-persister@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- Updated dependencies [[`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6)]:
  - @tevm/blockchain@1.0.0-next.42
  - @tevm/evm@1.0.0-next.42
  - @tevm/vm@1.0.0-next.42

## 1.0.0-next.41

### Minor Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `ready()` method. The promise resolves when BaseClient or any client extending it is ready to accept requests

- [#973](https://github.com/evmts/tevm-monorepo/pull/973) [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `setChainId` method to base client

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] Removed the chainId property in favor of a getChainId property. Removed vm property in favor of a getVm property. These changes allow the tevm memory client and base client to be instanciated syncronously.

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] Made both createMemoryClient and createBaseClient synchronous

## 1.0.0-next.40

### Minor Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added persistence option that enables the base client to persist state changes to a syncronous source such as local storage. Async sources can be supported in future

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a), [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/state@1.0.0-next.40
  - @tevm/sync-storage-persister@1.0.0-next.40
  - @tevm/utils@1.0.0-next.40
  - @tevm/blockchain@1.0.0-next.40
  - @tevm/common@1.0.0-next.40
  - @tevm/evm@1.0.0-next.40
  - @tevm/jsonrpc@1.0.0-next.40
  - @tevm/predeploys@1.0.0-next.40
  - @tevm/vm@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/blockchain@1.0.0-next.39
  - @tevm/predeploys@1.0.0-next.39
  - @tevm/common@1.0.0-next.39
  - @tevm/state@1.0.0-next.39
  - @tevm/utils@1.0.0-next.39
  - @tevm/evm@1.0.0-next.39
  - @tevm/vm@1.0.0-next.39

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
