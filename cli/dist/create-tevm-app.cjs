#!/usr/bin/env node
'use strict';

var Pastel = require('pastel');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Pastel__default = /*#__PURE__*/_interopDefault(Pastel);

new Pastel__default.default({
  importMeta: ({ url: (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('out.js', document.baseURI).href)) }),
  name: "create-evmts-app",
  version: "beta",
  description: "Scaffold a new EVMTS application"
}).run();
console.clear();
//# sourceMappingURL=out.js.map
//# sourceMappingURL=create-tevm-app.cjs.map