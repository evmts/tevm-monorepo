import type { BuildProcedure, CreateRouterInner } from '@trpc/server'
import { z } from 'zod'

import type { Trpc } from '../Trpc.js'

/**
 * Class routes extend to create a TRPC route.
 * Every route is a name and a controller.
 * Zod is used to create validation
 */
export abstract class Route {
	/**
	 * quality of life property.  Zod is used to validate input in a
	 * typesafe way.
	 * Can be used by `import {z} from 'zod' as well.
	 *
	 * @see https://github.com/colinhacks/zod
	 */
	protected readonly z = z
	/**
	 * The name of the route will be how it is referenced in client and
	 * show up in api route `/api/version/name?input=...`
	 */
	public abstract readonly name: string
	/**
	 * The handler specifies the typescript types for input and output
	 * and writes the function to fetch the data
	 */
	public abstract readonly handler:
		| BuildProcedure<any, any, any>
		| CreateRouterInner<any, any>
	constructor(protected readonly trpc: Trpc) {}
}
