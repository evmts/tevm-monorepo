'use strict';

var blockchain = require('@tevm/blockchain');



Object.keys(blockchain).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return blockchain[k]; }
	});
});
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map