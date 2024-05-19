# @tevm/client

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
