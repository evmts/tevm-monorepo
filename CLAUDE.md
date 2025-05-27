# Tevm Monorepo Commands and Style Guide

## Project Overview

Tevm is an in-browser & Node.js-compatible Ethereum Virtual Machine (EVM) environment. It provides a complete Ethereum execution environment powered by JavaScript that can run:

**Unique Features:**

- Import Solidity contracts directly in JavaScript/TypeScript
- Typecheck Solidity contracts with full type safety
- Simulate and debug EVM execution step-by-step
- Fork mainnet or any EVM chain locally in the browser

- **In Node.js** for local development and testing
- **In the Browser** for advanced user experiences (offline simulation, real-time testing)
- **In Deno, Bun**, or any modern JavaScript runtime

### Forking Implementation

Most of Tevm's forking logic is implemented in the `StateManager`. When a fork configuration is provided:

- The StateManager creates a proxy that intercepts data requests
- If data exists locally, it returns the local version
- If data doesn't exist locally, it fetches from the remote provider
- Fetched data is cached locally for future requests
- All state changes are applied only to the local state

This enables efficient forking with minimal memory usage, as only the accessed state is loaded and stored.

### JSON-RPC Support

The entire JSON-RPC API is implemented in the `tevm/actions` package, which provides:

- Full support for standard Ethereum JSON-RPC methods (eth\_\*)
- Support for Anvil's methods (anvil\_\*)
- Debug namespace methods (debug\_\*)
- Custom Tevm methods (tevm\_\*)

These action handlers translate between Viem-style parameters and the internal Ethereumjs API, handling format conversions automatically.

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

#### Import preferences

- Prefer inline imports in JSDoc comments where the type is used instead of global imports at the top of the file
- This gives better tree shaking and more precise type dependencies
- Example:
  ```js
  /**
   * @param {import('../common/CallEvents.js').CallEvents} events - Event handlers
   */
  export const executeCall = async (client, evmInput, params, events) => {
    // ...
  };
  ```

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

- **IMPORTANT** Never run `test` command. Always use `test:coverage`. `test` is interactive and will time out

