# @tevm/contract

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/procedures-types@1.0.0-next.39
  - @tevm/actions-types@1.0.0-next.39
  - @tevm/memory-client@1.0.0-next.39
  - @tevm/client-types@1.0.0-next.39
  - @tevm/base-client@1.0.0-next.39
  - @tevm/http-client@1.0.0-next.39
  - @tevm/precompiles@1.0.0-next.39
  - @tevm/decorators@1.0.0-next.39
  - @tevm/predeploys@1.0.0-next.39
  - @tevm/contract@1.0.0-next.39
  - @tevm/server@1.0.0-next.39
  - @tevm/state@1.0.0-next.39
  - @tevm/utils@1.0.0-next.39

## 1.0.0-next.38

### Patch Changes

- Updated dependencies [[`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc), [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc), [`5968a2439309bc93d01472b729809d9508c838bc`](https://github.com/evmts/tevm-monorepo/commit/5968a2439309bc93d01472b729809d9508c838bc)]:
  - @tevm/memory-client@1.0.0-next.38
  - @tevm/http-client@1.0.0-next.38
  - @tevm/precompiles@1.0.0-next.34
  - @tevm/server@1.0.0-next.33

## 1.0.0-next.37

### Patch Changes

- Updated dependencies [[`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888), [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888), [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888)]:
  - @tevm/state@1.0.0-next.37
  - @tevm/memory-client@1.0.0-next.37
  - @tevm/actions-types@1.0.0-next.33
  - @tevm/procedures-types@1.0.0-next.32
  - @tevm/http-client@1.0.0-next.34
  - @tevm/precompiles@1.0.0-next.34
  - @tevm/server@1.0.0-next.33

## 1.0.0-next.36

### Patch Changes

