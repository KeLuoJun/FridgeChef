import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, CheckCircle, VolumeX } from 'lucide-react';
import { Recipe } from '../types';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 300);
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(timer);
    };
  }, [currentStep]);

  const speakStep = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 0.95; // Slightly slower for clarity
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setDirection('next');
      setCurrentStep(c => c + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection('prev');
      setCurrentStep(c => c - 1);
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-slide-up">
      {/* Immersive Header */}
      <div className="h-20 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100">
        <div className="flex items-center flex-1">
           <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-2 text-center">
          <h2 className="font-bold text-slate-800 text-lg truncate max-w-[200px] md:max-w-md mx-auto">
            {recipe.title}
          </h2>
          <div className="flex items-center justify-center mt-1 space-x-1">
             {recipe.steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-emerald-500' : i < currentStep ? 'w-1.5 bg-emerald-200' : 'w-1.5 bg-slate-200'}`}
                />
             ))}
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
            {currentStep + 1} / {recipe.steps.length}
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 -z-10"></div>
        
        <div 
          className={`
            max-w-3xl w-full bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-emerald-900/5 border border-white/50 relative overflow-hidden transition-all duration-300
            ${animating 
              ? (direction === 'next' ? 'translate-x-8 opacity-0 blur-sm' : '-translate-x-8 opacity-0 blur-sm') 
              : 'translate-x-0 opacity-100 blur-0'}
          `}
        >
          {/* Step Number Background */}
          <div className="absolute -top-6 -left-6 text-[12rem] font-black text-slate-50 leading-none select-none pointer-events-none">
            {currentStep + 1}
          </div>

          <div className="relative z-10">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">
              Step {currentStep + 1}
            </h3>
            <p className="text-2xl md:text-4xl font-medium text-slate-800 leading-relaxed md:leading-tight">
              {recipe.steps[currentStep]}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border-t border-slate-100 px-6 py-6 pb-8 md:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={28} />
          </button>

          <button 
            className={`
              h-16 flex-1 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0
              ${isSpeaking 
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2' 
                : 'bg-slate-800 text-white hover:bg-slate-700'}
            `}
            onClick={() => speakStep(recipe.steps[currentStep])}
          >
            {isSpeaking ? <VolumeX size={24} className="animate-pulse" /> : <Volume2 size={24} />}
            {isSpeaking ? "停止" : "朗读"}
          </button>

          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
          >
            {currentStep === recipe.steps.length - 1 ? <CheckCircle size={28} /> : <ChevronRight size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
};