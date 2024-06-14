# @tevm/contract

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

- Updated dependencies [[`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d)]:
  - @tevm/base-client@1.1.0-next.77
  - @tevm/block@1.1.0-next.77
  - @tevm/blockchain@1.1.0-next.77
  - @tevm/common@1.1.0-next.77
  - @tevm/errors@1.1.0-next.77
  - @tevm/evm@1.1.0-next.77
  - @tevm/jsonrpc@1.1.0-next.77
  - @tevm/receipt-manager@1.1.0-next.77
  - @tevm/state@1.1.0-next.77
  - @tevm/tx@1.1.0-next.77
  - @tevm/utils@1.1.0-next.77
  - @tevm/vm@1.1.0-next.77

## 1.1.0-next.76

### Minor Changes

- [#1198](https://github.com/evmts/tevm-monorepo/pull/1198) [`4650d32`](https://github.com/evmts/tevm-monorepo/commit/4650d32e2ee03f6ffc3cecbedec0b079b44f2081) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for setting maxFeePerGas and maxPriorityFeePerGas

- [#1198](https://github.com/evmts/tevm-monorepo/pull/1198) [`4650d32`](https://github.com/evmts/tevm-monorepo/commit/4650d32e2ee03f6ffc3cecbedec0b079b44f2081) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for passing in maxFeePerGas and maxPriorityFeePerGas to tevmCall tevmContract tevmDeploy and tevmScript

### Patch Changes

- [#1197](https://github.com/evmts/tevm-monorepo/pull/1197) [`fbf5192`](https://github.com/evmts/tevm-monorepo/commit/fbf51925ad6b7b367a41d5e7dd667f589f8c21e4) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where tevmCall and related methods would improperly validate params such as depth and value. Previously it would not throw a validation error if these numbers are negative

- [#1197](https://github.com/evmts/tevm-monorepo/pull/1197) [`fbf5192`](https://github.com/evmts/tevm-monorepo/commit/fbf51925ad6b7b367a41d5e7dd667f589f8c21e4) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where validation errors of nested structures like arrays would sometimes get swallowed by tevmCall and related methods

- Updated dependencies [[`4650d32`](https://github.com/evmts/tevm-monorepo/commit/4650d32e2ee03f6ffc3cecbedec0b079b44f2081)]:
  - @tevm/tx@1.1.0-next.76
  - @tevm/vm@1.1.0-next.76
  - @tevm/base-client@1.1.0-next.76
  - @tevm/block@1.1.0-next.76
  - @tevm/receipt-manager@1.1.0-next.76
  - @tevm/blockchain@1.1.0-next.76
  - @tevm/evm@1.1.0-next.76

## 1.1.0-next.75

### Patch Changes

- Updated dependencies [[`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7)]:
  - @tevm/errors@1.1.0-next.75
  - @tevm/utils@1.1.0-next.75
  - @tevm/block@1.1.0-next.75
  - @tevm/state@1.1.0-next.75
  - @tevm/tx@1.1.0-next.75
  - @tevm/vm@1.1.0-next.75
  - @tevm/base-client@1.1.0-next.75
  - @tevm/blockchain@1.1.0-next.75
  - @tevm/common@1.1.0-next.75
  - @tevm/evm@1.1.0-next.75
  - @tevm/receipt-manager@1.1.0-next.75

## 1.1.0-next.74

### Minor Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed action errors like CallError to TevmCallError. They are exported from actions package now instead of errors package

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

