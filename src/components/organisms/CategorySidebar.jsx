import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CategoryItem from '@/components/molecules/CategoryItem';
import ProgressRing from '@/components/molecules/ProgressRing';
import { categoryService, taskService } from '@/services';

const CategorySidebar = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, progress: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);

      // Update task counts for categories
const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.category_id?.toString() === category.Id?.toString()).length,
        name: category.Name || category.name
      }));

      setCategories(categoriesWithCounts);
      
      // Calculate stats
      const completedTasks = tasksData.filter(task => task.completed);
      const progress = tasksData.length > 0 ? (completedTasks.length / tasksData.length) * 100 : 0;
      
      setStats({
        total: tasksData.length,
        completed: completedTasks.length,
        progress
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.Id === category.Id ? null : category);
    onClose?.();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {/* Progress Ring Skeleton */}
        <div className="flex justify-center py-6">
          <div className="w-20 h-20 bg-surface-200 rounded-full animate-pulse" />
        </div>
        
        {/* Category Skeletons */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-surface-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error mx-auto mb-2" />
        <p className="text-sm text-error mb-3">{error}</p>
        <button
          onClick={loadData}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Progress Section */}
      <div className="p-4 border-b border-surface-200">
        <div className="text-center mb-4">
          <ProgressRing
            progress={stats.progress}
            size={80}
            label="Today's Progress"
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-surface-600">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-surface-900 mb-3">Categories</h3>
        </div>

        <motion.div className="space-y-1">
          {/* All Tasks */}
          <CategoryItem
            category={{
              Id: 'all',
              name: 'All Tasks',
              icon: 'List',
              color: '#6B7280',
              taskCount: stats.total
            }}
            isActive={selectedCategory?.Id === 'all'}
            onClick={handleCategoryClick}
          />

          {/* Individual Categories */}
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryItem
                category={category}
                isActive={selectedCategory?.Id === category.Id}
                onClick={handleCategoryClick}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Add Category Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 p-3 border-2 border-dashed border-surface-300 rounded-lg text-surface-500 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span className="text-sm font-medium">Add Category</span>
        </motion.button>
      </div>
    </div>
  );
};

export default CategorySidebar;