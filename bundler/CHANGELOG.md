# @tevm/bundler

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
