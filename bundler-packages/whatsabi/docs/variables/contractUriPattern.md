[**@tevm/whatsabi**](../README.md)

***

[@tevm/whatsabi](../globals.md) / contractUriPattern

# Variable: contractUriPattern

> `const` **contractUriPattern**: `RegExp`

Defined in: bundler-packages/whatsabi/src/contractUriPattern.js:10

Regular expression pattern for matching contract URIs.
Looks like evm://<chainId>/<address>?<query>
Valid query params (all optional)
- rpcUrl: string
- etherscanBaseUrl: string
- followProxies: boolean
- etherscanApiKey: string
