/**
 * Minimal local declaration for qheap, which does not publish its own types.
 */
declare module 'qheap' {
	type QHeapOptions = {
		comparBefore?(a: any, b: any): boolean
		compar?(a: any, b: any): number
		freeSpace?: number
		size?: number
	}
	class QHeap<T> {
		constructor(opts?: QHeapOptions)
		insert(item: T): void
		push(item: T): void
		enqueue(item: T): void
		remove(): T | undefined
		shift(): T | undefined
		dequeue(): T | undefined
		peek(): T | undefined
		length: number
		gc(opts: { minLength: number; maxLength: number }): void
	}

	export = QHeap
}
