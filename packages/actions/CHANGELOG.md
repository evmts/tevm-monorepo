# @tevm/contract

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages
- Updated dependencies [bc0c4a1]
  - @tevm/address@1.0.0-next.128
  - @tevm/block@1.0.0-next.128
  - @tevm/blockchain@1.0.0-next.128
  - @tevm/common@1.0.0-next.128
  - @tevm/contract@1.0.0-next.128
  - @tevm/errors@1.0.0-next.128
  - @tevm/evm@1.0.0-next.128
  - @tevm/jsonrpc@1.0.0-next.128
  - @tevm/node@1.0.0-next.128
  - @tevm/receipt-manager@1.0.0-next.128
  - @tevm/state@1.0.0-next.128
  - @tevm/tx@1.0.0-next.128
  - @tevm/utils@1.0.0-next.128
  - @tevm/vm@1.0.0-next.128

## 1.0.0-next.127

### Patch Changes

- 141b5da: Fixed bug with maxPriorityFee on arbitrum network

## 1.0.0-next.126

### Minor Changes

- b99de65: Added eth_createAccessList and anvil_deal json-rpc requests
  Added MemoryClient.deal action

## 1.0.0-next.125

### Patch Changes

- 42590c1: Fixed bug where gasLimit was set to block max when simulating calls

## 1.0.0-next.124

### Patch Changes

- d501679: Fixed bug with state overrides persisting after the call was finished
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/node@1.0.0-next.124
  - @tevm/state@1.0.0-next.124
  - @tevm/evm@1.0.0-next.124
  - @tevm/vm@1.0.0-next.124

## 1.0.0-next.123

### Patch Changes

- 7ed32d3: Fixed bug with anvil_impersonateAccount woudln't properly throw an error for invalid addresses
- 3419055: Fixed bug where input params arrays for some json rpc requests were not readonly. This would cause typescript to error if a readonly array was used rather than a normal one
- Updated dependencies [7ed32d3]
  - @tevm/node@1.0.0-next.123

## 1.0.0-next.122

### Minor Changes

- 96ca3f3: Fixed eth_getLogs and eth_getFilterLogs interface to accept an array of topics

## 1.0.0-next.121

### Patch Changes

- 3f8119e: Fixed bug where loadState would not validate params correctly and then fail with a confusing error if state was wrong
- 3f8119e: Fixed bug where client status would stay mining if an error gets thrown while emitting events after mining

## 1.0.0-next.120

### Patch Changes

- 34ac999: Fixed bug with block override set missing a state root
- 34ac999: Fixed bug in tevm_call json-rpc procedure where deployedBytecode, createTrace and createAccessList were not forwarded to the underlying handler. This bug only affected users using JSON-RPC directly
- Updated dependencies [34ac999]
  - @tevm/vm@1.0.0-next.120
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/node@1.0.0-next.120
  - @tevm/state@1.0.0-next.120
  - @tevm/evm@1.0.0-next.120

## 1.0.0-next.119

### Patch Changes

- 8d58d91: Fixed bug in eth_sendRawTransaction that would cause any tx that didn't support blobs to fail

## 1.0.0-next.118

### Patch Changes

