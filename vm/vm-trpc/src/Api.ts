import { Route } from './routes/index.js'
import * as trpcExpress from '@trpc/server/adapters/express'
import * as trpcPlayground from 'trpc-playground/handlers/express'

/**
 * Extend this class to create new API versions whenever a breaking change happens
 */
export abstract class Api extends Route {
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
			trpcApiEndpoint: '/trpc',
			playgroundEndpoint: `/trpc${this.playgroundEndpoint}`,
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
