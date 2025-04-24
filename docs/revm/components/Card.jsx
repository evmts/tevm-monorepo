import React from 'react';

export function Card({ title, icon, children, className, href, ...props }) {
  const CardComponent = href ? 'a' : 'div';
  
  return (
    <CardComponent 
      href={href}
      className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-all 
                 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md
                 ${href ? 'cursor-pointer' : ''}
                 ${className || ''}`} 
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          {icon && <span className="mr-2 text-2xl">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </CardComponent>
  );
}

export function CardGrid({ children, columns, className }) {
  // Default grid with responsive breakpoints
  const gridClass = columns || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8";
  
  return (
    <div className={`${gridClass} ${className || ''}`}>
      {children}
    </div>
  );
}

export function FeatureCard({ title, description, icon, link }) {
  return (
    <Card href={link} icon={icon} title={title} className="h-full">
      <p>{description}</p>
    </Card>
  );
}