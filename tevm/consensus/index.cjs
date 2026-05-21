'use strict';

var consensus = require('@tevm/consensus');



Object.keys(consensus).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return consensus[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map