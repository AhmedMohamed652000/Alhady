import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

const ImageField = ({
  value,
  onChange,
  label = "Image",
  error = null
}) => {
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold">
        {label}
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-video rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center
          ${preview ? 'border-gold/50' : 'border-zinc-800 hover:border-gold/30 bg-zinc-950/30'}
        `}
      >
        {preview ? (
          <>
            <img 
              src={preview.startsWith('data:') ? preview : `${process.env.REACT_APP_API_URL || ''}${preview}`} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Change Image</p>
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/20">
              <Upload className="text-gold/50" size={24} />
            </div>
            <p className="text-zinc-500 text-sm font-body">
              Click to upload or drag and drop
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              PNG, JPG or WEBP (Max 2MB)
            </p>
          </div>
        )}
        
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 font-body">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageField;