- bfba3e7: Updated every dependency in entire tevm monorepo to latest
- 1727e82: Deleted dead code
- Updated dependencies [bfba3e7]
  - @tevm/jsonrpc@1.0.0-next.118
  - @tevm/errors@1.0.0-next.118
  - @tevm/state@1.0.0-next.118
  - @tevm/utils@1.0.0-next.118
  - @tevm/evm@1.0.0-next.118
  - @tevm/vm@1.0.0-next.118
  - @tevm/address@1.0.0-next.118
  - @tevm/block@1.0.0-next.118
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/common@1.0.0-next.118
  - @tevm/contract@1.0.0-next.118
  - @tevm/node@1.0.0-next.118
  - @tevm/receipt-manager@1.0.0-next.118
  - @tevm/tx@1.0.0-next.118

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake
- Updated dependencies [5ff4b12]
- Updated dependencies [23bb9d3]
- Updated dependencies [ec30a0e]
- Updated dependencies [b53712d]
- Updated dependencies [23bb9d3]
  - @tevm/address@1.0.0-next.117
  - @tevm/state@1.0.0-next.117
  - @tevm/errors@1.0.0-next.117
  - @tevm/receipt-manager@1.0.0-next.117
  - @tevm/blockchain@1.0.0-next.117
  - @tevm/jsonrpc@1.0.0-next.117
  - @tevm/common@1.0.0-next.117
  - @tevm/block@1.0.0-next.117
  - @tevm/utils@1.0.0-next.117
  - @tevm/node@1.0.0-next.117
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
  - @tevm/node@1.0.0-next.116
  - @tevm/receipt-manager@1.0.0-next.116
  - @tevm/state@1.0.0-next.116
  - @tevm/vm@1.0.0-next.116

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
  - @tevm/node@1.0.0-next.115
  - @tevm/receipt-manager@1.0.0-next.115
  - @tevm/state@1.0.0-next.115
  - @tevm/vm@1.0.0-next.115

## 1.0.0-next.111

### Patch Changes

- bc00e14: Fixed bug in eth_getLogs not handling nubmer hex
- bc00e14: Fixed bug with eth_getLogs not handling numbered hex string logs well

## 1.0.0-next.110

### Patch Changes

- Updated dependencies [19370ed]
  - @tevm/blockchain@1.0.0-next.110
  - @tevm/evm@1.0.0-next.110
  - @tevm/node@1.0.0-next.110
  - @tevm/receipt-manager@1.0.0-next.110
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
  - @tevm/errors@1.0.0-next.109
  - @tevm/state@1.0.0-next.109
  - @tevm/utils@1.0.0-next.109
  - @tevm/node@1.0.0-next.109
  - @tevm/evm@1.0.0-next.109
  - @tevm/tx@1.0.0-next.109
  - @tevm/vm@1.0.0-next.109
  - @tevm/block@1.0.0-next.109
  - @tevm/receipt-manager@1.0.0-next.109

## 1.0.0-next.108

### Patch Changes

- @tevm/blockchain@0.0.0-next.107
- @tevm/node@1.0.0-next.108
- @tevm/state@1.0.0-next.108
- @tevm/evm@1.0.0-next.108
- @tevm/vm@1.0.0-next.108

## 2.0.0-next.107

### Patch Changes

