'use strict';

var predeploys = require('@tevm/predeploys');



Object.keys(predeploys).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return predeploys[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map