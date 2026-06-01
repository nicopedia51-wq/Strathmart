'use client';

import { useState, useRef } from 'react';

export default function ImageUpload({ onImageSelect, maxSize = 5 * 1024 * 1024 }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Only image (JPG, PNG, GIF, WebP) and video (MP4, WebM) files are allowed');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview({
        url: e.target?.result,
        type: file.type,
        name: file.name
      });
      onImageSelect(file, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!preview ? (
          <>
            <div className="text-4xl mb-3">📸</div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Click to upload image or video
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, GIF, WebP or MP4, WebM (Max 5MB)
            </p>
          </>
        ) : (
          <>
            {preview.type.startsWith('image/') ? (
              <img src={preview.url} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
            ) : (
              <video src={preview.url} className="w-32 h-32 object-cover mx-auto rounded-lg" controls />
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{preview.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Remove
            </button>
          </>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
