'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getEnsAvatar = void 0
const parseAvatarRecord_js_1 = require('../../utils/ens/avatar/parseAvatarRecord.js')
const getEnsText_js_1 = require('./getEnsText.js')
async function getEnsAvatar(
	client,
	{ blockNumber, blockTag, gatewayUrls, name, universalResolverAddress },
) {
	const record = await (0, getEnsText_js_1.getEnsText)(client, {
		blockNumber,
		blockTag,
		key: 'avatar',
		name,
		universalResolverAddress,
	})
	if (!record) return null
	try {
		return await (0, parseAvatarRecord_js_1.parseAvatarRecord)(client, {
			record,
			gatewayUrls,
		})
	} catch {
		return null
	}
}
exports.getEnsAvatar = getEnsAvatar
//# sourceMappingURL=getEnsAvatar.js.map
