[**@tevm/whatsabi**](../README.md) • **Docs**

***

[@tevm/whatsabi](../globals.md) / contractUriPattern

# Variable: contractUriPattern

> `const` **contractUriPattern**: `RegExp`

Regular expression pattern for matching contract URIs.
Looks like evm://<chainId>/<address>?<query>
Valid query params (all optional)
- rpcUrl: string
- etherscanBaseUrl: string
- followProxies: boolean
- etherscanApiKey: string

## Defined in

[bundler-packages/whatsabi/src/contractUriPattern.js:10](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/contractUriPattern.js#L10)