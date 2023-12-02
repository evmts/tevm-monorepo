import { Api } from "./Api.js";
import type { Trpc } from "./Trpc.js";

export class JsonRpc extends Api {
  public readonly name = 'EVMtsJsonRPC'
  public readonly majorVersion = 0
  public readonly minorVersion = 0
  public readonly patchVersion = 0
  public readonly handler = this.trpc.router({
    ...this.commonRoutes,
    // [this.routes.profileRoute.name]: this.routes.profileRoute.handler,
  })

  constructor(
    trpc: Trpc,
    protected readonly routes: {
      // readonly healthzRoute: HealthzRoute
    },
  ) {
    super(trpc)
  }
}
