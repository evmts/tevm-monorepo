# @tevm/contract

## 1.1.0-next.58

### Minor Changes

- [#1114](https://github.com/evmts/tevm-monorepo/pull/1114) [`7ba5242`](https://github.com/evmts/tevm-monorepo/commit/7ba5242876211af2ded7d81cb046ae247aa17a27) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new JSON-RPC endpoints eth_getBlockByHash, eth_getBlockByNumber, eth_getBlockTransactionCountByHash, eth_getBlockTransactionCountByNumber, eth_getTransactionByHash, eth_getTransactionByBlockHashAndIndex, eth_getTransactionByBlockNumberAndIndex, and eth_blobBaseFee

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@1.1.0-next.57

## 1.1.0-next.57

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@1.1.0-next.57
  - @tevm/block@1.1.0-next.57

## 1.1.0-next.56

### Patch Changes

- [#1109](https://github.com/evmts/tevm-monorepo/pull/1109) [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with blobGasUsed being '0x' rather than undefined. This causes issues with viem decoding.

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784), [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784), [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784), [`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/block@1.1.0-next.56
  - @tevm/actions@1.1.0-next.56

## 1.1.0-next.55

### Patch Changes

- Updated dependencies [[`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8), [`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8)]:
  - @tevm/actions@1.1.0-next.55

## 1.1.0-next.54

### Patch Changes

- Updated dependencies [[`f04be52`](https://github.com/evmts/tevm-monorepo/commit/f04be524126dde2d1642e53af6ab54c3b42d9cf7)]:
  - @tevm/actions@1.1.0-next.54

## 1.1.0-next.53

### Patch Changes

- Updated dependencies [[`214a814`](https://github.com/evmts/tevm-monorepo/commit/214a81453d7a4dab647e7c1f91fa4ada3d3939da), [`db1fe77`](https://github.com/evmts/tevm-monorepo/commit/db1fe776b0e0f0f2ccd5421109e9ec8b6bb78eff)]:
  - @tevm/actions@1.1.0-next.53

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/actions@1.1.0-next.52
  - @tevm/block@1.1.0-next.52

## 1.1.0-next.50

### Patch Changes

- Updated dependencies [[`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4)]:
  - @tevm/actions@1.1.0-next.50

## 1.1.0-next.49

### Patch Changes

