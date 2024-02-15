import type { DB, DBObject } from '@ethereumjs/util'

export type MemoryDb<
	TKey extends string | number | Uint8Array = Uint8Array,
	TValue extends
		| string
		| Uint8Array
		| Uint8Array
		| string
		| DBObject = Uint8Array,
> = DB<TKey, TValue>
