# @evmts/cli

## 0.8.0

### Minor Changes

- [#438](https://github.com/evmts/evmts-monorepo/pull/438) [`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b) Thanks [@roninjin10](https://github.com/roninjin10)! - Improve peformance by 98% (5x) testing against 101 simple NFT contract imports

  Major change: remove bytecode from EVMts. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly. In future bytecode will be brought back as an optional prop

  This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

  Because EVMts is still considered in alpha this will not cause a major semver bump

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`
- Updated dependencies [[`91e43e9`](https://github.com/evmts/evmts-monorepo/commit/91e43e952a440f037d52146511ed2508d289874e), [`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b), [`e1903df`](https://github.com/evmts/evmts-monorepo/commit/e1903df625c54b2447ce2bc2318f4c74f9a02bb5), [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43), [`8cceec7`](https://github.com/evmts/evmts-monorepo/commit/8cceec7409a5fc0e72168a10821a64203ba374ab), [`793798e`](https://github.com/evmts/evmts-monorepo/commit/793798ec3782e4081840bcd77242104c9546e70c)]:
  - @evmts/bundler@0.8.0
  - @evmts/core@0.8.0
  - @evmts/config@0.8.0

## 0.7.2

### Patch Changes

- [#429](https://github.com/evmts/evmts-monorepo/pull/429) [`d4f7c4b`](https://github.com/evmts/evmts-monorepo/commit/d4f7c4bba7a0ff7415aedd4263adb13c5471cf7c) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all deps to latest

- [#430](https://github.com/evmts/evmts-monorepo/pull/430) [`90cfc53`](https://github.com/evmts/evmts-monorepo/commit/90cfc53ea6b35127d42a09a3a96ca2e3d1d7fb81) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with @evmts/cli where build:dist command was never added. This caused the package publishing to never find the cli package and thus never actually build it's javascript outputs

## 0.7.1

### Patch Changes

- Updated dependencies []:
  - @evmts/bundler@0.7.1
  - @evmts/config@0.7.0
  - @evmts/core@0.6.0

## 0.7.0

### Patch Changes

- Updated dependencies [[`8f11961`](https://github.com/evmts/evmts-monorepo/commit/8f11961f6b3ebc5882a1e5403d3726df7ddee0d4), [`8dbc952`](https://github.com/evmts/evmts-monorepo/commit/8dbc952d2dc2ca97e89bad55b162056d4f6b31a6), [`fa7555a`](https://github.com/evmts/evmts-monorepo/commit/fa7555a8b0bac268f5297544422c516dae4c5511), [`644e8fd`](https://github.com/evmts/evmts-monorepo/commit/644e8fda95d2824c9145f8d6278cbdb6272b0609), [`d7e6158`](https://github.com/evmts/evmts-monorepo/commit/d7e61583dc1529569de92868ffe49d75c045dc1f), [`4f532eb`](https://github.com/evmts/evmts-monorepo/commit/4f532ebab51004603b1a41f956729fec4a3dbd2d), [`fc28f54`](https://github.com/evmts/evmts-monorepo/commit/fc28f545635a23a76e4acce0ff48d0902eed484c), [`c71cd30`](https://github.com/evmts/evmts-monorepo/commit/c71cd30818b311c95852a720c170ef18915b750f)]:
  - @evmts/config@0.7.0
  - @evmts/bundler@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [[`97d7aec`](https://github.com/evmts/evmts-monorepo/commit/97d7aec9844b370129b9c46ab8c19fe9d13880ec), [`0a87d1a`](https://github.com/evmts/evmts-monorepo/commit/0a87d1a290e6cdd6902d6c1c84ea56d8bc227c45), [`6da3fe7`](https://github.com/evmts/evmts-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516), [`6de12df`](https://github.com/evmts/evmts-monorepo/commit/6de12df39cf9da0635c246c685036e83a8e97255), [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142), [`e24901a`](https://github.com/evmts/evmts-monorepo/commit/e24901a7b503354af6174bac81a868a8598f143b), [`58862a6`](https://github.com/evmts/evmts-monorepo/commit/58862a6ebe6ec1e04961dbc2da6e846a02ef0692), [`3a2dfae`](https://github.com/evmts/evmts-monorepo/commit/3a2dfae3a38ca7052b57b57e5c95a952a7f0be71), [`6dd223b`](https://github.com/evmts/evmts-monorepo/commit/6dd223b0b625bd7dcbea7537f053b32457761955), [`6da3fe7`](https://github.com/evmts/evmts-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516)]:
  - @evmts/bundler@0.6.0
  - @evmts/core@0.6.0
  - @evmts/config@0.6.0
