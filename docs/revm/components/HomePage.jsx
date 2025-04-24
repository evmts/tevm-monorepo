import React from 'react';

export const HomePage = () => (
  <div className="py-10 space-y-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">REVM Documentation</h1>
      <p className="text-xl max-w-3xl mx-auto">
        Comprehensive documentation for REVM (Rust Ethereum Virtual Machine) - 
        a high-performance Ethereum execution environment written in Rust
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
      <FeatureCard 
        title="Beginner Tutorial" 
        description="Step by step guide to using REVM for the first time"
        link="/beginner-tutorial/introduction-to-revm"
        icon="📚"
      />
      <FeatureCard 
        title="Intermediate Concepts" 
        description="Deeper dive into the architecture and key concepts"
        link="/intermediate-concepts/revm-architecture"
        icon="🧩"
      />
      <FeatureCard 
        title="Code Examples" 
        description="Practical examples for common use cases"
        link="/examples/basic-transaction-processing"
        icon="💻"
      />
      <FeatureCard 
        title="Expert Reference" 
        description="Detailed API documentation and advanced usage"
        link="/expert-reference/api-reference"
        icon="📖"
      />
      <FeatureCard 
        title="Performance" 
        description="Learn about REVM's performance characteristics"
        link="/intermediate-concepts/performance-considerations"
        icon="⚡"
      />
      <FeatureCard 
        title="Custom Integration" 
        description="Integrating REVM into your applications"
        link="/intermediate-concepts/integration-patterns"
        icon="🔌"
      />
    </div>
  </div>
);

const FeatureCard = ({ title, description, link, icon }) => (
  <a 
    href={link}
    className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="opacity-80">{description}</p>
  </a>
);