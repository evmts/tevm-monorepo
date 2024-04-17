import starlightLinksValidatorPlugin from 'starlight-links-validator'

export const pluginLinkValidator = () =>
	starlightLinksValidatorPlugin({
		errorOnRelativeLinks: true,
	})
