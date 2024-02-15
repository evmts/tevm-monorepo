import {
	callHandler,
	contractHandler,
	dumpStateHandler,
	getAccountHandler,
	loadStateHandler,
	scriptHandler,
	setAccountHandler,
} from '@tevm/actions'

/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'script'>>}
 */
export const scriptAction = () => (client) => {
	return {
		script: scriptHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'getAccount'>>}
 */
export const getAccountAction = () => (client) => {
	return {
		getAccount: getAccountHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'setAccount'>>}
 */
export const setAccountAction = () => (client) => {
	return {
		setAccount: setAccountHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'call'>>}
 */
export const callAction = () => (client) => {
	return {
		call: callHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'contract'>>}
 */
export const contractAction = () => (client) => {
	return {
		contract: contractHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'dumpState'>>}
 */
export const dumpStateAction = () => (client) => {
	return {
		dumpState: dumpStateHandler(client),
	}
}
/**
 * @returns {import('@tevm/base-client').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'loadState'>>}
 */
export const loadStateAction = () => (client) => {
	return {
		loadState: loadStateHandler(client),
	}
}

/**
 * @returns {import('@tevm/base-client').Extension<import('./TevmActionsApi.js').TevmActionsApi>}
 */
export const tevmActions = () => (client) => {
	return client
		.extend(loadStateAction())
		.extend(dumpStateAction())
		.extend(contractAction())
		.extend(callAction())
		.extend(setAccountAction())
		.extend(getAccountAction())
		.extend(scriptAction())
}
