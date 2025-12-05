import React, { useRef, useState } from 'react';
import { Camera, Loader2, ImagePlus, Sparkles, Carrot, Utensils, Coffee, Apple } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 relative z-10 w-full max-w-4xl mx-auto">
      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] text-orange-300 animate-float opacity-60"><Carrot size={48} /></div>
        <div className="absolute top-[20%] right-[15%] text-emerald-300 animate-float-delayed opacity-60"><Apple size={40} /></div>
        <div className="absolute bottom-[25%] left-[15%] text-blue-300 animate-float-delayed opacity-60"><Coffee size={36} /></div>
        <div className="absolute bottom-[20%] right-[10%] text-red-300 animate-float opacity-60"><Utensils size={44} /></div>
      </div>

      <div className="w-full max-w-xl relative">
        {/* Main Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 p-1 border border-white/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none z-0"></div>
          
          <div className="relative z-10 bg-white/40 rounded-[2.3rem] p-8 md:p-12 text-center transition-all duration-300">
            
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 bg-gradient-to-tr from-emerald-100 to-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-[0_10px_20px_rgba(16,185,129,0.15)] transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                <Camera size={56} strokeWidth={1.5} />
              </div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight drop-shadow-sm">
              冰箱里有什么？
            </h2>
            <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-sm mx-auto">
              拍一张食材照片，AI 大厨为您推荐创意食谱。
            </p>

            {isLoading ? (
              <div className="relative overflow-hidden rounded-2xl bg-emerald-50/80 border border-emerald-100 p-8 shadow-inner">
                <div className="flex flex-col items-center py-2">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="animate-spin text-emerald-600 relative z-10" size={48} />
                  </div>
                  <p className="text-emerald-800 font-bold text-xl animate-pulse">正在识别食材...</p>
                  <p className="text-emerald-600/70 text-sm mt-2 font-medium">寻找最佳搭配中</p>
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-1/2 bg-gradient-to-b from-emerald-200/20 to-transparent animate-scan"></div>
                </div>
              </div>
            ) : (
              <div 
                onClick={triggerUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  group/upload relative border-3 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
                  ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 bg-white/50 hover:bg-white/80'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="flex flex-col items-center text-slate-400 group-hover/upload:text-emerald-600 transition-colors">
                  <div className="p-4 bg-white rounded-full mb-4 shadow-sm group-hover/upload:scale-110 transition-transform duration-300">
                    <ImagePlus size={32} />
                  </div>
                  <span className="font-bold text-lg text-slate-700">点击上传或拖拽图片</span>
                  <span className="text-sm mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full">支持 JPG, PNG</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};