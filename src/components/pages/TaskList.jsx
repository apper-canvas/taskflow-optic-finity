import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import TaskListOrg from '@/components/organisms/TaskList';

const TaskListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('list');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header with integrated controls */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 font-display">My Tasks</h1>
            <p className="text-surface-600 mt-1">Stay organized and get things done</p>
          </div>
          
          {/* View Switcher - Mobile */}
          <div className="sm:hidden">
            <div className="bg-surface-100 p-1 rounded-lg flex">
              {['list', 'kanban', 'calendar'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === view
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="flex-1 overflow-y-auto">
        <TaskListOrg 
          searchQuery={searchQuery}
          activeView={activeView}
        />
      </div>
    </motion.div>
  );
};

export default TaskListPage;