'use strict';

var contract = require('@tevm/contract');



Object.keys(contract).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return contract[k]; }
	});
});
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map