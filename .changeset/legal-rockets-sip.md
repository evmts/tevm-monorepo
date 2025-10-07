---
"@tevm/test-node": patch
---

### Summary

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