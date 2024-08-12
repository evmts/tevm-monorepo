'use strict';

var memoryClient = require('@tevm/memory-client');



Object.keys(memoryClient).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return memoryClient[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map