- Updated dependencies [[`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a)]:
  - @tevm/base-client@1.1.0-next.74
  - @tevm/blockchain@1.1.0-next.74
  - @tevm/jsonrpc@1.1.0-next.74
  - @tevm/common@1.1.0-next.74
  - @tevm/errors@1.1.0-next.74
  - @tevm/block@1.1.0-next.74
  - @tevm/state@1.1.0-next.74
  - @tevm/utils@1.1.0-next.74
  - @tevm/evm@1.1.0-next.74
  - @tevm/tx@1.1.0-next.74
  - @tevm/vm@1.1.0-next.74
  - @tevm/receipt-manager@1.1.0-next.74

## 1.1.0-next.73

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.73
  - @tevm/state@1.1.0-next.73
  - @tevm/evm@1.1.0-next.73
  - @tevm/procedures-types@1.1.0-next.73
  - @tevm/vm@1.1.0-next.73

## 1.1.0-next.72

### Minor Changes

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for baseFee, l1DataFee, minerFee, priorityFee and more in the call return type for tevmCall tevmDeploy and tevmScript

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Breaking change. default to createTransaction: true if state mutability is payable or nonpayable and continue defaulting to false otherwise. Before all calls do not create a transaction unless createTransaction: true is set.

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more opstack gas information

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

### Patch Changes

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where calls would not properly revert from lack of gas sometimes

- [#1177](https://github.com/evmts/tevm-monorepo/pull/1177) [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies to latest

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where transactions could get assigned to low of a maxFeePerGas

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - New opstack related types

- Updated dependencies [[`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32), [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa)]:
  - @tevm/utils@1.1.0-next.72
  - @tevm/vm@1.1.0-next.72
  - @tevm/base-client@1.1.0-next.72
  - @tevm/jsonrpc@1.1.0-next.72
  - @tevm/state@1.1.0-next.72
  - @tevm/common@1.1.0-next.72
  - @tevm/zod@1.1.0-next.72
  - @tevm/tx@1.1.0-next.72
  - @tevm/block@1.1.0-next.72
  - @tevm/blockchain@1.1.0-next.72
  - @tevm/errors@1.1.0-next.72
  - @tevm/evm@1.1.0-next.72
  - @tevm/procedures-types@1.1.0-next.72
  - @tevm/receipt-manager@1.1.0-next.72

## 1.1.0-next.71

### Patch Changes

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed more anvil\_ methods that accepted wrong params shape

