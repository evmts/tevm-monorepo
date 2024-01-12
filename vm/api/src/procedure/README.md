## @tevm/api/procedures

Typescript types of Tevm JsonRpc procedures to fulfill [tevm requests](../requests/).

Procedures fullfill tevm requests over JSON-RPC for use when the Tevm vm is running in a backend server or a service worker.

Procedures are less ergonomic than [handlers](../handlers) and thus are usually wrapped with handlers when using tevm remotely.

The Tevm vm exposes both a JSON-rpc and a handler interface

## See also

- [@tevm/api/requests](../requests/) The request types for JSON-rpc procedures
- [@tevm/api/responses](../responses/) The response types for JSON-rpc procedures
- [@tevm/api/handlers](../handlers/) The more ergonomic and generic interface for interacting with tevm
