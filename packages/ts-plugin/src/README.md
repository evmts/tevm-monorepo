## @evmts/ts-plugin/src

#### [index.ts](./index.ts)

Entrypoint to the [ts-plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)

#### [langaugeServiceHost](./langaugeServiceHost.ts)

The [typescript language server decorator](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation) to wrap the typescript language server with `.sol` file support.

#### [decorators](./decorators/README.md)

Internal decorators [composed](./decorators/composeDecorators.ts) together into [languaageServiceHostDecorator](./languageServiceHost.ts)

#### [factories](./factories/README.md)

Internal [factories](https://en.wikipedia.org/wiki/Factory_method_pattern) used internal by the plugin

#### [utils](./utils/README.md)

Pure functions used internally by the plugin
