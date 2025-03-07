# Tevm Monorepo Commands and Style Guide

## Commands
- Build: `bun build` or `nx run-many --targets=build:dist,build:app,build:types`
- Lint: `bun lint` or `biome check . --write --unsafe && biome format . --write`
- Test all: `bun test` or `bun test:run`
- Test single file: `vitest run <path-to-file>` (e.g. `vitest run packages/state/src/actions/saveStateRoot.spec.ts`)
- Test specific test: `vitest run <path-to-file> -t "<test-name>"`
- Test with coverage: `bun test:coverage`

## Style Guide
- Formatting: Biome with tabs (2 spaces wide), 120 char line width, single quotes
- Types: JavaScript with JSDoc preferred over TypeScript
- Imports: Organized by Biome, use barrel files (index.js/ts) for exports
- Naming: camelCase for functions/variables, PascalCase for classes/types
- Error handling: Extend BaseError, include detailed diagnostics
- Barrel files: Use explicit exports to prevent breaking changes

## Setup
- Package manager: pnpm 9.x.x
- Script runner: Bun
- Requires env vars for tests: TEVM_RPC_URLS_MAINNET, TEVM_RPC_URLS_OPTIMISM

## Nx can get slow

Sometimes you may notice nx slowing down single tasks taking a very long time consistentally. When this happens try running `pnpm nx reset` and it should reset it to being fast again.

## Monorepo

Tevm is a monorepo using

