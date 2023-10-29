const schedulerCache = /*#__PURE__*/ new Map()
export function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0 }) {
	const exec = async () => {
		const scheduler = getScheduler()
		flush()
		const args = scheduler.map(({ args }) => args)
		if (args.length === 0) return
		fn(args)
			.then((data) => {
				scheduler.forEach(({ pendingPromise }, i) =>
					pendingPromise.resolve?.([data[i], data]),
				)
			})
			.catch((err) => {
				scheduler.forEach(({ pendingPromise }) => pendingPromise.reject?.(err))
			})
	}
	const flush = () => schedulerCache.delete(id)
	const getBatchedArgs = () => getScheduler().map(({ args }) => args)
	const getScheduler = () => schedulerCache.get(id) || []
	const setScheduler = (item) =>
		schedulerCache.set(id, [...getScheduler(), item])
	return {
		flush,
		async schedule(args) {
			const pendingPromise = {}
			const promise = new Promise((resolve, reject) => {
				pendingPromise.resolve = resolve
				pendingPromise.reject = reject
			})
			const split = shouldSplitBatch?.([...getBatchedArgs(), args])
			if (split) exec()
			const hasActiveScheduler = getScheduler().length > 0
			if (hasActiveScheduler) {
				setScheduler({ args, pendingPromise })
				return promise
			}
			setScheduler({ args, pendingPromise })
			setTimeout(exec, wait)
			return promise
		},
	}
}
//# sourceMappingURL=createBatchScheduler.js.map
