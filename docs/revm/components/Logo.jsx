import React from 'react';

export function RevmLogo({ className, width = 40, height = 40 }) {
  return (
    <div className={`revm-logo ${className || ''}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#0085FF" fillOpacity="0.1" stroke="#0085FF" strokeWidth="2" />
        <path 
          d="M30 30 L70 30 L70 70 L30 70 Z" 
          fill="none"
          stroke="#0085FF" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path 
          d="M30 30 L50 50 L30 70" 
          fill="none"
          stroke="#0085FF" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path 
          d="M70 30 L50 50 L70 70" 
          fill="none"
          stroke="#0085FF" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="5" fill="#0085FF" />
      </svg>
    </div>
  );
}

export default RevmLogo;