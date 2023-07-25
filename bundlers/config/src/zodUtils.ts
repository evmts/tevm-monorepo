import { expandEnv } from './expandEnv'
import { z } from 'zod'

export const expandedString = (...args: Parameters<typeof z.string>) =>
	z
		.string(...args)
		.transform((str) => expandEnv(str, process.env || (import.meta as any).env))
