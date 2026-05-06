import * as React from "react"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg bg-zinc-900 border border-gold/30 shadow-lg rounded-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 max-h-[85vh] overflow-y-auto ${className}`}>
    {children}
  </div>
)

const DialogHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-heading text-gold uppercase tracking-wider ${className}`}>
    {children}
  </h2>
)

const DialogFooter = ({ children, className = "" }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className}`}>
    {children}
  </div>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }
