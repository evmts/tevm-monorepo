const noop = () => {}
export const noopPersister = {
	persistClient: noop,
	restoreClient: () => undefined,
	removeClient: noop,
}
