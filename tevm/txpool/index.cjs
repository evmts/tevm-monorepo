'use strict';

var txpool = require('@tevm/txpool');



Object.keys(txpool).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return txpool[k]; }
	});
});
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map