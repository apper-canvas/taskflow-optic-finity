import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search tasks...', 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      animate={{ width: isExpanded ? '100%' : 'auto' }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => !query && setIsExpanded(false)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-10"
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;