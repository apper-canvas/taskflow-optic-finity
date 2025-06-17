import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Header from '@/components/organisms/Header';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import QuickAddModal from '@/components/organisms/QuickAddModal';

const Layout = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header 
        onQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto">
          <CategorySidebar />
        </aside>
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto z-50"
              >
                <CategorySidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};

export default Layout;