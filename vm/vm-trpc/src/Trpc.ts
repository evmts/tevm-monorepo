import type { inferAsyncReturnType } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'
import superjson from 'superjson'

/**
 * TRPC is a typesafe way of a making an api server and a client
 * The typescript types are shared between the two keeping them in sync
 * The strength of trpc is how quickly you can add new endpoints
 */
export class Trpc {
	constructor(
		trpc = initTRPC
			// @see https://trpc.io/docs/server/context
			.context<inferAsyncReturnType<typeof createContext>>()
			.create({
				/**
				 * @see https://trpc.io/docs/v10/data-transformers
				 */
				transformer: superjson,
			}),
		public readonly createContext = ({
			req,
			res,
		}: trpcExpress.CreateExpressContextOptions) => ({ req, res }),
		/**
		 * @see https://trpc.io/docs/v10/router
		 */
		public readonly router = trpc.router,
		/**
		 * @see https://trpc.io/docs/v10/merging-routers
		 */
		public readonly mergeRouters = trpc.mergeRouters,
		/**
		 * @see https://trpc.io/docs/v10/procedures
		 **/
		public readonly procedure = trpc.procedure,
		/**
		 * @see https://trpc.io/docs/v10/middlewares
		 */
		public readonly middleware = trpc.middleware,
	) {}
}
