import React, { useState } from 'react';
import api from '@/admin/services/api';
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageField = ({
  value,
  onChange,
  label = "Image"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit per plan.md)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-400 font-body block">
        {label}
      </label>
      
      <div className="flex items-start space-x-4">
        {/* Preview Area */}
        <div className="relative group w-24 h-24 flex-shrink-0 bg-zinc-800 rounded border border-gold/20 overflow-hidden flex items-center justify-center">
          {value ? (
            <>
              <img
                src={`http://localhost:5000${value}`}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Clear image"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-zinc-600" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 justify-center h-24">
          <label className="cursor-pointer">
            <span className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-800 text-gold border border-gold/30 hover:bg-gold hover:text-white'
            }`}>
              <Upload className="w-4 h-4 mr-2" />
              {value ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
          </label>
          {error && <p className="text-xs text-red-500 font-body">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageField;
