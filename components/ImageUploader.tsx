
import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvent = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(dragging);
    }
  }, [isLoading]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvent, onImageUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="image-upload"
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full h-64 px-4 transition bg-brand-secondary border-2 ${
          isDragging ? 'border-brand-accent' : 'border-gray-600'
        } border-dashed rounded-md cursor-pointer hover:border-brand-accent`}
      >
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-4 text-lg text-gray-300">
            <span className="font-semibold text-brand-accent">Upload a file</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input id="image-upload" name="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
      </label>
    </div>
  );
};

export default ImageUploader;
