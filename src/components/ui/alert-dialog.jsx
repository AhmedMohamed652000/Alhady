import * as React from "react"

const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" />
      <div className="relative z-50 w-full max-w-md bg-zinc-900 border border-gold/30 shadow-lg rounded-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>
  )
}

const AlertDialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const AlertDialogHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left mb-4 ${className}`}>
    {children}
  </div>
)

const AlertDialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-heading text-gold uppercase ${className}`}>
    {children}
  </h2>
)

const AlertDialogDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-zinc-400 font-body ${className}`}>
    {children}
  </p>
)

const AlertDialogFooter = ({ children, className = "" }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className}`}>
    {children}
  </div>
)

const AlertDialogAction = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors ${className}`}
  >
    {children}
  </button>
)

const AlertDialogCancel = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors ${className}`}
  >
    {children}
  </button>
)

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}
