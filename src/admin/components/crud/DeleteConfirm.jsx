import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeleteConfirm = ({
  open,
  onClose,
  onConfirm,
  itemName = "this item"
}) => {
  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-zinc-900 border border-red-900/30 rounded-lg shadow-2xl w-full max-w-md overflow-hidden p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/50">
          <AlertTriangle className="text-red-500" size={32} />
        </div>
        
        <h2 className="text-2xl font-heading text-white uppercase tracking-widest font-semibold mb-2">
          Confirm Deletion
        </h2>
        
        <p className="text-zinc-400 font-body mb-8">
          Are you sure you want to delete <span className="text-red-400 font-bold">"{itemName}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center space-x-3 w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-zinc-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirm;