- [#1141](https://github.com/evmts/tevm-monorepo/pull/1141) [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in tevm_setAccount sometimes not padding storage key bytes to 32

- Updated dependencies [[`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480), [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480), [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480), [`18fc9b5`](https://github.com/evmts/tevm-monorepo/commit/18fc9b574b85eb648d3fb8619c05db4bc83b4480)]:
  - @tevm/procedures-types@1.1.0-next.71

## 1.1.0-next.70

### Patch Changes

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated viem to latest

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with impersonated tx being frozen

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Update signed endpoints like ethSendRawTransaction to accept unsigned tx temporarily

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

- Updated dependencies [[`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113)]:
  - @tevm/procedures-types@1.1.0-next.70
  - @tevm/base-client@1.1.0-next.70
  - @tevm/blockchain@1.1.0-next.70
  - @tevm/jsonrpc@1.1.0-next.70
  - @tevm/state@1.1.0-next.70
  - @tevm/utils@1.1.0-next.70
  - @tevm/zod@1.1.0-next.70
  - @tevm/receipt-manager@1.1.0-next.70
  - @tevm/evm@1.1.0-next.70
  - @tevm/vm@1.1.0-next.70
  - @tevm/block@1.1.0-next.70
  - @tevm/tx@1.1.0-next.70

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

- Updated dependencies [[`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e)]:
  - @tevm/block@1.1.0-next.69
  - @tevm/blockchain@1.1.0-next.69
  - @tevm/jsonrpc@1.1.0-next.69
  - @tevm/procedures-types@1.1.0-next.69
  - @tevm/receipt-manager@1.1.0-next.69
  - @tevm/tx@1.1.0-next.69
  - @tevm/utils@1.1.0-next.69
  - @tevm/vm@1.1.0-next.69
  - @tevm/zod@1.1.0-next.69

## 1.1.0-next.68

### Minor Changes

- [#1154](https://github.com/evmts/tevm-monorepo/pull/1154) [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevmMine to events for newBlock, newReceipt, and newLog

### Patch Changes

- [#1154](https://github.com/evmts/tevm-monorepo/pull/1154) [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed race condition where a tx can fail validation but still be added to tx pool

- [#1154](https://github.com/evmts/tevm-monorepo/pull/1154) [`693653e`](https://github.com/evmts/tevm-monorepo/commit/693653e747f4cf6853fe2255b1e4b7cf658b834d) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with eth_getLogs not properly handling optional properties when undefined

- Updated dependencies []:
  - @tevm/procedures-types@1.1.0-next.64
  - @tevm/zod@1.1.0-next.60

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

- Updated dependencies [[`6197cba`](https://github.com/evmts/tevm-monorepo/commit/6197cba905cf0445013ce8c20a67a0b04321e8bd)]:
  - @tevm/procedures-types@1.1.0-next.64

## 1.1.0-next.62

### Patch Changes

- Updated dependencies []:
  - @tevm/block@1.1.0-next.62
  - @tevm/blockchain@1.1.0-next.62
  - @tevm/receipt-manager@1.1.0-next.62
  - @tevm/vm@1.1.0-next.62
  - @tevm/procedures-types@1.1.0-next.60

## 1.1.0-next.61

### Minor Changes

- [#1133](https://github.com/evmts/tevm-monorepo/pull/1133) [`09e9a22`](https://github.com/evmts/tevm-monorepo/commit/09e9a22eecf8ccbdf97f5e80f94857a74bd4f82d) Thanks [@roninjin10](https://github.com/roninjin10)! - Exported action for forking and caching blocks

### Patch Changes

- Updated dependencies [[`09e9a22`](https://github.com/evmts/tevm-monorepo/commit/09e9a22eecf8ccbdf97f5e80f94857a74bd4f82d)]:
  - @tevm/vm@1.1.0-next.61

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

- Updated dependencies [[`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6)]:
  - @tevm/block@1.1.0-next.60
  - @tevm/blockchain@1.1.0-next.60
  - @tevm/jsonrpc@1.1.0-next.60
  - @tevm/procedures-types@1.1.0-next.60
  - @tevm/receipt-manager@1.1.0-next.60
  - @tevm/tx@1.1.0-next.60
  - @tevm/utils@1.1.0-next.60
  - @tevm/vm@1.1.0-next.60
  - @tevm/zod@1.1.0-next.60

## 1.1.0-next.59

### Patch Changes

- [#1118](https://github.com/evmts/tevm-monorepo/pull/1118) [`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82) Thanks [@roninjin10](https://github.com/roninjin10)! - [BREAKING] Removed eip hardfork and chain options in favor of common

- Updated dependencies [[`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82)]:
  - @tevm/blockchain@1.1.0-next.59
  - @tevm/block@1.1.0-next.59
  - @tevm/vm@1.1.0-next.59
  - @tevm/receipt-manager@1.1.0-next.59
  - @tevm/procedures-types@1.1.0-next.52

## 1.1.0-next.57

### Patch Changes

- Updated dependencies []:
  - @tevm/block@1.1.0-next.57
  - @tevm/blockchain@1.1.0-next.57
  - @tevm/receipt-manager@1.1.0-next.57
  - @tevm/vm@1.1.0-next.57
  - @tevm/procedures-types@1.1.0-next.52

## 1.1.0-next.56

### Patch Changes

- [#1109](https://github.com/evmts/tevm-monorepo/pull/1109) [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with ethGetCode not getting updated post blockchain refactor

- [#1109](https://github.com/evmts/tevm-monorepo/pull/1109) [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix: Bug with last blocks state root accidentally being mutated when mining new blocks

- [#1109](https://github.com/evmts/tevm-monorepo/pull/1109) [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in getStorageAtHandler preventing some storage slots to not be read correctly.

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784), [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/block@1.1.0-next.56
  - @tevm/receipt-manager@1.1.0-next.56
  - @tevm/procedures-types@1.1.0-next.52
  - @tevm/zod@1.1.0-next.52
  - @tevm/blockchain@1.1.0-next.56
  - @tevm/vm@1.1.0-next.56

## 1.1.0-next.55

### Patch Changes

- [#1103](https://github.com/evmts/tevm-monorepo/pull/1103) [`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where forkedBlockTag was not getting updated in calls when explicit block tags are passed

- [#1103](https://github.com/evmts/tevm-monorepo/pull/1103) [`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in call actions not properly awaiting in forked mode when fetching a past block tag.

- Updated dependencies [[`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8)]:
  - @tevm/blockchain@1.1.0-next.55
  - @tevm/receipt-manager@1.1.0-next.55
  - @tevm/vm@1.1.0-next.55

## 1.1.0-next.54

### Patch Changes

- [#1095](https://github.com/evmts/tevm-monorepo/pull/1095) [`f04be52`](https://github.com/evmts/tevm-monorepo/commit/f04be524126dde2d1642e53af6ab54c3b42d9cf7) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed storage keys of access list to be prefixed with 0x

- Updated dependencies []:
  - @tevm/procedures-types@1.1.0-next.52
  - @tevm/zod@1.1.0-next.52

## 1.1.0-next.53

### Minor Changes

- [#1093](https://github.com/evmts/tevm-monorepo/pull/1093) [`db1fe77`](https://github.com/evmts/tevm-monorepo/commit/db1fe776b0e0f0f2ccd5421109e9ec8b6bb78eff) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for generating access lists

### Patch Changes

- [#1092](https://github.com/evmts/tevm-monorepo/pull/1092) [`214a814`](https://github.com/evmts/tevm-monorepo/commit/214a81453d7a4dab647e7c1f91fa4ada3d3939da) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where eth_getBalance which previously was implemented for block tag 'pending' was not updated. Now eth_getBalance works for all block tags except pending.

- Updated dependencies []:
  - @tevm/procedures-types@1.1.0-next.52
  - @tevm/zod@1.1.0-next.52

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/block@1.1.0-next.52
  - @tevm/blockchain@1.1.0-next.52
  - @tevm/jsonrpc@1.1.0-next.52
  - @tevm/procedures-types@1.1.0-next.52
  - @tevm/receipt-manager@1.1.0-next.52
  - @tevm/tx@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52
  - @tevm/vm@1.1.0-next.52
  - @tevm/zod@1.1.0-next.52

## 1.1.0-next.50

### Minor Changes

- [#1083](https://github.com/evmts/tevm-monorepo/pull/1083) [`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for ethGetLogs

### Patch Changes

- Updated dependencies [[`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4), [`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4), [`71e5c1e`](https://github.com/evmts/tevm-monorepo/commit/71e5c1ead386f43a3bfbdd53acffcb5b49ad3433), [`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4)]:
  - @tevm/procedures-types@1.1.0-next.50
  - @tevm/blockchain@1.1.0-next.50
  - @tevm/receipt-manager@1.1.0-next.50
  - @tevm/vm@1.1.0-next.50

## 1.1.0-next.49

### Patch Changes

- [#1076](https://github.com/evmts/tevm-monorepo/pull/1076) [`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with not updating nonce when more than one tx is in the tx pool

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.47

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/block@1.1.0-next.47
  - @tevm/blockchain@1.1.0-next.47
  - @tevm/jsonrpc@1.1.0-next.47
  - @tevm/tx@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47
  - @tevm/vm@1.1.0-next.47
  - @tevm/zod@1.1.0-next.47

## 1.1.0-next.46

### Minor Changes

- [#1062](https://github.com/evmts/tevm-monorepo/pull/1062) [`d77e373`](https://github.com/evmts/tevm-monorepo/commit/d77e373694960e268a4b56a94dea676911ec0af1) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployHandler to tevm

### Patch Changes

- [#1058](https://github.com/evmts/tevm-monorepo/pull/1058) [`77fb31d`](https://github.com/evmts/tevm-monorepo/commit/77fb31dd3e4642495860b3bde1c6bc6527f2bb19) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with `createTransaction` setting the wrong gas limit on contract creation

- Updated dependencies [[`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc), [`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc)]:
  - @tevm/jsonrpc@1.1.0-next.46
  - @tevm/blockchain@1.1.0-next.46
  - @tevm/zod@1.1.0-next.45
  - @tevm/block@1.1.0-next.46
  - @tevm/vm@1.1.0-next.46

## 1.1.0-next.45

### Minor Changes

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability for tevm_getAccount procedure and getAccount action to optionally return contract storage

- [#1042](https://github.com/evmts/tevm-monorepo/pull/1042) [`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new tevm_mine and anvil_mine support for mining blocks. This includes the JSON-RPC support as well as a new tevm.mine() action to the main tevm api

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added stateOverrides and blockOverrides to tevm_call, tevm_contract, tevm_script, eth_call, and their associated JSON-RPC procedures

- [#1036](https://github.com/evmts/tevm-monorepo/pull/1036) [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new traceConfig option to call, script, and contract methods to optionally return a trace

- [`5bc2874`](https://github.com/evmts/tevm-monorepo/commit/5bc2874287bce7c3ccec0f543ba719b600e209cb) - Added eth*sendTransaction and eth_sendRawTransaction along with various anvil* methods

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for setting contract storage to tevm_setAccount and the setAccount action"

### Patch Changes

- [#1020](https://github.com/evmts/tevm-monorepo/pull/1020) [`ca9ea64`](https://github.com/evmts/tevm-monorepo/commit/ca9ea649ce016b6684b713643a2229d67a18cd62) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to return the createdAddress

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- Updated dependencies [[`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948), [`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8), [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948), [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a), [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/zod@1.1.0-next.45
  - @tevm/blockchain@1.1.0-next.45
  - @tevm/block@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45
  - @tevm/tx@1.1.0-next.45
  - @tevm/vm@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- [#977](https://github.com/evmts/tevm-monorepo/pull/977) [`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where cannonical block header was not being passed into EVM

- Updated dependencies []:
  - @tevm/vm@1.0.0-next.42

## 1.0.0-next.41

### Minor Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] The action and procedure factory functions now take the new client type

### Patch Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with getAccount type returning optional properties that are not optional

- Updated dependencies []:
  - @tevm/zod@1.0.0-next.40

## 1.0.0-next.40

### Minor Changes

- [#955](https://github.com/evmts/tevm-monorepo/pull/955) [`6c562883dee460556d3daf01fecbc72afa2321c9`](https://github.com/evmts/tevm-monorepo/commit/6c562883dee460556d3daf01fecbc72afa2321c9) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new throwOnError params to all tevm actions. Defaults to true and will throw an error if the action has an error rather than returning errors on the errors property

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- [#959](https://github.com/evmts/tevm-monorepo/pull/959) [`2e9595904812ccab8382ceae3c04c8820d1aca61`](https://github.com/evmts/tevm-monorepo/commit/2e9595904812ccab8382ceae3c04c8820d1aca61) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with errors being thrown while generating helpful error message for contract revert

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/utils@1.0.0-next.40
  - @tevm/jsonrpc@1.0.0-next.40
  - @tevm/vm@1.0.0-next.40
  - @tevm/zod@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/utils@1.0.0-next.39
  - @tevm/zod@1.0.0-next.39
  - @tevm/vm@1.0.0-next.39

## 1.0.0-next.37

### Minor Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/vm package to wrap the ethereumjs vm with a TevmVm class that handles custom tevm functionality

### Patch Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with load storage incorrectly hashing storage value

## 1.0.0-next.34

### Patch Changes

- [#932](https://github.com/evmts/tevm-monorepo/pull/932) [`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d) Thanks [@roninjin10](https://github.com/roninjin10)! - Remove console.log

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

### Patch Changes

- Updated dependencies [[`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73)]:
  - @tevm/zod@1.0.0-next.33

## 1.0.0-next.31

### Patch Changes

- Updated dependencies [[`ea49d992970dada46c66a590109b31a7119cc426`](https://github.com/evmts/tevm-monorepo/commit/ea49d992970dada46c66a590109b31a7119cc426)]:
  - @tevm/zod@1.0.0-next.31

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

### Patch Changes

- Updated dependencies []:
  - @tevm/zod@1.0.0-next.28

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/jsonrpc@1.0.0-next.28
  - @tevm/zod@1.0.0-next.28

## 1.0.0-next.26

### Minor Changes

- [#904](https://github.com/evmts/tevm-monorepo/pull/904) [`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth_accounts eth_sign and eth_signTransaction JSON-RPC support. Added ethAccounts ethSign and ethSignTransaction actions. Added `accounts` prop to tevm client. The accounts used are the test accounts that are also used by ganache anvil and hardhat

### Patch Changes

- Updated dependencies []:
  - @tevm/zod@1.0.0-next.25

## 1.0.0-next.25

### Minor Changes

- [#888](https://github.com/evmts/tevm-monorepo/pull/888) [`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for eth_call JSON-RPC and the matching client.eth.call action

### Patch Changes

- Updated dependencies [[`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116)]:
  - @tevm/zod@1.0.0-next.25

## 1.0.0-next.24

### Minor Changes

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed gasLimit to gas in all params to be more consistent with ethereum spec

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added the eth_call handler and JSON-RPC procedure

### Patch Changes

- Updated dependencies [[`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d)]:
  - @tevm/zod@1.0.0-next.24

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`de81ac31460bb642dad401571ad3c1d81bdbef2d`](https://github.com/evmts/tevm-monorepo/commit/de81ac31460bb642dad401571ad3c1d81bdbef2d), [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539)]:
  - @tevm/jsonrpc@1.0.0-next.23
  - @tevm/zod@1.0.0-next.23

## 1.0.0-next.22

### Minor Changes

- [#805](https://github.com/evmts/tevm-monorepo/pull/805) [`8b3218b1`](https://github.com/evmts/tevm-monorepo/commit/8b3218b129ed43cf173a369cbe6b636365748e77) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Enable State Load and Dump actions

- [#822](https://github.com/evmts/tevm-monorepo/pull/822) [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth methods such as chainId getCode and getStorageAt to Tevm.eth.

- [#823](https://github.com/evmts/tevm-monorepo/pull/823) [`f7865314`](https://github.com/evmts/tevm-monorepo/commit/f7865314da875e35b8f10b2ebe7001f64b0e5fa9) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for debug_traceCall handler

### Patch Changes

- [#804](https://github.com/evmts/tevm-monorepo/pull/804) [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with tevm account not updating code hash when deployedBytecode is put into state

- Updated dependencies [[`3b4a347d`](https://github.com/evmts/tevm-monorepo/commit/3b4a347da4c0086b22a276b31442d5b22855a2ba), [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`aec294ba`](https://github.com/evmts/tevm-monorepo/commit/aec294ba6a3f4fc7bade3ac2286a6bf317b2112c)]:
  - @tevm/zod@1.0.0-next.22
  - @tevm/jsonrpc@1.0.0-next.22

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/procedures package. This package implements the @tevm/actions-types JSON-RPC api fully with ethereumjs EVM

- Updated dependencies [[`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa)]:
  - @tevm/zod@1.0.0-next.21

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/tevm-monorepo/pull/690) [`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to tevm contract instances

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.1

### Patch Changes

- [#662](https://github.com/evmts/tevm-monorepo/pull/662) [`bba1d7e9`](https://github.com/evmts/tevm-monorepo/commit/bba1d7e92b22dba39c0aa147d486ff92878e8179) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with types missing from @tevm/vm package

## 0.0.2

### Patch Changes

- Release working proof of concept
