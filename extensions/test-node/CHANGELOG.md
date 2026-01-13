# @tevm/test-node

## 1.0.0-next.151

### Patch Changes

- 2d9d44b: bumping potentially one last time before release
- 725f0ae: Bug fixes to lots of packages done with ai and no changeset
- Updated dependencies [2d9d44b]
- Updated dependencies [725f0ae]
  - @tevm/memory-client@1.0.0-next.151
  - @tevm/actions@1.0.0-next.151
  - @tevm/node@1.0.0-next.151
  - @tevm/server@1.0.0-next.151

## 1.0.0-next.150

### Patch Changes

- f1ecd2d: ### Summary

  Refactors the test-node snapshot system to use vitest-compatible snapshot paths and adds full support for bun test snapshots with improved configuration options.

  ### Changes

  #### Snapshot Path Structure
  - Moved snapshots from `.tevm/test-snapshots/<test-file>/snapshots.json` to `__rpc_snapshots__/<test-file>.snap.json`
  - Follows vitest snapshot naming conventions for better DX and consistency
  - Added biome ignore rule for `__rpc_snapshots__` directory

  #### Implementation
  - Removed `getCurrentTestFile` utility
  - Added dedicated snapshot path resolvers:
    - `resolveBunTestSnapshotPath` - resolves snapshot paths for bun test
    - `resolveVitestTestSnapshotPath` - resolves snapshot paths for vitest
  - Updated `SnapshotManager` to support new path resolution and configuration
  - Enhanced `TestOptions` type with granular snapshot configuration

  #### API Updates
  - `createTestSnapshotClient`, `createTestSnapshotNode`, and `createTestSnapshotTransport` now accept enhanced snapshot options
  - Updated all RPC tests to use new snapshot structure

  #### Documentation
  - Updated README with new snapshot configuration options
  - Regenerated TypeDoc documentation for all affected types and functions

## 1.0.0-next.149

### Patch Changes

- f9977b5: Extend test-matchers, add test-node package & improve 4byte tracer
- Updated dependencies [f9977b5]
  - @tevm/actions@1.0.0-next.149

## 1.0.0-next.148

### Patch Changes

- c337f69: Internal release
- Updated dependencies [c337f69]
  - @tevm/memory-client@1.0.0-next.148
  - @tevm/server@1.0.0-next.148
