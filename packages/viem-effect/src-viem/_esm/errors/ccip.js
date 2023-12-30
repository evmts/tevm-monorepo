import { stringify } from '../utils/stringify.js'
import { BaseError } from './base.js'
import { getUrl } from './utils.js'
export class OffchainLookupError extends BaseError {
	constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
		super(
			cause.shortMessage ||
				'An error occurred while fetching for an offchain result.',
			{
				cause,
				metaMessages: [
					...(cause.metaMessages || []),
					cause.metaMessages?.length ? '' : [],
					'Offchain Gateway Call:',
					urls && [
						'  Gateway URL(s):',
						...urls.map((url) => `    ${getUrl(url)}`),
					],
					`  Sender: ${sender}`,
					`  Data: ${data}`,
					`  Callback selector: ${callbackSelector}`,
					`  Extra data: ${extraData}`,
				].flat(),
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'OffchainLookupError',
		})
	}
}
export class OffchainLookupResponseMalformedError extends BaseError {
	constructor({ result, url }) {
		super(
			'Offchain gateway response is malformed. Response data must be a hex value.',
			{
				metaMessages: [
					`Gateway URL: ${getUrl(url)}`,
					`Response: ${stringify(result)}`,
				],
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'OffchainLookupResponseMalformedError',
		})
	}
}
export class OffchainLookupSenderMismatchError extends BaseError {
	constructor({ sender, to }) {
		super(
			'Reverted sender address does not match target contract address (`to`).',
			{
				metaMessages: [
					`Contract address: ${to}`,
					`OffchainLookup sender address: ${sender}`,
				],
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'OffchainLookupSenderMismatchError',
		})
	}
}
//# sourceMappingURL=ccip.js.map
