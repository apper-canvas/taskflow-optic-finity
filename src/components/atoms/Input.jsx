import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  error,
  icon,
  iconPosition = 'left',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${error 
      ? 'border-error focus:border-error focus:ring-error/20' 
      : 'border-surface-300 focus:border-primary focus:ring-primary/20'
    }
    ${disabled 
      ? 'bg-surface-100 cursor-not-allowed opacity-60' 
      : 'bg-white focus:ring-2'
    }
    focus:outline-none
    ${className}
  `;

  return (
    <div className="relative">
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: isFocused || hasValue ? -20 : 0,
            scale: isFocused || hasValue ? 0.875 : 1,
            color: isFocused ? (error ? '#EF4444' : '#5B21B6') : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 top-2.5 pointer-events-none origin-left z-10 bg-white px-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-4 h-4" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={!label ? placeholder : ''}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;