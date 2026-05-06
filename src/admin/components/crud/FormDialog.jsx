import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FormDialog = ({
  open,
  onClose,
  title,
  onSubmit,
  submitting = false,
  children,
  submitLabel = "Save"
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader className="p-6 pb-0">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          <div className="space-y-4 py-2">
            {children}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="min-w-[80px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
