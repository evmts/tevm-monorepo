# @tevm/bundler

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies []:
  - @tevm/bun-plugin@1.0.0-next.28

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/base-bundler@1.0.0-next.28
  - @tevm/bun-plugin@1.0.0-next.28
  - @tevm/compiler@1.0.0-next.28
  - @tevm/config@1.0.0-next.28
  - @tevm/esbuild-plugin@1.0.0-next.28
  - @tevm/rollup-plugin@1.0.0-next.28
  - @tevm/rspack-plugin@1.0.0-next.28
  - @tevm/solc@1.0.0-next.28
  - @tevm/vite-plugin@1.0.0-next.28
  - @tevm/webpack-plugin@1.0.0-next.28
  - @tevm/tsconfig@1.0.0-next.28
  - @tevm/tsupconfig@1.0.0-next.28
  - @tevm/ts-plugin@1.0.0-next.28

## 1.0.0-next.27

### Minor Changes

- [#911](https://github.com/evmts/tevm-monorepo/pull/911) [`44ea5267367336649a2c59de068d60939d68e978`](https://github.com/evmts/tevm-monorepo/commit/44ea5267367336649a2c59de068d60939d68e978) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump barrel package version

## 1.0.0-next.25

### Patch Changes

- Updated dependencies []:
  - @tevm/base-bundler@1.0.0-next.25
  - @tevm/bun-plugin@1.0.0-next.25
  - @tevm/ts-plugin@1.0.0-next.25
  - @tevm/esbuild-plugin@1.0.0-next.25
  - @tevm/rollup-plugin@1.0.0-next.25
  - @tevm/rspack-plugin@1.0.0-next.25
  - @tevm/vite-plugin@1.0.0-next.25
  - @tevm/webpack-plugin@1.0.0-next.25

## 1.0.0-next.24

### Patch Changes

- [#880](https://github.com/evmts/tevm-monorepo/pull/880) [`ab10bbb45832351ec755b0309a26edd9454cf904`](https://github.com/evmts/tevm-monorepo/commit/ab10bbb45832351ec755b0309a26edd9454cf904) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with devDeps that should be regular deps

- Updated dependencies [[`7059ebbe3f33fc36070b0cc16358dfeec452de0b`](https://github.com/evmts/tevm-monorepo/commit/7059ebbe3f33fc36070b0cc16358dfeec452de0b)]:
  - @tevm/bun-plugin@1.0.0-next.24

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
