# @tevm/client

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/contract@1.0.0-next.39
  - @tevm/viem@1.0.0-next.39

## 1.0.0-next.38

### Patch Changes

- Updated dependencies [[`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc)]:
  - @tevm/viem@1.0.0-next.38

## 1.0.0-next.34

### Patch Changes

- Updated dependencies [[`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d)]:
  - @tevm/contract@1.0.0-next.34
  - @tevm/viem@1.0.0-next.33

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

### Patch Changes

- Updated dependencies [[`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73)]:
  - @tevm/viem@1.0.0-next.33

## 1.0.0-next.32

### Patch Changes

- Updated dependencies [[`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360)]:
  - @tevm/viem@1.0.0-next.32

## 1.0.0-next.30

### Patch Changes

- Updated dependencies [[`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56)]:
  - @tevm/viem@1.0.0-next.30

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/viem@1.0.0-next.28
  - @tevm/contract@1.0.0-next.28

## 1.0.0-next.26

### Minor Changes

- [#904](https://github.com/evmts/tevm-monorepo/pull/904) [`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth_accounts eth_sign and eth_signTransaction JSON-RPC support. Added ethAccounts ethSign and ethSignTransaction actions. Added `accounts` prop to tevm client. The accounts used are the test accounts that are also used by ganache anvil and hardhat

### Patch Changes

- Updated dependencies [[`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d)]:
  - @tevm/viem@1.0.0-next.26

## 1.0.0-next.25

### Patch Changes

- Updated dependencies [[`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116)]:
  - @tevm/viem@1.0.0-next.25

## 1.0.0-next.24

### Minor Changes

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed gasLimit to gas in all params to be more consistent with ethereum spec

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ethCall support to all clients

### Patch Changes

- Updated dependencies [[`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d)]:
  - @tevm/viem@1.0.0-next.24

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`37b936fd4a8095cd79875f5f1ca43f09442e653f`](https://github.com/evmts/tevm-monorepo/commit/37b936fd4a8095cd79875f5f1ca43f09442e653f)]:
  - @tevm/viem@1.0.0-next.23
  - @tevm/contract@1.0.0-next.23

## 1.0.0-next.22

### Patch Changes

- Updated dependencies [[`8b3218b1`](https://github.com/evmts/tevm-monorepo/commit/8b3218b129ed43cf173a369cbe6b636365748e77), [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80), [`3b5f6729`](https://github.com/evmts/tevm-monorepo/commit/3b5f67291550b590dda16471059a05bd10fe324d), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`98d76506`](https://github.com/evmts/tevm-monorepo/commit/98d76506e5947678eb34127dcc6e4da7fa13cb68)]:
  - @tevm/vm@1.0.0-next.22
  - @tevm/viem@1.0.0-next.22
  - @tevm/contract@1.0.0-next.22
