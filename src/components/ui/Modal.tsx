import { useEffect, useCallback } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ title, onClose, children, maxWidth = '720px' }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex justify-center items-start pt-10 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl p-10 w-full mb-10 shadow-xl"
        style={{ maxWidth }}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black m-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface text-text-muted text-xl hover:bg-accent-bg cursor-pointer border-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
