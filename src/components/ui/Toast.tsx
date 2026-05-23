import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 1800 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-accent text-white px-10 py-4 rounded-full text-lg font-bold z-[9999] shadow-xl animate-fade-in">
      {message}
    </div>
  );
}