- [#1375](https://github.com/evmts/tevm-monorepo/pull/1375) [`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bugs in eth filters and logs

- Updated dependencies [[`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29)]:
  - @tevm/utils@2.0.0-next.107
  - @tevm/address@2.0.0-next.107
  - @tevm/block@2.0.0-next.107
  - @tevm/blockchain@2.0.0-next.107
  - @tevm/common@2.0.0-next.107
  - @tevm/evm@2.0.0-next.107
  - @tevm/node@2.0.0-next.107
  - @tevm/receipt-manager@2.0.0-next.107
  - @tevm/state@2.0.0-next.107
  - @tevm/tx@2.0.0-next.107
  - @tevm/vm@2.0.0-next.107

## 2.0.0-next.105

### Minor Changes

- [#1370](https://github.com/evmts/tevm-monorepo/pull/1370) [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed tevm/base-client to tevm/node

### Patch Changes

- Updated dependencies [[`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f), [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f)]:
  - @tevm/state@2.0.0-next.105
  - @tevm/blockchain@2.0.0-next.105
  - @tevm/address@2.0.0-next.105
  - @tevm/common@2.0.0-next.105
  - @tevm/errors@2.0.0-next.105
  - @tevm/utils@2.0.0-next.105
  - @tevm/node@2.0.0-next.105
  - @tevm/evm@2.0.0-next.105
  - @tevm/vm@2.0.0-next.105
  - @tevm/receipt-manager@2.0.0-next.105
  - @tevm/block@2.0.0-next.105
  - @tevm/tx@2.0.0-next.105

## 2.0.0-next.103

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@2.0.0-next.103
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.103
  - @tevm/evm@2.0.0-next.103
  - @tevm/vm@2.0.0-next.103

## 2.0.0-next.102

### Patch Changes

- Updated dependencies [[`f69b86f`](https://github.com/evmts/tevm-monorepo/commit/f69b86f7c26d519900d224647b1bbc1ebe415a0e)]:
  - @tevm/base-client@2.0.0-next.102
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.102
  - @tevm/evm@2.0.0-next.102
  - @tevm/vm@2.0.0-next.102

## 2.0.0-next.101

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@2.0.0-next.101
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.101
  - @tevm/evm@2.0.0-next.101
  - @tevm/vm@2.0.0-next.101

## 1.1.0-next.100

### Minor Changes

- [#1314](https://github.com/evmts/tevm-monorepo/pull/1314) [`419b19f`](https://github.com/evmts/tevm-monorepo/commit/419b19f4c493636f3624ae9dd474cbade42daa26) Thanks [@roninjin10](https://github.com/roninjin10)! - Added pending block tag support to eth_getStorageAt eth_getLogs tevm_getAccount eth_getBalance eth_getCode and tevm_dumpState. All these methods also support historical blocck tags in a more robust way now too

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

- [#1318](https://github.com/evmts/tevm-monorepo/pull/1318) [`45950f7`](https://github.com/evmts/tevm-monorepo/commit/45950f758ff2a97334cd0edafca3cca656ed8f7c) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated json-rpc methods to bubble up errors from failing to build a pending client

- Updated dependencies [[`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131), [`1028d01`](https://github.com/evmts/tevm-monorepo/commit/1028d01f546938f16db73f012a33626cc71fa9ca), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131)]:
  - @tevm/receipt-manager@1.1.0-next.100
  - @tevm/base-client@1.1.0-next.100
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/address@1.1.0-next.100
  - @tevm/jsonrpc@1.1.0-next.100
  - @tevm/common@1.1.0-next.100
  - @tevm/errors@1.1.0-next.100
  - @tevm/block@1.1.0-next.100
  - @tevm/state@1.1.0-next.100
  - @tevm/utils@1.1.0-next.100
  - @tevm/evm@1.1.0-next.100
  - @tevm/tx@1.1.0-next.100
  - @tevm/vm@1.1.0-next.100

## 1.1.0-next.99

### Minor Changes

- [#1311](https://github.com/evmts/tevm-monorepo/pull/1311) [`de2a2ab`](https://github.com/evmts/tevm-monorepo/commit/de2a2ab90a262c084eea9d955d544531c41af506) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for all blocktags to eth_getCode actions and json-rpc

- [#1311](https://github.com/evmts/tevm-monorepo/pull/1311) [`de2a2ab`](https://github.com/evmts/tevm-monorepo/commit/de2a2ab90a262c084eea9d955d544531c41af506) Thanks [@roninjin10](https://github.com/roninjin10)! - Added blockTag to `tevmGetAccount` action

### Patch Changes

- Updated dependencies [[`a8c810b`](https://github.com/evmts/tevm-monorepo/commit/a8c810b87f682fb3504e6db8a0ace6ef4220e842), [`c71445a`](https://github.com/evmts/tevm-monorepo/commit/c71445a1aa729f079737ff8e53bc8b39cb70d37b)]:
  - @tevm/receipt-manager@1.1.0-next.99
  - @tevm/base-client@1.1.0-next.99
  - @tevm/blockchain@1.1.0-next.99
  - @tevm/evm@1.1.0-next.99
  - @tevm/vm@1.1.0-next.99

## 1.1.0-next.98

### Patch Changes

- [#1309](https://github.com/evmts/tevm-monorepo/pull/1309) [`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where deployedBytecode validation errors were being swallowed

- [#1309](https://github.com/evmts/tevm-monorepo/pull/1309) [`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in tevmContract where `code` property without a `to` property would fail to deploy

- [#1309](https://github.com/evmts/tevm-monorepo/pull/1309) [`6c08846`](https://github.com/evmts/tevm-monorepo/commit/6c08846503e5eae6869dad60a67091cb314cba53) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with tevmContract not properly throwing a typescript error if neither to nor code is provided

## 1.1.0-next.97

### Patch Changes

- [#1306](https://github.com/evmts/tevm-monorepo/pull/1306) [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e) Thanks [@roninjin10](https://github.com/roninjin10)! - - Increased unit test coverage of tevm/actions to 87%
  - fixed bug where we weren't properly returning tracing and access list information any errors happen during evm execution. Returning this information helps make debugging easier for users of tevm
  - Fixed bug in callHandler where some validation errors were being swallowed
  - fixed bug in setAccount and getAccount where some validation errors were being swallowed
  - fixed bug with evm not reforking state manager in situation where forkUrl is set and blockTag for a call is before
  - fixed bug with vm blockchainManager not being updated where forkUrl is set and blockTag for a call is before. This could cause state to leak from this call to the cannonical blockchain
  - fixed bug with a bad blockTag causing an unexpected `InternalError` rather than `ForkError` to be thrown
  - Fixed issue with stateOverrides not respecting the `code` property
  - fixed issue where block.cliqueSigner() on forked blocks not properly throwing an error for not being a POA network
- Updated dependencies [[`277ed48`](https://github.com/evmts/tevm-monorepo/commit/277ed48697e1e094af5ee8bed0955c823123570e), [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e)]:
  - @tevm/utils@1.1.0-next.97
  - @tevm/address@1.1.0-next.97
  - @tevm/base-client@1.1.0-next.97
  - @tevm/block@1.1.0-next.97
  - @tevm/blockchain@1.1.0-next.97
  - @tevm/common@1.1.0-next.97
  - @tevm/evm@1.1.0-next.97
  - @tevm/receipt-manager@1.1.0-next.97
  - @tevm/state@1.1.0-next.97
  - @tevm/tx@1.1.0-next.97
  - @tevm/vm@1.1.0-next.97

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

- Updated dependencies [[`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6)]:
  - @tevm/receipt-manager@1.1.0-next.96
  - @tevm/base-client@1.1.0-next.96
  - @tevm/blockchain@1.1.0-next.96
  - @tevm/address@1.1.0-next.96
  - @tevm/jsonrpc@1.1.0-next.96
  - @tevm/common@1.1.0-next.96
  - @tevm/errors@1.1.0-next.96
  - @tevm/block@1.1.0-next.96
  - @tevm/state@1.1.0-next.96
  - @tevm/utils@1.1.0-next.96
  - @tevm/evm@1.1.0-next.96
  - @tevm/tx@1.1.0-next.96
  - @tevm/vm@1.1.0-next.96

## 1.1.0-next.95

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.95
  - @tevm/base-client@1.1.0-next.95
  - @tevm/evm@1.1.0-next.95
  - @tevm/state@1.1.0-next.95

## 1.1.0-next.94

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.94
  - @tevm/base-client@1.1.0-next.94
  - @tevm/evm@1.1.0-next.94
  - @tevm/state@1.1.0-next.94

## 1.1.0-next.92

### Patch Changes

- Updated dependencies [[`7af1917`](https://github.com/evmts/tevm-monorepo/commit/7af1917c2cedfed22f62f3e6edf3e6e15a8b7ac8)]:
  - @tevm/utils@1.1.0-next.92
  - @tevm/address@1.1.0-next.92
  - @tevm/base-client@1.1.0-next.92
  - @tevm/block@1.1.0-next.92
  - @tevm/blockchain@1.1.0-next.92
  - @tevm/common@1.1.0-next.92
  - @tevm/evm@1.1.0-next.92
  - @tevm/receipt-manager@1.1.0-next.92
  - @tevm/state@1.1.0-next.92
  - @tevm/tx@1.1.0-next.92
  - @tevm/vm@1.1.0-next.92

## 1.1.0-next.91

### Patch Changes

- Updated dependencies [[`7216932`](https://github.com/evmts/tevm-monorepo/commit/72169323bb89aba7165fcbedae7d024c71664333)]:
  - @tevm/utils@1.1.0-next.91
  - @tevm/base-client@1.1.0-next.91
  - @tevm/block@1.1.0-next.91
  - @tevm/blockchain@1.1.0-next.91
  - @tevm/common@1.1.0-next.91
  - @tevm/evm@1.1.0-next.91
  - @tevm/receipt-manager@1.1.0-next.91
  - @tevm/state@1.1.0-next.91
  - @tevm/tx@1.1.0-next.91
  - @tevm/vm@1.1.0-next.91

## 1.1.0-next.90

### Patch Changes

- [#1270](https://github.com/evmts/tevm-monorepo/pull/1270) [`9141ab4`](https://github.com/evmts/tevm-monorepo/commit/9141ab4a767e811f12c77535f9d3259986e825d3) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed a race condition that can happen if client.tevmMine is called twice

- Updated dependencies [[`396157c`](https://github.com/evmts/tevm-monorepo/commit/396157c8ee742fcabeb768ba737c37a400908e3f)]:
  - @tevm/state@1.1.0-next.90
  - @tevm/base-client@1.1.0-next.90
  - @tevm/evm@1.1.0-next.90
  - @tevm/vm@1.1.0-next.90

## 1.1.0-next.88

### Patch Changes

- [#1237](https://github.com/evmts/tevm-monorepo/pull/1237) [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54) Thanks [@roninjin10](https://github.com/roninjin10)! - Internal changes to vm package

- [#1252](https://github.com/evmts/tevm-monorepo/pull/1252) [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60) Thanks [@roninjin10](https://github.com/roninjin10)! - Automatically skipBalance if 0 address on call

- Updated dependencies [[`cb2dd84`](https://github.com/evmts/tevm-monorepo/commit/cb2dd844a043fd956ab72b90ec21b80c4f606a64), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`e6f57e8`](https://github.com/evmts/tevm-monorepo/commit/e6f57e8ec4765b0520c850cff92370de50b1cc47), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60), [`0136b52`](https://github.com/evmts/tevm-monorepo/commit/0136b528fade3f557406ee52d24be35cfc2a752c), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60)]:
  - @tevm/evm@1.1.0-next.88
  - @tevm/vm@1.1.0-next.88
  - @tevm/utils@1.1.0-next.88
  - @tevm/block@1.1.0-next.88
  - @tevm/state@1.1.0-next.88
  - @tevm/base-client@1.1.0-next.88
  - @tevm/blockchain@1.1.0-next.88
  - @tevm/common@1.1.0-next.88
  - @tevm/receipt-manager@1.1.0-next.88
  - @tevm/tx@1.1.0-next.88

## 2.0.0-next.86

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Add warning if user forgot to mine

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

- Updated dependencies [[`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8), [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8)]:
  - @tevm/receipt-manager@2.0.0-next.86
  - @tevm/base-client@2.0.0-next.86
  - @tevm/blockchain@2.0.0-next.86
  - @tevm/jsonrpc@2.0.0-next.86
  - @tevm/common@2.0.0-next.86
  - @tevm/errors@2.0.0-next.86
  - @tevm/block@2.0.0-next.86
  - @tevm/state@2.0.0-next.86
  - @tevm/utils@2.0.0-next.86
  - @tevm/evm@2.0.0-next.86
  - @tevm/tx@2.0.0-next.86
  - @tevm/vm@2.0.0-next.86

## 2.0.0-next.85

### Patch Changes

- [#1235](https://github.com/evmts/tevm-monorepo/pull/1235) [`c5e7861`](https://github.com/evmts/tevm-monorepo/commit/c5e7861a91cbc93a12679e9989b666e6efef2c44) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated jsdoc

- Updated dependencies [[`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1), [`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1)]:
  - @tevm/common@2.0.0-next.85
  - @tevm/evm@2.0.0-next.85
  - @tevm/base-client@2.0.0-next.85
  - @tevm/block@2.0.0-next.85
  - @tevm/blockchain@2.0.0-next.85
  - @tevm/receipt-manager@2.0.0-next.85
  - @tevm/state@2.0.0-next.85
  - @tevm/vm@2.0.0-next.85

## 2.0.0-next.84

### Patch Changes

- [#1232](https://github.com/evmts/tevm-monorepo/pull/1232) [`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issues with error handling and added unit testing

- Updated dependencies [[`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd), [`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd)]:
  - @tevm/errors@2.0.0-next.84
  - @tevm/jsonrpc@2.0.0-next.84
  - @tevm/utils@2.0.0-next.84
  - @tevm/block@2.0.0-next.84
  - @tevm/state@2.0.0-next.84
  - @tevm/tx@2.0.0-next.84
  - @tevm/vm@2.0.0-next.84
  - @tevm/base-client@2.0.0-next.84
  - @tevm/blockchain@2.0.0-next.84
  - @tevm/common@2.0.0-next.84
  - @tevm/evm@2.0.0-next.84
  - @tevm/receipt-manager@2.0.0-next.84

## 2.0.0-next.83

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@2.0.0-next.83
  - @tevm/state@2.0.0-next.83
  - @tevm/evm@2.0.0-next.83
  - @tevm/vm@2.0.0-next.83

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

- Updated dependencies [[`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d)]:
  - @tevm/base-client@2.0.0-next.80
  - @tevm/block@2.0.0-next.80
  - @tevm/blockchain@2.0.0-next.80
  - @tevm/common@2.0.0-next.80
  - @tevm/errors@2.0.0-next.80
  - @tevm/evm@2.0.0-next.80
  - @tevm/jsonrpc@2.0.0-next.80
  - @tevm/receipt-manager@2.0.0-next.80
  - @tevm/state@2.0.0-next.80
  - @tevm/tx@2.0.0-next.80
  - @tevm/utils@2.0.0-next.80
  - @tevm/vm@2.0.0-next.80

## 2.0.0-next.79

### Minor Changes

- [#1210](https://github.com/evmts/tevm-monorepo/pull/1210) [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911) Thanks [@roninjin10](https://github.com/roninjin10)! - Add compatability for viem code property

### Patch Changes

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Update all packages for new tevm contract changes"

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- [#1213](https://github.com/evmts/tevm-monorepo/pull/1213) [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies except effect to latest

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with getAccount not prefixing storage keys with 0x

- Updated dependencies [[`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d), [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911), [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81)]:
  - @tevm/state@2.0.0-next.79
  - @tevm/base-client@2.0.0-next.79
  - @tevm/blockchain@2.0.0-next.79
  - @tevm/jsonrpc@2.0.0-next.79
  - @tevm/common@2.0.0-next.79
  - @tevm/errors@2.0.0-next.79
  - @tevm/utils@2.0.0-next.79
  - @tevm/evm@2.0.0-next.79
  - @tevm/block@2.0.0-next.79
  - @tevm/receipt-manager@2.0.0-next.79
  - @tevm/tx@2.0.0-next.79
  - @tevm/vm@2.0.0-next.79

## 1.1.0-next.78

### Patch Changes

- Updated dependencies []:
  - @tevm/base-client@1.1.0-next.78
  - @tevm/state@1.1.0-next.78
  - @tevm/evm@1.1.0-next.78
  - @tevm/vm@1.1.0-next.78

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
