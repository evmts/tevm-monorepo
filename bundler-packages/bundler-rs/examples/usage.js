const { bundleCodeJs } = require('../');
const path = require('path');

async function main() {
  try {
    // Bundle a sample file
    const result = await bundleCodeJs(path.join(__dirname, '../test/fixtures/test.js'), {
      sourceMap: true,
      minify: false
    });

    console.log('Bundled code:');
    console.log(result.code);
    
    console.log('\nSource map available:', !!result.sourceMap);
    
    console.log('\nModules included:');
    Object.keys(result.modules).forEach(modulePath => {
      console.log(`- ${modulePath}`);
    });
  } catch (error) {
    console.error('Error bundling code:', error);
  }
}

main().catch(console.error);