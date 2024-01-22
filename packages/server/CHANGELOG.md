# @tevm/server

## 1.0.0-next.23

### Minor Changes

- [#844](https://github.com/evmts/tevm-monorepo/pull/844) [`f857279f82aed79be8785fc02b5871fd52659b85`](https://github.com/evmts/tevm-monorepo/commit/f857279f82aed79be8785fc02b5871fd52659b85) Thanks [@roninjin10](https://github.com/roninjin10)! - Added Next.js and Express handlers to @tevm/server

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`f2707baa92220f7848912037638ebad125dee539`](https://github.com/evmts/tevm-monorepo/commit/f2707baa92220f7848912037638ebad125dee539)]:
  - @tevm/zod@1.0.0-next.23

## 1.0.0-next.22

### Patch Changes

- [#809](https://github.com/evmts/tevm-monorepo/pull/809) [`0efe3b03`](https://github.com/evmts/tevm-monorepo/commit/0efe3b03142b7e0fcb069230fe444b9b4eb0bd17) Thanks [@roninjin10](https://github.com/roninjin10)! - Added jsdoc to createHttpHandler

- Updated dependencies [[`3b4a347d`](https://github.com/evmts/tevm-monorepo/commit/3b4a347da4c0086b22a276b31442d5b22855a2ba), [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290), [`aec294ba`](https://github.com/evmts/tevm-monorepo/commit/aec294ba6a3f4fc7bade3ac2286a6bf317b2112c)]:
  - @tevm/zod@1.0.0-next.22

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/server package. This lightweight package creates an HTTP handler from an Ethereumjs vm instance to implement the Tevm API as specified in the @tevm/api package. The server does not yet support web sockets.

- Updated dependencies [[`cc24672a`](https://github.com/evmts/tevm-monorepo/commit/cc24672a0becdf8c555a83ed8e71ebb61e4fd02f), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa), [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa)]:
  - @tevm/jsonrpc@1.0.0-next.21
  - @tevm/procedures@1.0.0-next.21
  - @tevm/zod@1.0.0-next.21
