# @tevm/contract

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
