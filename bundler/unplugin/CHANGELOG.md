# @evmts/unplugin

## 1.0.0-next.3

### Patch Changes

- Updated dependencies [[`eddcef02`](https://github.com/evmts/evmts-monorepo/commit/eddcef024aebc62b713a1fd51304e12f0b093d18)]:
  - @evmts/config@1.0.0-next.3
  - @evmts/solc@1.0.0-next.3
  - @evmts/runtime@1.0.0-next.2

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/evmts-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/evmts-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to EVMts bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

### Patch Changes

- Updated dependencies [[`31ed39a5`](https://github.com/evmts/evmts-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785)]:
  - @evmts/runtime@1.0.0-next.2
  - @evmts/solc@1.0.0-next.2

## 1.0.0-next.0

### Patch Changes

- [#611](https://github.com/evmts/evmts-monorepo/pull/611) [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- Updated dependencies [[`a8248fb5`](https://github.com/evmts/evmts-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442), [`32c7f253`](https://github.com/evmts/evmts-monorepo/commit/32c7f2537555380dd8c48883729add6ea658d52e), [`570c4ed6`](https://github.com/evmts/evmts-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933), [`64a404ce`](https://github.com/evmts/evmts-monorepo/commit/64a404ce56305c126847be15cf42ab14bfb38764), [`c12528a3`](https://github.com/evmts/evmts-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e), [`7065f458`](https://github.com/evmts/evmts-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033), [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0), [`21ea35e3`](https://github.com/evmts/evmts-monorepo/commit/21ea35e3989ecf5d5eb2946eab96234d170fa9e5), [`2349d58c`](https://github.com/evmts/evmts-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d), [`7065f458`](https://github.com/evmts/evmts-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033)]:
  - @evmts/tsconfig@1.0.0-next.0
  - @evmts/config@1.0.0-next.0
  - @evmts/runtime@1.0.0-next.0
  - @evmts/solc@1.0.0-next.0
