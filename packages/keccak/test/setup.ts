// This file is used to setup the test environment
// It is executed before running tests

// Mock WebAssembly fetch for Node.js environment
if (typeof global !== 'undefined') {
  // @ts-ignore
  global.fetch = (url: string) => {
    const fs = require('fs')
    const path = require('path')
    const buffer = fs.readFileSync(path.resolve(url.replace('file://', '')))
    
    return Promise.resolve({
      arrayBuffer: () => buffer,
      ok: true,
    })
  }
}