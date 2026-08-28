import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

import { useAppStore } from '../../store/useAppStore';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1],
};

export const AppLayout = () => {
  const location = useLocation();
  const theme = useAppStore(state => state.theme);

  React.useEffect(() => {
    // Carbon Neon theme is always dark — force dark class at all times
    document.documentElement.classList.add('dark');
  }, []);


  return (
    <div className="flex h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};