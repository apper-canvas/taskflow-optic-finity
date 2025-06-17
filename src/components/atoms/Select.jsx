import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  error,
  disabled = false,
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const hasValue = !!selectedOption;

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const selectClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200 cursor-pointer
    ${error 
      ? 'border-error focus:border-error focus:ring-error/20' 
      : 'border-surface-300 focus:border-primary focus:ring-primary/20'
    }
    ${disabled 
      ? 'bg-surface-100 cursor-not-allowed opacity-60' 
      : 'bg-white focus:ring-2 hover:border-surface-400'
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
      
      <div
        className={selectClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-surface-900' : 'text-surface-500'}>
            {selectedOption ? selectedOption.label : (!label ? placeholder : '')}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronDown" className="w-4 h-4 text-surface-400" />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`px-3 py-2 cursor-pointer transition-colors duration-200 hover:bg-surface-50
                  ${option.value === value ? 'bg-primary/10 text-primary' : 'text-surface-700'}
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                `}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.value === value && (
                    <ApperIcon name="Check" className="w-4 h-4 text-primary" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
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

export default Select;