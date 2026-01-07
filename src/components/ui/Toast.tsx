"use client";

import { useEffect, useState } from 'react';
import { Toast as ToastType } from '@/types';
import { subscribe, getToasts, removeToast } from '@/lib/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer({ lightMode }: { lightMode: boolean }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    setToasts(getToasts());
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
              lightMode
                ? {
                    success: 'bg-green-50 border-green-300 text-green-800',
                    error: 'bg-red-50 border-red-300 text-red-800',
                    info: 'bg-blue-50 border-blue-300 text-blue-800',
                    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
                  }[toast.type]
                : {
                    success: 'bg-green-900/90 border-green-500 text-green-200',
                    error: 'bg-red-900/90 border-red-500 text-red-200',
                    info: 'bg-blue-900/90 border-blue-500 text-blue-200',
                    warning: 'bg-yellow-900/90 border-yellow-500 text-yellow-200',
                  }[toast.type]
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`text-lg leading-none opacity-70 hover:opacity-100 ${
                  lightMode ? 'text-gray-600' : 'text-gray-400'
                }`}
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}




