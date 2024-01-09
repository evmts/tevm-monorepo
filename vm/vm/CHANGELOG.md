# @tevm/contract

## 1.0.0-next.21

### Minor Changes

- [#769](https://github.com/evmts/tevm-monorepo/pull/769) [`1b056673`](https://github.com/evmts/tevm-monorepo/commit/1b056673f0523c1f026281a5748f6146c7c4358e) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Added allowUnlimitedContractSize option to Tevm VM

- [#753](https://github.com/evmts/tevm-monorepo/pull/753) [`1e6ded1f`](https://github.com/evmts/tevm-monorepo/commit/1e6ded1f810fa9e5d4a04867fff174a1dde5a665) Thanks [@roninjin10](https://github.com/roninjin10)! - [Breaking] Migrate classes to factory functions

- [#777](https://github.com/evmts/tevm-monorepo/pull/777) [`143418bb`](https://github.com/evmts/tevm-monorepo/commit/143418bb6282e98622cb5c0fb4ab677382f5dc9d) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Add predeploy contract option to createTevm

- [#774](https://github.com/evmts/tevm-monorepo/pull/774) [`b77e4dc5`](https://github.com/evmts/tevm-monorepo/commit/b77e4dc56cf14c512031e31991e3d8b4fe6d5a45) Thanks [@roninjin10](https://github.com/roninjin10)! - Added optimistic updates to the viem extension writeContractOptimistic. It takes same parameters as writeContract but returns two functions. One to unpack the writeContract result and the other to unpack the optimistic result. This is the most naive implementation and will be expanded over time.

- [#770](https://github.com/evmts/tevm-monorepo/pull/770) [`029157f6`](https://github.com/evmts/tevm-monorepo/commit/029157f62a1e198bbed8719e3ec9c8a343aad2dc) Thanks [@roninjin10](https://github.com/roninjin10)! - Added viem client for interacting with evmts vm

  Enhanced the `@tevm/vm` package by introducing the `viem` client extension. This new feature allows for more sophisticated interactions with the `tevm` virtual machine, including the ability to handle `NonVerboseTevmJsonRpcRequest` types and utilize the `superjson` library for serialization. The update includes new methods for tevm requests, script execution, and account management, as well as additional test coverage to ensure functionality. This extension is a step towards more flexible and powerful vm operations, paving the way for future enhancements.

- [#771](https://github.com/evmts/tevm-monorepo/pull/771) [`7af87e4c`](https://github.com/evmts/tevm-monorepo/commit/7af87e4c3ed33b383a573b6ffabd23b8700381a1) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated json rpc server to forward non tevm requests to the underlying fork if a forkUrl is set

### Patch Changes

- [#760](https://github.com/evmts/tevm-monorepo/pull/760) [`0f620fbf`](https://github.com/evmts/tevm-monorepo/commit/0f620fbf5750aa0ef7b513ffaf2c21fa424389a7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added better error message when contract code does not exist when running vm.runContractCall

- Updated dependencies [[`03f7aac9`](https://github.com/evmts/tevm-monorepo/commit/03f7aac96eb8daba6fe8da44603585ef183319a2), [`143418bb`](https://github.com/evmts/tevm-monorepo/commit/143418bb6282e98622cb5c0fb4ab677382f5dc9d), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa)]:
  - @tevm/contract@1.0.0-next.21
  - @tevm/server@1.0.0-next.21
  - @tevm/state@1.0.0-next.21
  - @tevm/procedures@1.0.0-next.21
  - @tevm/api@1.0.0-next.21
  - @tevm/predeploys@1.0.0-next.21

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
