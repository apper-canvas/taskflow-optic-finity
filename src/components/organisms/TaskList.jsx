import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import FilterBar from '@/components/molecules/FilterBar';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { taskService, categoryService } from '@/services';

const TaskList = ({ searchQuery = '', activeView = 'list' }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: '',
    priority: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categoryId) {
      filtered = filtered.filter(task => task.categoryId === filters.categoryId);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completed);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(task => !task.completed);
      } else if (filters.status === 'overdue') {
        const now = new Date();
        filtered = filtered.filter(task => 
          !task.completed && 
          task.dueDate && 
          new Date(task.dueDate) < now
        );
      }
    }

    setFilteredTasks(filtered);
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.Id === taskId ? { ...t, completed: !t.completed } : t
    ));

    try {
      if (task.completed) {
        await taskService.markIncomplete(taskId);
        toast.success('Task marked as incomplete');
      } else {
        await taskService.markComplete(taskId);
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      // Revert optimistic update
      setTasks(prev => prev.map(t => 
        t.Id === taskId ? { ...t, completed: task.completed } : t
      ));
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    // Optimistic update
    setTasks(prev => prev.filter(t => t.Id !== taskId));

    try {
      await taskService.delete(taskId);
      toast.success('Task deleted successfully');
    } catch (err) {
      // Revert optimistic update
      loadData();
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    // TODO: Open edit modal
    toast.info('Edit functionality coming soon!');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: '',
      priority: '',
      status: ''
    });
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id.toString() === categoryId);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Filter Bar Skeleton */}
        <div className="h-16 bg-surface-100 rounded-lg animate-pulse" />
        
        {/* Task Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-24 bg-surface-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <Button onClick={loadData} variant="primary" icon="RefreshCw">
          Try Again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-6"
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="text-lg font-medium text-surface-900 mb-2">No tasks yet</h3>
          <p className="text-surface-600 mb-6">
            Get started by creating your first task and stay organized!
          </p>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {/* TODO: Open quick add modal */}}
            className="mx-auto"
          >
            Create Your First Task
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        categories={categories}
      />

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No tasks found</h3>
              <p className="text-surface-600">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      {filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-6 border-t border-surface-200"
        >
          <div className="text-sm text-surface-600">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;