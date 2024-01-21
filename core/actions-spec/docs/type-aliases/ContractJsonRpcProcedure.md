**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractJsonRpcProcedure

# Type alias: ContractJsonRpcProcedure

> **ContractJsonRpcProcedure**: [`CallJsonRpcRequest`](CallJsonRpcRequest.md)

Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 We choose to overload the type instead of creating a new one. Tevm contract handlers encode their
 contract call as a normal call request over JSON-rpc

## Source

[procedure/ContractJsonRpcProcedure.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/ContractJsonRpcProcedure.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
