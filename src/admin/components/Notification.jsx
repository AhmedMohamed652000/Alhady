import React from 'react';
import { XCircle, CheckCircle2, X } from "lucide-react";

const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: "bg-green-900/40 text-green-300 border-green-700",
    error: "bg-red-900/40 text-red-300 border-red-700"
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-6 border rounded-lg animate-in slide-in-from-top-4 duration-300 ${styles[type]}`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm font-medium font-body">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};

export default Notification;
