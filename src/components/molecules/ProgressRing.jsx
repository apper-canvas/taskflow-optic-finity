import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ 
  progress = 0, 
  size = 80, 
  strokeWidth = 8, 
  label,
  showPercentage = true,
  className = '' 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#5B21B6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showPercentage && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-lg font-semibold text-surface-900"
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm text-surface-600 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;