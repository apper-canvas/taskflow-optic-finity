import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService, categoryService } from '@/services';

const QuickAddModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Focus on title input
      setTimeout(() => {
        const titleInput = document.querySelector('input[name="title"]');
        titleInput?.focus();
      }, 100);
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].Id.toString() }));
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await taskService.create({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
      
      toast.success('Task created successfully!');
      onClose();
      resetForm();
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: categories.length > 0 ? categories[0].Id.toString() : '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      resetForm();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.Id.toString(),
    label: cat.name
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <h2 className="text-lg font-semibold text-surface-900">Add New Task</h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1 text-surface-400 hover:text-surface-600 rounded-md hover:bg-surface-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <Input
                  name="title"
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  required
                  disabled={loading}
                />

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Add task description..."
                    disabled={loading}
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    options={categoryOptions}
                    value={formData.categoryId}
                    onChange={(value) => handleChange('categoryId', value)}
                    error={errors.categoryId}
                    required
                    disabled={loading}
                  />

                  <Select
                    label="Priority"
                    options={priorityOptions}
                    value={formData.priority}
                    onChange={(value) => handleChange('priority', value)}
                    disabled={loading}
                  />
                </div>

                {/* Due Date */}
                <Input
                  label="Due Date"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  disabled={loading}
                />

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon="Plus"
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;