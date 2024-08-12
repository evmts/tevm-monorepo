'use strict';

var rollupPlugin = require('@tevm/rollup-plugin');



Object.keys(rollupPlugin).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return rollupPlugin[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map