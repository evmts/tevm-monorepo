## @tevm/api/handlers

Specification of Tevm handlers as TypeScript types. Some Handlers such as [ContractHander](./ContractHandler.ts) are generic

Handlers are implemented in:
- `@tevm/procedures/handlers` - Low level implementation of handlers with ethereumjs
- `@tevm/client` - Any Tevm client implements handler interface whether it's using an EVM directly or talking to one remotely over jsonrpc

Handlers are more ergonomic than using the JSON RPC interface because they can be generic and more user friendly. For this reason tevm defaults to using handlers unless needing to send a request over the wire.

Handlers generally take [params](../params/) and return a [result](../result/)

## JSON-RPC - procedures

The JSON-RPC equivelent of handlers are [procedures](../procedure/). 

