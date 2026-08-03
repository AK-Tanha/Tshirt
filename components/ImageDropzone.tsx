'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2, Star } from 'lucide-react';
import { uploadImage } from '@/lib/api/uploads';

interface PendingImage {
  id: string;
  preview: string;
  name: string;
  error?: string;
}

interface ImageDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  maxSizeMB?: number;
  heroUrl?: string;
  onHeroChange?: (url: string) => void;
}

export function ImageDropzone({
  value,
  onChange,
  maxImages = 10,
  label,
  maxSizeMB = 7.5,
  heroUrl,
  onHeroChange,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<PendingImage[]>([]);

  const addPending = (file: File): PendingImage => {
    const entry: PendingImage = {
      id: Math.random().toString(36).slice(2),
      preview: URL.createObjectURL(file),
      name: file.name,
    };
    setPending((prev) => [...prev, entry]);
    return entry;
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const markPendingError = (id: string, error: string) => {
    setPending((prev) =>
      prev.map((p) => (p.id === id ? { ...p, error } : p)),
    );
  };

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const incoming = Array.from(fileList).filter(
        (f) => f.type.startsWith('image/'),
      );
      if (incoming.length === 0) return;

      const remaining = maxImages - value.length - pending.length;
      const toUpload = incoming.slice(0, Math.max(remaining, 0));

      const committed: string[] = [];

      for (const file of toUpload) {
        const entry = addPending(file);

        try {
          const url = await uploadImage(file);
          committed.push(url);
          URL.revokeObjectURL(entry.preview);
          setPending((prev) => prev.filter((p) => p.id !== entry.id));
        } catch (err) {
          markPendingError(
            entry.id,
            err instanceof Error
              ? err.message
              : 'Upload failed — please try again',
            );
        }
      }

      if (committed.length > 0) {
        onChange([...value, ...committed]);
      }
    },
    [maxImages, value, onChange, pending.length],
  );

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
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

  const full = value.length + pending.length >= maxImages;

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs text-muted uppercase tracking-wider font-medium block">
          {label}
        </label>
      )}

      <div
        onClick={() => !full && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors',
          full
            ? 'cursor-not-allowed border-border bg-stone/40 opacity-70'
            : 'cursor-pointer',
          dragging ? 'border-black bg-stone' : 'border-border hover:border-black/40 hover:bg-stone/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={full}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
            dragging ? 'bg-black text-white' : 'bg-stone text-muted',
          )}
        >
          <Upload className="w-4 h-4" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-black">
            {full
              ? 'Image limit reached'
              : dragging
                ? 'Drop images here'
                : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-xs text-muted mt-0.5">
            JPEG, PNG, WebP up to {maxSizeMB}MB ({value.length}/{maxImages})
          </p>
        </div>
      </div>

      {(value.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url) => (
            <div
              key={url}
              className={cn(
                'relative group aspect-square rounded-lg overflow-hidden bg-stone border',
                url === heroUrl ? 'border-black ring-1 ring-black' : 'border-border',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              {url === heroUrl && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/80 text-white text-[9px] font-mono uppercase tracking-wider rounded-full">
                  <Star className="w-2.5 h-2.5 fill-current" /> Hero
                </span>
              )}
              {onHeroChange && url !== heroUrl && (
                <button
                  type="button"
                  onClick={() => onHeroChange(url)}
                  className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-mono uppercase tracking-wider rounded-full opacity-0 group-hover:opacity-100 hover:bg-black transition-all"
                  aria-label="Set as hero image"
                >
                  <Star className="w-2.5 h-2.5" /> Hero
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {pending.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-stone border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={img.name}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                {img.error ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-[9px] text-white leading-tight">
                      {img.error}
                    </span>
                  </>
                ) : (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                )}
              </div>
              <button
                type="button"
                onClick={() => removePending(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5" />
        Images upload to Vercel Blob and get a public URL automatically.
      </p>
    </div>
  );
}