'use strict';

var syncStoragePersister = require('@tevm/sync-storage-persister');



Object.keys(syncStoragePersister).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return syncStoragePersister[k]; }
	});
});
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map