- Updated dependencies [[`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8)]:
  - @tevm/actions@1.1.0-next.49

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/actions@1.1.0-next.47
  - @tevm/block@1.1.0-next.47

## 1.1.0-next.46

### Patch Changes

- Updated dependencies [[`d77e373`](https://github.com/evmts/tevm-monorepo/commit/d77e373694960e268a4b56a94dea676911ec0af1), [`77fb31d`](https://github.com/evmts/tevm-monorepo/commit/77fb31dd3e4642495860b3bde1c6bc6527f2bb19)]:
  - @tevm/actions@1.1.0-next.46
  - @tevm/block@1.1.0-next.46

## 1.1.0-next.45

### Minor Changes

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability for tevm_getAccount procedure and getAccount action to optionally return contract storage

- [#1042](https://github.com/evmts/tevm-monorepo/pull/1042) [`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new tevm_mine and anvil_mine support for mining blocks. This includes the JSON-RPC support as well as a new tevm.mine() action to the main tevm api

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added stateOverrides and blockOverrides to tevm_call, tevm_contract, tevm_script, eth_call, and their associated JSON-RPC procedures

- [`5bc2874`](https://github.com/evmts/tevm-monorepo/commit/5bc2874287bce7c3ccec0f543ba719b600e209cb) - Added eth*sendTransaction and eth_sendRawTransaction along with various anvil* methods

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for setting contract storage to tevm_setAccount and the setAccount action"

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- Updated dependencies [[`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948), [`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8), [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948), [`cd536c2`](https://github.com/evmts/tevm-monorepo/commit/cd536c269b6a1590a0e25e1fe89865dc1464852a), [`ca9ea64`](https://github.com/evmts/tevm-monorepo/commit/ca9ea649ce016b6684b713643a2229d67a18cd62), [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`5bc2874`](https://github.com/evmts/tevm-monorepo/commit/5bc2874287bce7c3ccec0f543ba719b600e209cb), [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948)]:
  - @tevm/actions@1.1.0-next.45
  - @tevm/block@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- Updated dependencies [[`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6)]:
  - @tevm/actions@1.0.0-next.42

## 1.0.0-next.41

### Minor Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] The action and procedure factory functions now take the new client type

- [#973](https://github.com/evmts/tevm-monorepo/pull/973) [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new JSON-RPC support

  - eth_coinbase
  - eth_sendTransaction
  - eth_mining (always false for now)
  - eth_syncing (always false for now)
  - anvil_setCode hardhat_setCode ganache_setCode
  - anvil_setBalance hardhat_setBalance ganache_setBalance
  - anvil_setChainId hardhat_setChainId ganache_setChainId
  - anvil_setNonce hardhat_setNonce ganache_setNonce

### Patch Changes

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with eth_chainId returning chain ID 900 instead of the underlying chain id in forked and proxy mode

- [#971](https://github.com/evmts/tevm-monorepo/pull/971) [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with getAccount type returning optional properties that are not optional

- Updated dependencies [[`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619), [`80e199cff2c2cf0125f1ed62262ca32502f7c619`](https://github.com/evmts/tevm-monorepo/commit/80e199cff2c2cf0125f1ed62262ca32502f7c619)]:
  - @tevm/actions@1.0.0-next.41

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a), [`6c562883dee460556d3daf01fecbc72afa2321c9`](https://github.com/evmts/tevm-monorepo/commit/6c562883dee460556d3daf01fecbc72afa2321c9), [`2e9595904812ccab8382ceae3c04c8820d1aca61`](https://github.com/evmts/tevm-monorepo/commit/2e9595904812ccab8382ceae3c04c8820d1aca61)]:
  - @tevm/actions@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/actions@1.0.0-next.39

## 1.0.0-next.38

### Patch Changes

- [#940](https://github.com/evmts/tevm-monorepo/pull/940) [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with JSON-RPC not correctly using fork urls in action handlers

- [#940](https://github.com/evmts/tevm-monorepo/pull/940) [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug preventing eth_call from working because it was calling tevm_call instead

## 1.0.0-next.37

### Minor Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/vm package to wrap the ethereumjs vm with a TevmVm class that handles custom tevm functionality

### Patch Changes

- Updated dependencies [[`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888), [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888)]:
  - @tevm/actions@1.0.0-next.37

## 1.0.0-next.34

### Patch Changes

- Updated dependencies [[`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d)]:
  - @tevm/actions@1.0.0-next.34

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

### Patch Changes

- Updated dependencies [[`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73)]:
  - @tevm/actions@1.0.0-next.33

## 1.0.0-next.32

### Patch Changes

- [#817](https://github.com/evmts/tevm-monorepo/pull/817) [`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where some supported methods such as eth_signTransaction were falsely being filtered as unsupported methods by some tevm clients

- Updated dependencies []:
  - @tevm/actions@1.0.0-next.31

## 1.0.0-next.31

### Patch Changes

- Updated dependencies []:
  - @tevm/actions@1.0.0-next.31

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

### Patch Changes

- Updated dependencies [[`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56)]:
  - @tevm/actions@1.0.0-next.30

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/actions@1.0.0-next.28

## 1.0.0-next.26

### Minor Changes

- [#904](https://github.com/evmts/tevm-monorepo/pull/904) [`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth_accounts eth_sign and eth_signTransaction JSON-RPC support. Added ethAccounts ethSign and ethSignTransaction actions. Added `accounts` prop to tevm client. The accounts used are the test accounts that are also used by ganache anvil and hardhat

### Patch Changes

- Updated dependencies [[`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d)]:
  - @tevm/actions@1.0.0-next.26

## 1.0.0-next.25

### Minor Changes

- [#888](https://github.com/evmts/tevm-monorepo/pull/888) [`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for eth_call JSON-RPC and the matching client.eth.call action

### Patch Changes

- Updated dependencies [[`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116)]:
  - @tevm/actions@1.0.0-next.25

## 1.0.0-next.24

### Minor Changes

- [#882](https://github.com/evmts/tevm-monorepo/pull/882) [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added the eth_call handler and JSON-RPC procedure

### Patch Changes

- Updated dependencies [[`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d)]:
  - @tevm/actions@1.0.0-next.24

## 1.0.0-next.23

### Minor Changes

- [#821](https://github.com/evmts/tevm-monorepo/pull/821) [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Added Load State and Dump State to the API.

  These handlers allow one to read and write the entire tevm state similar to [load state and dump state in anvil](https://book.getfoundry.sh/reference/cli/anvil). This can be used to persist the state on disk or browser cache

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3)]:
  - @tevm/actions@1.0.0-next.23

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

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/procedures package. This package implements the @tevm/api JSON-RPC api fully with ethereumjs EVM

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
