'use strict';

var common = require('@tevm/common');



Object.keys(common).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return common[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map