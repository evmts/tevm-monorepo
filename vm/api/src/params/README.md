## @tevm/api/params

Specification of Tevm params as TypeScript types. Params are used by [handlers](../handlers) which then return the corresponding [result](../result/)

## JSON-RPC

The analogous JSON-RPC version of params are [requests](../requests). These requests have a param prop which is a [serialized](../utils/SerializeToJson.ts) version of the param type.