- [nx](https://nx.dev/concepts/mental-model) for caching and task management
- [bun](https://bun.sh/docs) for script runner and workspace node_module management
- [changesets](./.changeset/) for package versioning

For a list of all packages, see the `workspaces` key in the root level [package.json](./package.json)

## Packages

Tevm is heavily broken up into small packages. To see the entire package graph use nx

```bash
bun run nx graph
```

For more information the [reference docs](https://tevm.sh) are a useful resource. They are generated from the source code and link back to it

#### Build packages

- [@tevm/ts-plugin](./ts-plugin) is the LSP (language service protocol) plugin. It is what allows code editors such as VSCode to correctly infer types of solidity imports.
- [bundlers/\*](./bundlers) Are where all the supported bundlers live. Most are created using [@tevm/unplugin](./bundlers/unplugin) which implements a rollup plugin once to be reused in many packages including [@tevm/webpack](./bundlers/webpack) and [@tevm/vite](./bundlers/vite) and more.
- [@tevm/config](./config) is the package that loads the Tevm config

#### Runtime packages

- [@tevm/contract](./core) is the main entry point for all runtime functionality.

#### Docs

- [@tevm/docs](./docs) is the [vitepress docs site](https://tevm.sh). Its reference docs are generated via `bun generate:docs`

#### Example apps

Example apps are in [/examples/\*](./examples). [@tevm/example-esbuild](./examples/esbuild) has a vitest test and is the simplist app.

## Code best practices

#### JavaScript with jsdoc

`@tevm` is written in javascript with jsdoc so its `esm` build does not need to be built. This means any user using modern `esm` will be using the same src code in their node_modules as what is here.

This means all tevm packages run without being built by default and the same src code is shipped to most users

- [src/index.js](./src/index.js) - the entrypoint to the package

**Note** there is still 100% typesafety. TypeScript is able to typecheck via setting `checkJs: true` in the tsconfig and using jsdoc.

#### Single file per item

Tevm generally includes a single file per item to make code easy to find for both humans and llms. For example `createFoo.js`.

#### Create pattern

To match viem conventions most objects will have :
- a type, often in a `Foo.ts` file called `Foo`. 
- a create method, often in a `createFoo.ts` file called `createFoo`
- a test, often in a `createFoo.spec.ts` file.

Note source code is in Js with jsdoc but the rest of it is ts.

#### JSDoc conventions

- When we notice jsdoc is missing we always add it
- We always include complete jsdoc information including @throws @example etc.
- We always make the examples working examples. Ideally use the tests for a working example. Don't do `...` or other shorthand show complete code
- Include imports in examples
- Even if jsdoc exists it could be wrong so fix it if it's wrong

#### Testing conventions

- We NEVER mock things if we can get away with it. The exception is the bundler packages in bundler-packages/* which is pretty hard to test without mocking. 
- But even in bundler package we generally should NEVER mock if we don't have to. Create fixtures if you need to.
- This includes RPCs which we use real examples to
- To find real examples we can use the `cast` cli from foundry to find a real example. Run `cast --help` if you are unsure how to use the cast cli and use `https://mainnet.optimism.io` as your fork-url
- Most of our tests run against either mainnet or optimism at the moment. We pick optimism mainnet because it's always on the latest op stack fork
- Repetion is fine in test files. ts-ignore is fine in tests.

#### Adding to public API

- To add anything to the public API you must add the code to all barrel files recursively up the package file tree. You will then need to go to the tevm package in `./tevm` from the root and also add it to the `./tevm/<Package Name>` folder.
- It's important to look in the docs to see if the docs need to be updated

#### Hacks and workarounds

Sometimes we might add workarounds or tech debt. Always add comments for this.

## Documentation driven development

Generally when we add features we want to follow these steps

#### 1. Documentation

We start with jsdoc and type interface

- Add the typescript interface and ask prompter to review the typescript types
- This may include a mix of typescript types and jsdoc
- Remember: the source code is jsdoc but types are often in seperate ts files when the type is exported publically
- Include complete jsdoc documentation including examples in the documentation
- Ask for a review after

#### 2. Happy path Test

- Write a happy path test
- Should be in a foo.spec.ts file

#### 3. Implementation

- Write a minimum viable implementation to make happy path test
- Include plenty of debug loggign if the object or function has access to a Logger object

#### 4. Productionize

- Write a complete test suite
- Make test pass
- Think hard about any corner cases or additional concerns
- Think about if the change might require changes to the main documentation in docs/node and docs/bundler docs

#### 5. Did you learn anything that should be documented for future use?

If the a pattern or process of making the code change should be remembered in future consider recomending a change to the CLAUDE.md file in root of repo.

## Typescript conventions

- We strive for typesafety at all times
- We always are explicit with function return types
- We always explicitly type return types

The types are built to cache their result for end users.

```
bun build:types
```

- [tsconfig](./tsconfig.json) - @tevm/config tsconfig
- [@tevm/tsconfig](../tsconfig/base.json) - base tsconfig inherited from

## Running tests

```
bun run test
```

`@tevm/config` has >99% test coverage. Run the tests with `bun run test`

Note `bun test` will run bun instead of [vitest](https://vitest.dev) resulting in errors

## Fixtures

Fixtures in [src/fixtures](./src/fixtures/) exist both for the vitest tests and also can be loaded in watch mode.

The best way to debug a bug or implement a new feature is to first add a new fixture to use in test or dev server

Some fixtures are expected to error and the dev server will succeed if they do error. Which fixtures should error is configured in [scripts/runFixture.ts](./scripts/runFixture.ts)

Fixtures run with debug logging turned on. Debug logging is added to every function along with strong error handling so most debugging tasks won't need to involve adding console.logs if you are using a fixture.

#### Running all fixtures

```bash
bun dev
```

#### Running a specific fixtures

```bash
bun fixture basic
```

Valid names include any of the folder names in [src/fixtures](./fixtures). The default is basic

#### Adding a fixture

1. `cp -r src/fixtures/basic src/fixtures/myNewFixture`
2. update your fixture
3. Load your fixture `bun fixture myNewFixture`

Now you can implement your feature or use your fixture to write a test.

## Running linter

By default the linter runs in --fix mode

```basy
bun lint && bun format
```

The linter used is biome not prettier or eslint

#### Generating docs

Docs are generated in the `docs` folder of every package as well as the [main docs site](./docs)

```
bun generate:docs
```

Docs are generated based on the jsdoc and type errors

#### Barrel files

Whenever a new API is added, you will need to update a lot of barrel files. Though tedious this helps keep the packages stable from accidental breaking changes or exporting something that should be private. You will need to update the following places:

- All the `index.js` in your package
- Possibly the top level `src/index.ts` to update the types too if
- Update the [tevm](./tevm) package (unless it's a build tool change)
- Update the [@tevm/bundler](./bundler/) package if it's a build tool api

If you add a lot of files, there is a tool to automatically generate a barrel file in your folder in [`scripts`](./scripts/createBarrelFiles.ts)

