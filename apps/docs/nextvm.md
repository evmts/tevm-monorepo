### Using Tevm in Next.js

To use Tevm in a Next.js api endpoint use the `createHttpHandler` method in the `pages/api` directory.

```typescript
import {Tevm} from '@tevm/vm';

const tevm = new Tevm({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const jsonRpcHandler = tevm.createHttpHandler(tevm);

export default function handler(req, res) {
  jsonRpcHandler(req, res);
}
```

