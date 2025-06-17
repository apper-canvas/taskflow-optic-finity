import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CategoryItem = ({ 
  category, 
  isActive = false, 
  onClick,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-primary/10 border-l-4 border-primary' 
          : 'hover:bg-surface-100'
      } ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex items-center space-x-2">
          <ApperIcon 
            name={category.icon} 
            className="w-4 h-4 text-surface-600" 
          />
          <span className={`font-medium ${
            isActive ? 'text-primary' : 'text-surface-700'
          }`}>
            {category.name}
          </span>
        </div>
      </div>
      
      {category.taskCount > 0 && (
        <div className={`text-xs px-2 py-1 rounded-full ${
          isActive 
            ? 'bg-primary text-white' 
            : 'bg-surface-200 text-surface-600'
        }`}>
          {category.taskCount}
        </div>
      )}
    </motion.div>
  );
};

export default CategoryItem;