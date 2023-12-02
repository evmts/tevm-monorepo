import * as trpcExpress from '@trpc/server/adapters/express'
import * as trpcPlayground from 'trpc-playground/handlers/express'
import { Route } from './Route.js'

/**
 * Extend this class to create new API versions whenever a breaking change happens
 */
export abstract class Api extends Route {
  public readonly commonRoutes = {
    version: this.trpc.procedure.query(() => this.version),
    routes: this.trpc.procedure.query(() => Object.keys(this.routes)),
  }

  /**
   * The api will be served at `/api/[version]/routename?input=...`
   *
   * @example
   * version = ApiVersion.V0
   */
  public abstract readonly majorVersion: number
  public abstract readonly minorVersion: number
  public abstract readonly patchVersion: number

  /**
   * Routes registed to api
   */
  protected abstract readonly routes: Record<string, Route>

  get version() {
    return [this.majorVersion, this.minorVersion, this.patchVersion].join('.')
  }

  get expressRoute() {
    // we don't put minor version in the route because we don't want to break the frontend on minor version changes
    return `/${this.majorVersion}`
  }

  /**
   * Returns all paths that are supported by the trpc handler
   */
  public getSupportedPaths() {
    return Object.keys(this.handler._def.procedures).map(
      (trpcProcedure) => `/${trpcProcedure}`,
    )
  }

  public readonly playgroundEndpoint = '/playground'
  public readonly playgroundHandler = async () => {
    const handler = await trpcPlayground.expressHandler({
      trpcApiEndpoint: `/api${this.expressRoute}`,
      playgroundEndpoint: `/api${this.playgroundEndpoint}`,
      router: this.handler,
      request: {
        superjson: true,
      },
    })
    return handler
  }

  /**
   * Turns an trpc server into express middleware
   *
   * @see https://trpc.io/docs/v10/express
   * @example
   * app.use('/', api.createExpressMiddleware())
   */
  public readonly createExpressMiddleware = () =>
    trpcExpress.createExpressMiddleware({
      router: this.handler,
      createContext: this.trpc.createContext,
    })
}
