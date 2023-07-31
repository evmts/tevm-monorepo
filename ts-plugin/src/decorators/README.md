## @evmts/ts-plugin/src/decorators

[Decorators](https://en.wikipedia.org/wiki/Decorator_pattern) used to modify the [typescript language server host](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation)

#### [getScriptKind](./getScriptKind.ts)

Decorates the server host with `getScriptKind` proxy to return typescript for `.sol` files.

#### [getScriptSnapshot](./getScriptSnapshot.ts)

Decorates the server host with `getScriptSnapshot` proxy to return the correct .d.ts files for the `.sol` files.

#### [resolveModuleNameLiterals](./resolveModuleNameLiterals.ts)

Decorates the server host with `resolveModuleNameLiterals` proxy to return the correct module object for `.sol` files.
