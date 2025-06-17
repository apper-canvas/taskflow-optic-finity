import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ViewSwitcher from '@/components/molecules/ViewSwitcher';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onQuickAdd, onToggleSidebar, onSearch, activeView, onViewChange }) => {
  return (
    <header className="h-16 bg-white border-b border-surface-200 flex-shrink-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-md"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="font-display text-xl font-bold text-surface-900 hidden sm:block">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search tasks..."
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* View Switcher */}
          <div className="hidden sm:block">
            <ViewSwitcher 
              activeView={activeView}
              onViewChange={onViewChange}
            />
          </div>

          {/* Quick Add Button */}
          <Button
            onClick={onQuickAdd}
            variant="primary"
            icon="Plus"
            className="px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search tasks..."
        />
      </div>
    </header>
  );
};

export default Header;