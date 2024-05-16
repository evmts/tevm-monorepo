# @tevm/contract

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/utils@1.1.0-next.52

## 1.1.0-next.50

### Minor Changes

- [#1083](https://github.com/evmts/tevm-monorepo/pull/1083) [`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4) Thanks [@roninjin10](https://github.com/roninjin10)! - Added jsonrpc support for eth_getLogs to @tevm/procedures

### Patch Changes

- [#1083](https://github.com/evmts/tevm-monorepo/pull/1083) [`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed wrong type for FilterLogs in JSON-RPC responses to return Hex instead of BigInt

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/utils@1.1.0-next.47

## 1.1.0-next.45

### Minor Changes

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability for tevm_getAccount procedure and getAccount action to optionally return contract storage

- [#1042](https://github.com/evmts/tevm-monorepo/pull/1042) [`2a00b2f`](https://github.com/evmts/tevm-monorepo/commit/2a00b2fe10171aaa0607aed66c29d8df8c3437c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new tevm_mine and anvil_mine support for mining blocks. This includes the JSON-RPC support as well as a new tevm.mine() action to the main tevm api

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added stateOverrides and blockOverrides to tevm_call, tevm_contract, tevm_script, eth_call, and their associated JSON-RPC procedures

- [`5bc2874`](https://github.com/evmts/tevm-monorepo/commit/5bc2874287bce7c3ccec0f543ba719b600e209cb) - Added eth*sendTransaction and eth_sendRawTransaction along with various anvil* methods

- [#976](https://github.com/evmts/tevm-monorepo/pull/976) [`46311bb`](https://github.com/evmts/tevm-monorepo/commit/46311bbff7f9de5acc2fa48fafad4ea2ddc60948) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for setting contract storage to tevm_setAccount and the setAccount action"

### Patch Changes

- Updated dependencies [[`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/utils@1.1.0-next.45

## 1.0.0-next.41

### Minor Changes

- [#973](https://github.com/evmts/tevm-monorepo/pull/973) [`e4aad5e157b2452833c6f88afd29ac3b219719c7`](https://github.com/evmts/tevm-monorepo/commit/e4aad5e157b2452833c6f88afd29ac3b219719c7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new JSON-RPC support

  - eth_coinbase
  - eth_sendTransaction
  - eth_mining (always false for now)
  - eth_syncing (always false for now)
  - anvil_setCode hardhat_setCode ganache_setCode
  - anvil_setBalance hardhat_setBalance ganache_setBalance
  - anvil_setChainId hardhat_setChainId ganache_setChainId
  - anvil_setNonce hardhat_setNonce ganache_setNonce

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/utils@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/utils@1.0.0-next.39

## 1.0.0-next.32

### Minor Changes

- [#921](https://github.com/evmts/tevm-monorepo/pull/921) [`08790e044ebbe72f128c0094bd3c21539f88e880`](https://github.com/evmts/tevm-monorepo/commit/08790e044ebbe72f128c0094bd3c21539f88e880) Thanks [@roninjin10](https://github.com/roninjin10)! - Added requestBulk action to execute an array of requests

### Patch Changes

- [#817](https://github.com/evmts/tevm-monorepo/pull/817) [`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where some supported methods such as eth_signTransaction were falsely being filtered as unsupported methods by some tevm clients

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports

## 1.0.0-next.22

### Minor Changes

- [#820](https://github.com/evmts/tevm-monorepo/pull/820) [`cae17b7d`](https://github.com/evmts/tevm-monorepo/commit/cae17b7d9e4c65a28649a37fcf541d400c951127) Thanks [@roninjin10](https://github.com/roninjin10)! - Added all eth*\* debug*\_ and anvil\_\_ JSON-rpc methods and handlers to API.

- [#822](https://github.com/evmts/tevm-monorepo/pull/822) [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth methods such as chainId getCode and getStorageAt to Tevm.eth.

### Patch Changes

- [#811](https://github.com/evmts/tevm-monorepo/pull/811) [`87427f30`](https://github.com/evmts/tevm-monorepo/commit/87427f30aeaba4c191d432e23a58d589d02e269b) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with EVM errors requiring importing ethereumjs enum to typematch

- [#800](https://github.com/evmts/tevm-monorepo/pull/800) [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed TevmClient type to Tevm

- [#800](https://github.com/evmts/tevm-monorepo/pull/800) [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57) Thanks [@roninjin10](https://github.com/roninjin10)! - Added JSDOC to @tevm/api

- [#808](https://github.com/evmts/tevm-monorepo/pull/808) [`941a630a`](https://github.com/evmts/tevm-monorepo/commit/941a630ada850220d62f55719f202f33e216de7f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with 'to' and 'error' properties not quite working correctly for tevm. To was listed as require instead of only existing when no errors.

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Created @tevm/api package. @tevm/api is a type-only package that specifies the Tevm JSON-RPC API in detail. This API is implemented by other packages most notably @tevm/procedures which provide low level implementation of the Tevm API around ethereumjs

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
