# Wave 2 typecheck repair (round 2)

**Scope:** lsp/ts-plugin

## Errors fixed
- src/factories/fileAccessObject.ts:141 - narrowed the virtual `statSync` wrapper to a concrete `Stats` return and assignment-site cast to the Node statSync type.
- src/factories/fileAccessObject.ts:142 - converted the `PathLike` input to a string before virtual mtime lookup and delegated `statSync`.
- src/factories/fileAccessObject.ts:152 - narrowed the virtual async `stat` wrapper to a concrete `Promise<Stats>` return and assignment-site cast to the Node stat type.
- src/factories/fileAccessObject.ts:153 - converted the `PathLike` input to a string before virtual mtime lookup and delegated `stat`.
