
"use client";

import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  imageUrl?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelect, selectedFile, onClear, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  if (selectedFile && imageUrl) {
    return (
      <div className="relative group rounded-xl overflow-hidden border-2 border-border bg-card shadow-sm aspect-video flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Original preview"
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
           <Button variant="destructive" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-2" /> Remove
           </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md flex justify-between">
          <span className="truncate max-w-[150px]">{selectedFile.name}</span>
          <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer transition-all duration-300 border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center gap-4 p-8",
        isDragging 
          ? "border-accent bg-accent/5 scale-[1.01]" 
          : "border-border hover:border-accent hover:bg-accent/5"
      )}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
        <Upload className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-primary">Drop your image here</p>
        <p className="text-sm text-muted-foreground mt-1">Or click to browse files</p>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          <ImageIcon className="w-3.5 h-3.5" />
          Supports JPG, PNG, WEBP
        </div>
      </div>
    </div>
  );
};
