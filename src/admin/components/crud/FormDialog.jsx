import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FormDialog = ({
  open,
  onClose,
  title,
  onSubmit,
  submitting = false,
  children,
  submitLabel = "Save"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-zinc-900 border border-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
          <h2 className="text-xl font-heading text-gold uppercase tracking-widest font-semibold">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-gold transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto font-body text-zinc-300">
          <form id="admin-form" onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}>
            <div className="space-y-4">
              {children}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold/10 flex items-center justify-end space-x-3 bg-zinc-950/50">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="admin-form"
            disabled={submitting}
            className="bg-gold hover:bg-gold/80 text-black font-bold uppercase px-6"
          >
            {submitting ? 'Processing...' : submitLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormDialog;
