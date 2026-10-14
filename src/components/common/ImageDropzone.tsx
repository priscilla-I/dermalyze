import React, { useRef, useState } from 'react';
import { Upload, Camera, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

interface ImageDropzoneProps {
  label: string;
  description: string;
  image: string | null;
  onImageSelect: (base64: string | null) => void;
  onLoadSample?: () => void;
  sampleLabel?: string;
  facingMode?: 'user' | 'environment';
  guideType?: 'face' | 'shelf' | 'product';
  compact?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  label,
  description,
  image,
  onImageSelect,
  onLoadSample,
  sampleLabel = "Load Sample",
  facingMode = 'user',
  guideType = 'face',
  compact = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 font-sans flex items-center gap-1.5">
          {label}
        </label>
        {onLoadSample && !image && (
          <button
            type="button"
            onClick={onLoadSample}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{sampleLabel}</span>
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
          compact ? 'h-52' : 'h-64'
        } ${
          image
            ? 'border-transparent shadow-md bg-zinc-950'
            : isDragging
            ? 'border-rose-400 bg-rose-50/40 scale-[0.99]'
            : 'border-zinc-200 hover:border-zinc-300 bg-white/70 backdrop-blur-sm'
        }`}
      >
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 group">
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onImageSelect(null)}
                className="p-3 bg-white/90 hover:bg-white text-zinc-900 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
                title="Remove image"
              >
                <X className="w-5 h-5 text-rose-600" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/90 hover:bg-white text-zinc-900 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
                title="Change image"
              >
                <Upload className="w-5 h-5 text-zinc-800" />
              </button>
            </div>
            <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
              <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                Photo Ready
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:text-zinc-900 group-hover:bg-zinc-200/80 transition-all shadow-inner">
              <Upload className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-zinc-800">{description}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Drag & drop or capture directly</p>
            </div>

            {/* Action Buttons: Upload & Camera */}
            <div className="flex items-center gap-2 mt-2 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <ImageIcon className="w-4 h-4 text-zinc-600" />
                Upload
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Camera className="w-4 h-4 text-rose-300" />
                Camera
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {isCameraOpen && (
        <CameraCapture
          facingMode={facingMode}
          guideType={guideType}
          onCapture={(base64) => {
            onImageSelect(base64);
            setIsCameraOpen(false);
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};