- We NEVER mock things if we can get away with it. The exception is the bundler packages in bundler-packages/\* which is pretty hard to test without mocking.
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
bun run test:coverage
```

`@tevm/config` has >99% test coverage. Run the tests with `bun run test`

Note `bun test` will run bun instead of [vitest](https://vitest.dev) resulting in errors

To run tests on an individual package like `@tevm/actions`

```bash
pnpm nx run test @tevm/actions
```

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

#### Peer dependencies

If we upgrade viem we should make sure we update the peer dependency version too

#### Barrel files

Whenever a new API is added, you will need to update a lot of barrel files. Though tedious this helps keep the packages stable from accidental breaking changes or exporting something that should be private. You will need to update the following places:

- All the `index.js` in your package
- Possibly the top level `src/index.ts` to update the types too if
- Update the [tevm](./tevm) package (unless it's a build tool change)
- Update the [@tevm/bundler](./bundler/) package if it's a build tool api

If you add a lot of files, there is a tool to automatically generate a barrel file in your folder in [`scripts`](./scripts/createBarrelFiles.ts)

#### nx

The way to run any job is with nx. For example, to run tests in the @tevm/actions package

```sh
pnpm nx run test:coverage
```

#### FILE_BASED_TESTS

- **IMPORTANT** Make sure the tests especially snapshot tests are not dependent on file system e.g. `/Users/williamcory/tevm-monorepo` shouldn't be in a snapshot
- If this is the case you can fix it in any way possible including changing the path to a relative path
- For error/inline snapshots consider using error messages or patterns that don't include absolute paths
- Use toMatchInlineSnapshot with generic patterns when possible to avoid path dependencies
- Prefer fixing snapshot tests using the -u command but always justify why the diff is actually expected and not a regression. If it looks like it's possibly a regression like a successful call turning into an error call it out
- For mocked modules, use patterns that focus on the behavior, not path-specific information
- When upgrading dependencies (like viem), test snapshots may need to be updated to match the new version strings

## Nx

We use nx for repo management.

Smart Monorepos · Fast CI

Commands:
nx add <packageSpecifier> Install a plugin and initialize it.
nx affected Run target for affected projects.
nx connect Connect workspace to Nx Cloud. [aliases: connect-to-nx-cloud]
nx daemon Prints information about the Nx Daemon process or starts a daemon process.
nx graph Graph dependencies within workspace. [aliases: dep-graph]
nx exec Executes any command as if it was a target on the project.
nx format:check Check for un-formatted files.
nx format:write Overwrite un-formatted files. [aliases: format]
nx generate <generator> [_..] Generate or update source code (e.g., nx generate @nx/js:lib mylib). [aliases: g]
nx import [sourceRepository] [destinationDirectory] Import code and git history from another repository into this repository.
nx init Adds Nx to any type of workspace. It installs nx, creates an nx.json configuration file and
optionally sets up remote caching. For more info, check https://nx.dev/recipes/adopting-nx.
nx list [plugin] Lists installed plugins, capabilities of installed plugins and other available plugins.
nx migrate [packageAndVersion] Creates a migrations file or runs migrations from the migrations file. - Migrate packages and create migrations.json (e.g., nx migrate @nx/workspace@latest) - Run migrations (e.g., nx migrate --run-migrations=migrations.json). Use flag --if-exists
to run migrations only if the migrations file exists.
nx release Orchestrate versioning and publishing of applications and libraries.
nx repair Repair any configuration that is no longer supported by Nx.

                                                       Specifically, this will run every migration within the `nx` package
                                                       against the current repository. Doing so should fix any configuration
                                                       details left behind if the repository was previously updated to a new
                                                       Nx version without using `nx migrate`.

                                                       If your repository has only ever updated to newer versions of Nx with
                                                       `nx migrate`, running `nx repair` should do nothing.

nx report Reports useful version numbers to copy into the Nx issue template.
nx reset Clears cached Nx artifacts and metadata about the workspace and shuts down the Nx Daemon.
[aliases: clear-cache]
nx run [project][:target][:configuration] [_..] Run a target for a project
(e.g., nx run myapp:serve:production).

                                                       You can also use the infix notation to run a target:
                                                       (e.g., nx serve myapp --configuration=production)

                                                       You can skip the use of Nx cache by using the --skip-nx-cache option.

nx run-many Run target for multiple listed projects.
nx show Show information about the workspace (e.g., list of projects).
nx sync Sync the workspace files by running all the sync generators.
nx sync:check Check that no changes are required after running all sync generators.
nx view-logs Enables you to view and interact with the logs via the advanced analytic UI from Nx Cloud
to help you debug your issue. To do this, Nx needs to connect your workspace to Nx Cloud
and upload the most recent run details. Only the metrics are uploaded, not the artefacts.
nx watch Watch for changes within projects, and execute commands.
nx <target> [project] [_..] Run a target for a project. [default]
nx login [nxCloudUrl] Login to Nx Cloud. This command is an alias for [`nx-cloud
                                                       login`](/ci/reference/nx-cloud-cli#npx-nxcloud-login).
nx logout Logout from Nx Cloud. This command is an alias for [`nx-cloud
                                                       logout`](/ci/reference/nx-cloud-cli#npx-nxcloud-logout).

Options:
--version Show version number [boolean]
--batch Run task(s) in batches for executors which support batches. [boolean] [default: false]
-c, --configuration This is the configuration to use when performing tasks on projects. [string]
--output-style Defines how Nx emits outputs tasks logs. **dynamic**: use dynamic output life cycle, previous
content is overwritten or modified as new outputs are added, display minimal logs by default,
always show errors. This output format is recommended on your local development environments.
**static**: uses static output life cycle, no previous content is rewritten or modified as new
outputs are added. This output format is recommened for CI environments. **stream**: nx by default
logs output to an internal output stream, enable this option to stream logs to stdout / stderr.
**stream-without-prefixes**: nx prefixes the project name the target is running on, use this option
remove the project name prefix from output.
[string] [choices: "dynamic", "static", "stream", "stream-without-prefixes", "compact"]
--exclude Exclude certain projects from being processed. [string]
--verbose Prints additional information about the commands (e.g., stack traces). [boolean]
--parallel Max number of parallel processes [default is 3]. [string]
--runner This is the name of the tasks runner configured in nx.json. [string]
--graph Show the task graph of the command. Pass a file path to save the graph data instead of viewing it
in the browser. Pass "stdout" to print the results to the terminal. [string]
--nxBail Stop command execution after the first failed task. [boolean] [default: false]
--nxIgnoreCycles Ignore cycles in the task graph. [boolean] [default: false]
--skipNxCache, --disableNxCache Rerun the tasks even when the results are available in the cache. [boolean] [default: false]
--skipRemoteCache, --disableRemoteCache Disables the remote cache. [boolean] [default: false]
--excludeTaskDependencies Skips running dependent tasks first. [boolean] [default: false]
--skipSync Skips running the sync generators associated with the tasks. [boolean] [default: false]
--project Target project. [string]

➜ tevm-monorepo git:(02-27-_arrow_up_chore_pnpm_up_--latest) pnpm nx run-many --help
nx run-many

Run target for multiple listed projects.

Options:
--help Show help [boolean]
--version Show version number [boolean]
--batch Run task(s) in batches for executors which support batches. [boolean] [default: false]
-c, --configuration This is the configuration to use when performing tasks on projects. [string]
-t, --targets, --target Tasks to run for affected projects. [string] [required]
--output-style Defines how Nx emits outputs tasks logs. **dynamic**: use dynamic output life cycle, previous
content is overwritten or modified as new outputs are added, display minimal logs by default,
always show errors. This output format is recommended on your local development environments.
**static**: uses static output life cycle, no previous content is rewritten or modified as new
outputs are added. This output format is recommened for CI environments. **stream**: nx by default
logs output to an internal output stream, enable this option to stream logs to stdout / stderr.
**stream-without-prefixes**: nx prefixes the project name the target is running on, use this option
remove the project name prefix from output.
[string] [choices: "dynamic", "static", "stream", "stream-without-prefixes"]
--exclude Exclude certain projects from being processed. [string]
--verbose Prints additional information about the commands (e.g., stack traces). [boolean]
--parallel Max number of parallel processes [default is 3]. [string]
--runner This is the name of the tasks runner configured in nx.json. [string]
--graph Show the task graph of the command. Pass a file path to save the graph data instead of viewing it
in the browser. Pass "stdout" to print the results to the terminal. [string]
--nxBail Stop command execution after the first failed task. [boolean] [default: false]
--nxIgnoreCycles Ignore cycles in the task graph. [boolean] [default: false]
--skipNxCache, --disableNxCache Rerun the tasks even when the results are available in the cache. [boolean] [default: false]
--skipRemoteCache, --disableRemoteCache Disables the remote cache. [boolean] [default: false]
--excludeTaskDependencies Skips running dependent tasks first. [boolean] [default: false]
--skipSync Skips running the sync generators associated with the tasks. [boolean] [default: false]
-p, --projects Projects to run. (comma/space delimited project names and/or patterns). [string]
--all [deprecated] `run-many` runs all targets on all projects in the workspace if no projects are
provided. This option is no longer required. [boolean] [default: true]

Examples:
run-many -t test Test all projects
run-many -t test -p proj1 proj2 Test proj1 and proj2 in parallel
run-many -t test -p proj1 proj2 --parallel=5 Test proj1 and proj2 in parallel using 5 workers
run-many -t test -p proj1 proj2 --parallel=false Test proj1 and proj2 in sequence
run-many -t test --projects=_-app --exclude excluded-app Test all projects ending with `_-app`except`excluded-app`.  Note: your shell may
                                                            require you to escape the `_`like this:`\*`
run-many -t test --projects=tag:api-_ Test all projects with tags starting with `api-`. Note: your shell may require you to
escape the `*` like this: `\*`
run-many -t test --projects=tag:type:ui Test all projects with a `type:ui` tag
run-many -t test --projects=tag:type:feature,tag:type:ui Test all projects with a `type:feature` or `type:ui` tag
run-many --targets=lint,test,build Run lint, test, and build targets for all projects. Requires Nx v15.4+
run-many -t=build --graph Preview the task graph that Nx would run inside a webview
run-many -t=build --graph=output.json Save the task graph to a file
run-many -t=build --graph=stdout Print the task graph to the console

Find more information and examples at https://nx.dev/nx/run-many
