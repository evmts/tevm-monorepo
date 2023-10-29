import { BaseError } from './base.js'
export class EnsAvatarInvalidMetadataError extends BaseError {
	constructor({ data }) {
		super(
			'Unable to extract image from metadata. The metadata may be malformed or invalid.',
			{
				metaMessages: [
					'- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.',
					'',
					`Provided data: ${JSON.stringify(data)}`,
				],
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'EnsAvatarInvalidMetadataError',
		})
	}
}
export class EnsAvatarInvalidNftUriError extends BaseError {
	constructor({ reason }) {
		super(`ENS NFT avatar URI is invalid. ${reason}`)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'EnsAvatarInvalidNftUriError',
		})
	}
}
export class EnsAvatarUriResolutionError extends BaseError {
	constructor({ uri }) {
		super(
			`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`,
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'EnsAvatarUriResolutionError',
		})
	}
}
export class EnsAvatarUnsupportedNamespaceError extends BaseError {
	constructor({ namespace }) {
		super(
			`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`,
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'EnsAvatarUnsupportedNamespaceError',
		})
	}
}
//# sourceMappingURL=ens.js.map
