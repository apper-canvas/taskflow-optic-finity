import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ViewSwitcher = ({ activeView, onViewChange, className = '' }) => {
  const views = [
    { id: 'list', label: 'List', icon: 'List' },
    { id: 'kanban', label: 'Board', icon: 'Columns' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' }
  ];

  return (
    <div className={`bg-surface-100 p-1 rounded-lg flex ${className}`}>
      {views.map((view) => (
        <motion.button
          key={view.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange(view.id)}
          className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            activeView === view.id
              ? 'text-white shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          {activeView === view.id && (
            <motion.div
              layoutId="activeViewBg"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          <div className="relative z-10 flex items-center space-x-2">
            <ApperIcon name={view.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ViewSwitcher;