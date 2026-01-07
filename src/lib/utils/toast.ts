// Toast notification utilities

import { Toast, ToastType } from '@/types';

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

export function subscribe(listener: (toasts: Toast[]) => void) {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
}

function notify() {
  toastListeners.forEach(listener => listener([...toasts]));
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const id = Math.random().toString(36).substring(7);
  const toast: Toast = { id, message, type, duration };
  
  toasts.push(toast);
  notify();

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notify();
}

export function clearToasts() {
  toasts = [];
  notify();
}

export function getToasts(): Toast[] {
  return [...toasts];
}




