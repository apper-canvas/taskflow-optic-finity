import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const checkboxClasses = `
    ${sizes[size]} rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200
    ${checked 
      ? 'bg-primary border-primary text-white' 
      : 'bg-white border-surface-300 hover:border-surface-400'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <div className="flex items-center">
      <motion.div
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={checkboxClasses}
        onClick={handleClick}
        {...props}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {label && (
        <label 
          className={`ml-2 cursor-pointer select-none ${disabled ? 'opacity-50' : 'text-surface-700'}`}
          onClick={handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;