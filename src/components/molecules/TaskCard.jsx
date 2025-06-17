import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      className={`bg-white rounded-lg border border-surface-200 p-4 shadow-sm transition-all duration-200 ${
        task.completed ? 'opacity-75' : ''
      } ${className}`}
    >
      {/* Priority Indicator */}
      <div 
        className="priority-dot absolute left-0 top-4"
        style={{ backgroundColor: getPriorityColor(task.priority) }}
      />
      
      <div className="flex items-start space-x-3 ml-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.Id)}
          />
        </div>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-surface-900 ${
            task.completed ? 'task-completed' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`mt-1 text-sm text-surface-600 ${
              task.completed ? 'task-completed' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          {/* Task Meta */}
          <div className="mt-3 flex items-center space-x-4">
            {/* Category Badge */}
            {category && (
              <div 
                className="category-badge text-white"
                style={{ backgroundColor: category.color + '90' }}
              >
                <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
                {category.name}
              </div>
            )}
            
            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center text-xs ${
                isOverdue ? 'text-error' : 
                isDueToday ? 'text-warning' : 
                'text-surface-500'
              }`}>
                <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                {isOverdue && <span className="ml-1 font-medium">Overdue</span>}
                {isDueToday && <span className="ml-1 font-medium">Today</span>}
              </div>
            )}
            
            {/* Priority Badge */}
            <div className={`text-xs px-2 py-1 rounded-full ${
              task.priority === 'high' ? 'bg-error/10 text-error' :
              task.priority === 'medium' ? 'bg-warning/10 text-warning' :
              'bg-surface-100 text-surface-600'
            }`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-1.5 text-surface-400 hover:text-primary rounded-md hover:bg-surface-50"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.Id)}
            className="p-1.5 text-surface-400 hover:text-error rounded-md hover:bg-surface-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;