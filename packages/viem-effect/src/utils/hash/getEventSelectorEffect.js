import { wrapInEffect } from '../../wrapInEffect.js'
import { getEventSelector } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEventSelector, import("viem/utils").GetEventSelectorErrorType>}
 */
export const getEventSelectorEffect = wrapInEffect(getEventSelector)
