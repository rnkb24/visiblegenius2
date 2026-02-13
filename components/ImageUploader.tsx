import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!isLoading) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!isLoading) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full max-w-xl mx-auto p-12 flex flex-col items-center justify-center transition-all duration-200 ease-linear group
        ${dragActive ? 'bg-[#F0C020] border-4 border-black border-dashed' : 'bg-white border-4 border-black border-dashed'}
        ${isLoading ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:bg-[#FDFBF7]'}
        shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={!isLoading ? onButtonClick : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={isLoading}
      />

      {/* Geometric Decorative Elements */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-black"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-black rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-b-[12px] border-b-black border-r-[6px] border-r-transparent"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 border-2 border-black"></div>


      <div className={`p-6 mb-6 border-4 border-black rounded-full transition-transform duration-200 group-hover:scale-110 ${dragActive ? 'bg-white' : 'bg-[#F0C020]'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-wide">Image Input</h3>
      <p className="text-neutral-600 text-center mb-8 font-medium">
        Drop file here<br/>
        <span className="text-xs text-neutral-400 font-mono border border-neutral-300 px-2 mt-1 inline-block bg-white">JPG / PNG</span>
      </p>

      <button
        className={`px-8 py-3 font-bold text-sm transition-all border-4 border-black uppercase tracking-widest ${
            isLoading 
            ? 'bg-neutral-200 text-neutral-400 border-neutral-400' 
            : 'bg-[#D02020] text-white hover:bg-[#b01010] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        }`}
        disabled={isLoading}
      >
        Select File
      </button>
    </div>
  );
};