- Updated dependencies [[`4e1c6af34b2262fc56a68528f435958e62b0a947`](https://github.com/evmts/tevm-monorepo/commit/4e1c6af34b2262fc56a68528f435958e62b0a947)]:
  - @tevm/state@1.0.0-next.36
  - @tevm/actions-types@1.0.0-next.33
  - @tevm/memory-client@1.0.0-next.34
  - @tevm/procedures-types@1.0.0-next.32

## 1.0.0-next.35

### Patch Changes

- Updated dependencies [[`aa6b7a03f0490809e15176c832b48495921913c9`](https://github.com/evmts/tevm-monorepo/commit/aa6b7a03f0490809e15176c832b48495921913c9)]:
  - @tevm/state@1.0.0-next.35
  - @tevm/actions-types@1.0.0-next.33
  - @tevm/memory-client@1.0.0-next.34
  - @tevm/procedures-types@1.0.0-next.32

## 1.0.0-next.34

### Patch Changes

- Updated dependencies [[`3827743abb060538b5688706de6954410c16ca6d`](https://github.com/evmts/tevm-monorepo/commit/3827743abb060538b5688706de6954410c16ca6d)]:
  - @tevm/contract@1.0.0-next.34
  - @tevm/memory-client@1.0.0-next.34
  - @tevm/http-client@1.0.0-next.34
  - @tevm/precompiles@1.0.0-next.34
  - @tevm/predeploys@1.0.0-next.34
  - @tevm/server@1.0.0-next.33

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

### Patch Changes

- Updated dependencies [[`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73), [`7453edc4231d597179cc9bb117bc5df488b99c51`](https://github.com/evmts/tevm-monorepo/commit/7453edc4231d597179cc9bb117bc5df488b99c51), [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73)]:
  - @tevm/actions-types@1.0.0-next.33
  - @tevm/memory-client@1.0.0-next.33
  - @tevm/http-client@1.0.0-next.33
  - @tevm/predeploys@1.0.0-next.33
  - @tevm/state@1.0.0-next.33
  - @tevm/client-types@1.0.0-next.32
  - @tevm/procedures-types@1.0.0-next.32
  - @tevm/server@1.0.0-next.33
  - @tevm/precompiles@1.0.0-next.28

## 1.0.0-next.32

### Minor Changes

- [#921](https://github.com/evmts/tevm-monorepo/pull/921) [`08790e044ebbe72f128c0094bd3c21539f88e880`](https://github.com/evmts/tevm-monorepo/commit/08790e044ebbe72f128c0094bd3c21539f88e880) Thanks [@roninjin10](https://github.com/roninjin10)! - Added requestBulk action to execute an array of requests

### Patch Changes

- [#817](https://github.com/evmts/tevm-monorepo/pull/817) [`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where some supported methods such as eth_signTransaction were falsely being filtered as unsupported methods by some tevm clients

- Updated dependencies [[`0ea92a4a50e5daa90a26a5b168a0b75926103360`](https://github.com/evmts/tevm-monorepo/commit/0ea92a4a50e5daa90a26a5b168a0b75926103360), [`08790e044ebbe72f128c0094bd3c21539f88e880`](https://github.com/evmts/tevm-monorepo/commit/08790e044ebbe72f128c0094bd3c21539f88e880), [`c92636108f86eb8e0c9c67e40efb6782d7b5f18b`](https://github.com/evmts/tevm-monorepo/commit/c92636108f86eb8e0c9c67e40efb6782d7b5f18b)]:
  - @tevm/procedures-types@1.0.0-next.32
  - @tevm/memory-client@1.0.0-next.32
  - @tevm/client-types@1.0.0-next.32
  - @tevm/server@1.0.0-next.32
  - @tevm/actions-types@1.0.0-next.32
  - @tevm/http-client@1.0.0-next.32
  - @tevm/precompiles@1.0.0-next.28

## 1.0.0-next.31

### Patch Changes

- [#919](https://github.com/evmts/tevm-monorepo/pull/919) [`ea49d992970dada46c66a590109b31a7119cc426`](https://github.com/evmts/tevm-monorepo/commit/ea49d992970dada46c66a590109b31a7119cc426) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with positive inputs not passing validation

- Updated dependencies []:
  - @tevm/server@1.0.0-next.31
  - @tevm/memory-client@1.0.0-next.31
  - @tevm/http-client@1.0.0-next.30
  - @tevm/precompiles@1.0.0-next.28

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

### Patch Changes

- Updated dependencies [[`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56)]:
  - @tevm/procedures-types@1.0.0-next.30
  - @tevm/actions-types@1.0.0-next.30
  - @tevm/memory-client@1.0.0-next.30
  - @tevm/client-types@1.0.0-next.30
  - @tevm/state@1.0.0-next.30
  - @tevm/server@1.0.0-next.28
  - @tevm/http-client@1.0.0-next.30
  - @tevm/precompiles@1.0.0-next.28

## 1.0.0-next.29

### Patch Changes

- [#915](https://github.com/evmts/tevm-monorepo/pull/915) [`ab2f3b3234a5b9633830aa4bf21f13fb4a787420`](https://github.com/evmts/tevm-monorepo/commit/ab2f3b3234a5b9633830aa4bf21f13fb4a787420) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in tevm package with types not correctly building leading to stale types

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/actions-types@1.0.0-next.28
  - @tevm/client-types@1.0.0-next.28
  - @tevm/contract@1.0.0-next.28
  - @tevm/errors@1.0.0-next.28
  - @tevm/http-client@1.0.0-next.28
  - @tevm/jsonrpc@1.0.0-next.28
  - @tevm/memory-client@1.0.0-next.28
  - @tevm/precompiles@1.0.0-next.28
  - @tevm/predeploys@1.0.0-next.28
  - @tevm/procedures-types@1.0.0-next.28
  - @tevm/server@1.0.0-next.28

## 1.0.0-next.18

### Minor Changes

- [#911](https://github.com/evmts/tevm-monorepo/pull/911) [`44ea5267367336649a2c59de068d60939d68e978`](https://github.com/evmts/tevm-monorepo/commit/44ea5267367336649a2c59de068d60939d68e978) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump barrel package version

## 1.0.0-next.17

### Patch Changes

- Updated dependencies [[`b367229ff0dde9c6f1b2888913b3103e5caad95d`](https://github.com/evmts/tevm-monorepo/commit/b367229ff0dde9c6f1b2888913b3103e5caad95d)]:
  - @tevm/actions-types@1.0.0-next.26
  - @tevm/memory-client@1.0.0-next.26
  - @tevm/client-types@1.0.0-next.26
  - @tevm/http-client@1.0.0-next.26
  - @tevm/procedures-types@1.0.0-next.23
  - @tevm/server@1.0.0-next.25
  - @tevm/precompiles@1.0.0-next.25

## 1.0.0-next.16

### Patch Changes

- [#728](https://github.com/evmts/tevm-monorepo/pull/728) [`c369b21463e164e1a1f952719aa51a7924b4152f`](https://github.com/evmts/tevm-monorepo/commit/c369b21463e164e1a1f952719aa51a7924b4152f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for user defined precompiles

- Updated dependencies [[`2bd52ba53367bd0ee5280aab21f9308fd0368116`](https://github.com/evmts/tevm-monorepo/commit/2bd52ba53367bd0ee5280aab21f9308fd0368116), [`c369b21463e164e1a1f952719aa51a7924b4152f`](https://github.com/evmts/tevm-monorepo/commit/c369b21463e164e1a1f952719aa51a7924b4152f)]:
  - @tevm/actions-types@1.0.0-next.25
  - @tevm/memory-client@1.0.0-next.25
  - @tevm/precompiles@1.0.0-next.25
  - @tevm/client-types@1.0.0-next.24
  - @tevm/procedures-types@1.0.0-next.23
  - @tevm/server@1.0.0-next.25
  - @tevm/http-client@1.0.0-next.25

## 1.0.0-next.15

### Patch Changes

- Updated dependencies [[`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d), [`212ce6dc0269af79c5ecf68d9f509a093a98867e`](https://github.com/evmts/tevm-monorepo/commit/212ce6dc0269af79c5ecf68d9f509a093a98867e), [`1056dbdf11533d1bcb402ff506194b381b1dd70c`](https://github.com/evmts/tevm-monorepo/commit/1056dbdf11533d1bcb402ff506194b381b1dd70c), [`47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d`](https://github.com/evmts/tevm-monorepo/commit/47d7399f4e5cab5bd2e09cd08fe359bcfb7d6a8d)]:
  - @tevm/actions-types@1.0.0-next.24
  - @tevm/memory-client@1.0.0-next.24
  - @tevm/http-client@1.0.0-next.24
  - @tevm/client-types@1.0.0-next.24
  - @tevm/procedures-types@1.0.0-next.23
  - @tevm/server@1.0.0-next.24

## 1.0.0-next.14

### Minor Changes

- [#821](https://github.com/evmts/tevm-monorepo/pull/821) [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Added Load State and Dump State to the API.

  These handlers allow one to read and write the entire tevm state similar to [load state and dump state in anvil](https://book.getfoundry.sh/reference/cli/anvil). This can be used to persist the state on disk or browser cache

- [#844](https://github.com/evmts/tevm-monorepo/pull/844) [`f857279f82aed79be8785fc02b5871fd52659b85`](https://github.com/evmts/tevm-monorepo/commit/f857279f82aed79be8785fc02b5871fd52659b85) Thanks [@roninjin10](https://github.com/roninjin10)! - Added Next.js and Express handlers to @tevm/server

### Patch Changes

- [#846](https://github.com/evmts/tevm-monorepo/pull/846) [`1e50901789c983dc6d8f7e078d25ab999afcb085`](https://github.com/evmts/tevm-monorepo/commit/1e50901789c983dc6d8f7e078d25ab999afcb085) Thanks [@roninjin10](https://github.com/roninjin10)! - Consistently name all bundler plugins with rollup convention of bundlerPluginTevm like vitePluginTevm or WebpackPluginTevm

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256), [`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256), [`de81ac31460bb642dad401571ad3c1d81bdbef2d`](https://github.com/evmts/tevm-monorepo/commit/de81ac31460bb642dad401571ad3c1d81bdbef2d), [`fd6d6aee21b8d72ab37d7b9117231f68812e2256`](https://github.com/evmts/tevm-monorepo/commit/fd6d6aee21b8d72ab37d7b9117231f68812e2256), [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539), [`37b936fd4a8095cd79875f5f1ca43f09442e653f`](https://github.com/evmts/tevm-monorepo/commit/37b936fd4a8095cd79875f5f1ca43f09442e653f), [`f857279f82aed79be8785fc02b5871fd52659b85`](https://github.com/evmts/tevm-monorepo/commit/f857279f82aed79be8785fc02b5871fd52659b85)]:
  - @tevm/memory-client@1.0.0-next.23
  - @tevm/jsonrpc@1.0.0-next.23
  - @tevm/actions-types@1.0.0-next.23
  - @tevm/client-types@1.0.0-next.23
  - @tevm/contract@1.0.0-next.23
  - @tevm/errors@1.0.0-next.23
  - @tevm/http-client@1.0.0-next.23
  - @tevm/predeploys@1.0.0-next.23
  - @tevm/procedures-types@1.0.0-next.23
  - @tevm/server@1.0.0-next.23

## 1.0.0-next.13

### Minor Changes

- [#822](https://github.com/evmts/tevm-monorepo/pull/822) [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth methods such as chainId getCode and getStorageAt to Tevm.eth.

### Patch Changes

- [#804](https://github.com/evmts/tevm-monorepo/pull/804) [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290) Thanks [@roninjin10](https://github.com/roninjin10)! - Update tevm package to export all of tevm. Now users only need to `npm install tevm` to use all of tevm

- Updated dependencies [[`87427f30`](https://github.com/evmts/tevm-monorepo/commit/87427f30aeaba4c191d432e23a58d589d02e269b), [`8b3218b1`](https://github.com/evmts/tevm-monorepo/commit/8b3218b129ed43cf173a369cbe6b636365748e77), [`cae17b7d`](https://github.com/evmts/tevm-monorepo/commit/cae17b7d9e4c65a28649a37fcf541d400c951127), [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80), [`3b5f6729`](https://github.com/evmts/tevm-monorepo/commit/3b5f67291550b590dda16471059a05bd10fe324d), [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57), [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`941a630a`](https://github.com/evmts/tevm-monorepo/commit/941a630ada850220d62f55719f202f33e216de7f), [`98d76506`](https://github.com/evmts/tevm-monorepo/commit/98d76506e5947678eb34127dcc6e4da7fa13cb68)]:
  - @tevm/api@1.0.0-next.22
  - @tevm/vm@1.0.0-next.22
  - @tevm/viem@1.0.0-next.22
  - @tevm/contract@1.0.0-next.22
  - @tevm/client@1.0.0-next.22

## 1.0.0-next.12

### Patch Changes

- [#692](https://github.com/evmts/tevm-monorepo/pull/692) [`31c5f265`](https://github.com/evmts/tevm-monorepo/commit/31c5f2654137c521bc0f3e66956de69a0a7a1c88) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to pass deployedBytecode to contract action creators

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/tevm-monorepo/pull/690) [`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to tevm contract instances

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/tevm-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

## 1.0.0-next.7

### Patch Changes

- [#682](https://github.com/evmts/tevm-monorepo/pull/682) [`da8dec29`](https://github.com/evmts/tevm-monorepo/commit/da8dec29359c168538ea68dfd4f18b306f9bce66) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with bytecode not being passed into contract actions like read write and events

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/tevm-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to Tevm bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

## 1.0.0-next.0

### Major Changes

- [#485](https://github.com/evmts/tevm-monorepo/pull/485) [`570c4ed6`](https://github.com/evmts/tevm-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed global Address config and external contracts from Tevm to simplify the API

- [#486](https://github.com/evmts/tevm-monorepo/pull/486) [`a1b10f21`](https://github.com/evmts/tevm-monorepo/commit/a1b10f21cab6183b7fb599983e03677250310dc2) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed TevmContract to use human readable ABIs by default

  Before
  <img width="429" alt="image" src="https://github.com/evmts/tevm-monorepo/assets/35039927/74ce632f-bc39-4cc7-85ee-1f6cd0014005">

  After
  <img width="527" alt="image" src="https://github.com/evmts/tevm-monorepo/assets/35039927/4f4ea9a6-adfb-4751-9446-dd721118f3a9">

### Patch Changes

- [#548](https://github.com/evmts/tevm-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/tevm-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#611](https://github.com/evmts/tevm-monorepo/pull/611) [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#492](https://github.com/evmts/tevm-monorepo/pull/492) [`2349d58c`](https://github.com/evmts/tevm-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all NPM dependencies to latest

## 0.11.2

### Patch Changes

- [#483](https://github.com/evmts/tevm-monorepo/pull/483) [`f3b2b21`](https://github.com/evmts/tevm-monorepo/commit/f3b2b2184aad4dbefd1c840bae72dcf9aff4a1fc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with write() typescript type falsely not returning functionName. This would previously cause issues where typescript would falsely think functionName was not provided even though it was there at runtime.

## 0.10.0

### Patch Changes

- [#475](https://github.com/evmts/tevm-monorepo/pull/475) [`cb83c0c`](https://github.com/evmts/tevm-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e) Thanks [@roninjin10](https://github.com/roninjin10)! - Added snapshot test of vite bundler build outputs

## 0.8.1

### Patch Changes

- [#453](https://github.com/evmts/tevm-monorepo/pull/453) [`c23302a`](https://github.com/evmts/tevm-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all Tevm changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @tevm/ts-plugin@main`

## 0.8.0

### Minor Changes

- [#438](https://github.com/evmts/tevm-monorepo/pull/438) [`eedb7e0`](https://github.com/evmts/tevm-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b) Thanks [@roninjin10](https://github.com/roninjin10)! - Improve peformance by 98% (5x) testing against 101 simple NFT contract imports

  Major change: remove bytecode from Tevm. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly. In future bytecode will be brought back as an optional prop

  This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

  Because Tevm is still considered in alpha this will not cause a major semver bump

### Patch Changes

- [#442](https://github.com/evmts/tevm-monorepo/pull/442) [`b020298`](https://github.com/evmts/tevm-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in Tevm is consistently updated to it's latest version using `pnpm up --latest`

## 0.6.0

### Patch Changes

- [#367](https://github.com/evmts/tevm-monorepo/pull/367) [`6da3fe7`](https://github.com/evmts/tevm-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with read not filtering out events from it's returned object

- [#379](https://github.com/evmts/tevm-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/tevm-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files

- [#384](https://github.com/evmts/tevm-monorepo/pull/384) [`6dd223b`](https://github.com/evmts/tevm-monorepo/commit/6dd223b0b625bd7dcbea7537f053b32457761955) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgrade deps to latest versions

- [#367](https://github.com/evmts/tevm-monorepo/pull/367) [`6da3fe7`](https://github.com/evmts/tevm-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516) Thanks [@roninjin10](https://github.com/roninjin10)! - Added 100% test coverage to @tevm/contract

## 0.5.6

### Patch Changes

- [#346](https://github.com/evmts/tevm-monorepo/pull/346) [`6d9365d`](https://github.com/evmts/tevm-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21) Thanks [@roninjin10](https://github.com/roninjin10)! - Change naming to Tevm from Tevm

## 0.5.4

### Patch Changes

- [#337](https://github.com/evmts/tevm-monorepo/pull/337) [`2b8b5ed`](https://github.com/evmts/tevm-monorepo/commit/2b8b5ed9852c32e15a7466f00f4ca9c0458cfeef) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue resolving abitype

## 0.5.3

### Patch Changes

- [#335](https://github.com/evmts/tevm-monorepo/pull/335) [`2dc1950`](https://github.com/evmts/tevm-monorepo/commit/2dc19507c9d957948dcff8f65a359fc25b0ceb10) Thanks [@roninjin10](https://github.com/roninjin10)! - Downgrade abitype to 8.x

## 0.5.2

### Patch Changes

- [#333](https://github.com/evmts/tevm-monorepo/pull/333) [`cdbe2b1`](https://github.com/evmts/tevm-monorepo/commit/cdbe2b14d3a9b40ea37898829bc982b5e76e3c4c) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with including wagmi and viem as peer dependencies

## 0.5.1

### Patch Changes

- [#328](https://github.com/evmts/tevm-monorepo/pull/328) [`cec44b5`](https://github.com/evmts/tevm-monorepo/commit/cec44b5042bc76c21a9b695383714642c2b44da6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with abitype subdep

## 0.5.0

### Patch Changes

- [#308](https://github.com/evmts/tevm-monorepo/pull/308) [`0bd5b45`](https://github.com/evmts/tevm-monorepo/commit/0bd5b4511e292380a7ac87a898d22dbd32df9e35) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with `args` key being undefined rather than not existing in Object.keys

- [#307](https://github.com/evmts/tevm-monorepo/pull/307) [`2ab7c02`](https://github.com/evmts/tevm-monorepo/commit/2ab7c022520fe3c03f337d51dc0f7875830492f1) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all subdependencies

## 0.3.1

### Patch Changes

- [#269](https://github.com/evmts/tevm-monorepo/pull/269) [`1f6919c`](https://github.com/evmts/tevm-monorepo/commit/1f6919cfc54648499129d3642ddbb64568b1e798) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed types. Changed bytecode to `0x${string}` and made chainId type accept a number

## 0.3.0

### Minor Changes

- [#259](https://github.com/evmts/tevm-monorepo/pull/259) [`7ad7463`](https://github.com/evmts/tevm-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bytecode to Tevm contracts

### Patch Changes

- [#258](https://github.com/evmts/tevm-monorepo/pull/258) [`9a9b963`](https://github.com/evmts/tevm-monorepo/commit/9a9b96327cd2f8415cf09a471a7589fa3df90394) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with handling overloaded functions

## 0.2.0

### Minor Changes

- [#252](https://github.com/evmts/tevm-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/tevm-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed Tevm configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/tevm-monorepo/pull/251) [`52732a1`](https://github.com/evmts/tevm-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

## 0.1.2

### Patch Changes

- [#221](https://github.com/evmts/tevm-monorepo/pull/221) [`ab40941`](https://github.com/evmts/tevm-monorepo/commit/ab40941221c4edacce16659ef88bdfdb90c325bb) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with wagmi not liking empty arrays for functions that take no args

- [#219](https://github.com/evmts/tevm-monorepo/pull/219) [`058d904`](https://github.com/evmts/tevm-monorepo/commit/058d90474598ea790d4de9fd8501381a77edbcb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing types in TevmContract

## 0.1.1

### Patch Changes

- Fixed bug with missing args type for writes

## 0.1.0

### Minor Changes

- [#213](https://github.com/evmts/tevm-monorepo/pull/213) [`e21f2f4`](https://github.com/evmts/tevm-monorepo/commit/e21f2f4fbdafc7d6d859f513afa319b9812826f0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added humanReadableAbi property to Tevm contracts

- [#212](https://github.com/evmts/tevm-monorepo/pull/212) [`88ec554`](https://github.com/evmts/tevm-monorepo/commit/88ec554a592d29aaba0a0d69ec61fd75118e817c) Thanks [@roninjin10](https://github.com/roninjin10)! - Added event support to Tevm contracts

- [#211](https://github.com/evmts/tevm-monorepo/pull/211) [`877c137`](https://github.com/evmts/tevm-monorepo/commit/877c137dfbe8a143099ddb0656236c35bceb2f87) Thanks [@roninjin10](https://github.com/roninjin10)! - Added lazy tevm usage to use tevm without args

### Patch Changes

- [`2a31d64`](https://github.com/evmts/tevm-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.4-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/tevm-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.2

### Patch Changes

- Release working proof of concept
