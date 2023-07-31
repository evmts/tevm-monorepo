## @evmts/ts-plugin/src/decorators

[factories](https://en.wikipedia.org/wiki/Factory_method_pattern) for varius internal objects used within the package. They follow a naming convention of `createFoo`.

#### [decorator](./decorator.ts)

Factories used for generating ts language server decorators

#### [config](./bundlers/config.ts)

Parses and validates the user provided config with zod

#### [logger](./logger.ts)

The logger used internally within the package
