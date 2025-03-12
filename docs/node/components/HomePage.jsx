import React from 'react';

export const HomePage = {
  Root: ({ children }) => (
    <div className="home-page">{children}</div>
  ),
  
  Tagline: ({ children }) => (
    <h1 className="text-4xl font-bold text-center my-6">{children}</h1>
  ),
  
  Description: ({ children }) => (
    <p className="text-xl text-center max-w-3xl mx-auto my-6">{children}</p>
  ),
  
  InstallPackage: ({ name, type }) => (
    <div className="install-package bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-lg mx-auto text-left">
      {type === 'install' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-bold mb-1">npm</div>
            <pre className="text-sm"><code>{`npm install ${name}`}</code></pre>
          </div>
          <div>
            <div className="text-xs font-bold mb-1">bun</div>
            <pre className="text-sm"><code>{`bun add ${name}`}</code></pre>
          </div>
          <div>
            <div className="text-xs font-bold mb-1">deno</div>
            <pre className="text-sm"><code>{`import { createMemoryClient } from "npm:${name}";`}</code></pre>
          </div>
        </div>
      ) : (
        <pre className="text-sm"><code>{name}</code></pre>
      )}
    </div>
  ),
  
  Buttons: ({ children }) => (
    <div className="flex flex-wrap justify-center gap-4 my-6">{children}</div>
  ),
  
  Button: ({ children, href, variant }) => {
    const variantClass = variant === 'accent' 
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700';
    
    return (
      <a href={href} className={`px-4 py-2 rounded-lg ${variantClass}`}>
        {children}
      </a>
    );
  }
};