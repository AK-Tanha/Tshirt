'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export interface ImageFile {
  id: string;
  dataUrl: string;
  file: File;
}

interface ImageDropzoneProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageDropzone({ images, onChange, maxImages = 10, label }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file: File): Promise<ImageFile> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({ id: crypto.randomUUID(), dataUrl: reader.result as string, file });
      reader.readAsDataURL(file);
    });

  const handleFiles = useCallback(async (fileList: FileList) => {
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const remaining = maxImages - images.length;
    const toAdd = incoming.slice(0, remaining);
    const read = await Promise.all(toAdd.map(readFile));
    onChange([...images, ...read]);
  }, [images, maxImages, onChange]);

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs text-muted uppercase tracking-wider font-medium block">{label}</label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors cursor-pointer",
          dragging
            ? "border-black bg-stone"
            : "border-border hover:border-black/40 hover:bg-stone/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          dragging ? "bg-black text-white" : "bg-stone text-muted",
        )}>
          <Upload className="w-4 h-4" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-black">
            {dragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-xs text-muted mt-0.5">
            PNG, JPG, WebP ({images.length}/{maxImages})
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-stone border border-border">
              <Image src={img.dataUrl} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
