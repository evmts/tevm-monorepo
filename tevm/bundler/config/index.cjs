'use strict';

var config = require('@tevm/config');



Object.keys(config).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return config[k]; }
	});
});
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map