import {
	callHandler,
	contractHandler,
	dealHandler,
	deployHandler,
	dumpStateHandler,
	getAccountHandler,
	loadStateHandler,
	mineHandler,
	setAccountHandler,
	simulateCallHandler,
} from '@tevm/actions'

/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'getAccount'>>}
 */
const getAccountAction = () => (client) => {
	return {
		getAccount: getAccountHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'setAccount'>>}
 */
const setAccountAction = () => (client) => {
	return {
		setAccount: setAccountHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'call'>>}
 */
const callAction = () => (client) => {
	return {
		call: callHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'contract'>>}
 */
const contractAction = () => (client) => {
	return {
		contract: contractHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'dumpState'>>}
 */
const dumpStateAction = () => (client) => {
	return {
		dumpState: dumpStateHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'loadState'>>}
 */
const loadStateAction = () => (client) => {
	return {
		loadState: loadStateHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'mine'>>}
 */
const mineAction = () => (client) => {
	return {
		mine: mineHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'deploy'>>}
 */
const deployAction = () => (client) => {
	return {
		deploy: deployHandler(client),
	}
}
/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'deal'>>}
 */
const dealAction = () => (client) => {
	return {
		deal: dealHandler(client),
	}
}

/**
 * @internal
 * @returns {import('@tevm/node').Extension<Pick<import('./TevmActionsApi.js').TevmActionsApi, 'simulateCall'>>}
 */
const simulateCallAction = () => (client) => {
	return {
		simulateCall: simulateCallHandler(client),
	}
}

/**
 * @returns {import('@tevm/node').Extension<import('./TevmActionsApi.js').TevmActionsApi>}
 */
export const tevmActions = () => (client) => {
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
		.extend(simulateCallAction())
}
