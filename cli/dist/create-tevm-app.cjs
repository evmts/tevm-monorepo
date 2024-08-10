#!/usr/bin/env node
'use strict';

var Pastel = require('pastel');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Pastel__default = /*#__PURE__*/_interopDefault(Pastel);

new Pastel__default.default({
  importMeta: ({ url: (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('create-tevm-app.cjs', document.baseURI).href)) }),
  name: "tevm",
  version: "beta",
  description: "entrypoint to tevm cli"
}).run();
console.clear();
//# sourceMappingURL=create-tevm-app.cjs.map
//# sourceMappingURL=create-tevm-app.cjs.map