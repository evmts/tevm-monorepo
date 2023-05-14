<p align="center">
  <a href="https://evmts.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  @evmts/solidity-resolver
<p>

`@evmts/solidity-resolver` is the internal library for converting solidity files to typescript. It is used to create all the other plugins

## Example

This example resolves Foo.sol with foundry and then writes an esm module

```typescript
import { hardhatModules } from "@evmts/solidity-resolver";
import fs from "fs";

const resolver = hardhatModules(options, console);
const esmModule = resolver.resolveEsmModuleSync("../../Foo.sol");
fs.writeFileSync("../../Foo.js", esmModule);
```

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
