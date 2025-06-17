import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  className = ''
}) => {
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const statusOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.Id.toString(),
      label: cat.name
    }))
  ];

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className={`bg-white border border-surface-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Category Filter */}
        <div className="flex-1 min-w-0 sm:max-w-48">
          <Select
            options={categoryOptions}
            value={filters.categoryId || ''}
            onChange={(value) => onFilterChange('categoryId', value)}
            placeholder="Filter by category"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex-1 min-w-0 sm:max-w-48">
          <Select
            options={priorityOptions}
            value={filters.priority || ''}
            onChange={(value) => onFilterChange('priority', value)}
            placeholder="Filter by priority"
          />
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-0 sm:max-w-48">
          <Select
            options={statusOptions}
            value={filters.status || ''}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Filter by status"
          />
        </div>

        {/* Clear Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-surface-100"
          >
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                let label = value;
                if (key === 'categoryId') {
                  const category = categories.find(cat => cat.Id.toString() === value);
                  label = category ? category.name : value;
                } else if (key === 'priority') {
                  label = `${value.charAt(0).toUpperCase() + value.slice(1)} Priority`;
                } else if (key === 'status') {
                  label = value.charAt(0).toUpperCase() + value.slice(1);
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    <span>{label}</span>
                    <button
                      onClick={() => onFilterChange(key, '')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;