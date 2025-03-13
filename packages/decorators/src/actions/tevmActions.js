// Note: Using dynamic imports to avoid circular dependencies
// The actual handlers are loaded at runtime, not during build
export const importHandlers = async () => {
	const actions = await import('@tevm/actions')
	return {
		callHandler: actions.callHandler,
		contractHandler: actions.contractHandler,
		dealHandler: actions.dealHandler,
		deployHandler: actions.deployHandler,
		dumpStateHandler: actions.dumpStateHandler,
		getAccountHandler: actions.getAccountHandler,
		loadStateHandler: actions.loadStateHandler,
		mineHandler: actions.mineHandler,
		setAccountHandler: actions.setAccountHandler,
	}
}

/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'getAccount'>>}
 */
const getAccountAction = () => async (client) => {
	const { getAccountHandler } = await importHandlers()
	return {
		getAccount: getAccountHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'setAccount'>>}
 */
const setAccountAction = () => async (client) => {
	const { setAccountHandler } = await importHandlers()
	return {
		setAccount: setAccountHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'call'>>}
 */
const callAction = () => async (client) => {
	const { callHandler } = await importHandlers()
	return {
		call: callHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'contract'>>}
 */
const contractAction = () => async (client) => {
	const { contractHandler } = await importHandlers()
	return {
		contract: contractHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'dumpState'>>}
 */
const dumpStateAction = () => async (client) => {
	const { dumpStateHandler } = await importHandlers()
	return {
		dumpState: dumpStateHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'loadState'>>}
 */
const loadStateAction = () => async (client) => {
	const { loadStateHandler } = await importHandlers()
	return {
		loadState: loadStateHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'mine'>>}
 */
const mineAction = () => async (client) => {
	const { mineHandler } = await importHandlers()
	return {
		mine: mineHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'deploy'>>}
 */
const deployAction = () => async (client) => {
	const { deployHandler } = await importHandlers()
	return {
		deploy: deployHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'deal'>>}
 */
const dealAction = () => async (client) => {
	const { dealHandler } = await importHandlers()
	return {
		deal: dealHandler(client),
	}
}

/**
 * @returns {import('@tevm/node').Extension<import('./TevmActionsApi.js').TevmActionsApi>}
 */
export const tevmActions = () => async (client) => {
	return client
		.extend(loadStateAction())
		.extend(dumpStateAction())
		.extend(contractAction())
		.extend(callAction())
		.extend(setAccountAction())
		.extend(getAccountAction())
		.extend(mineAction())
		.extend(deployAction())
		.extend(dealAction())
}
