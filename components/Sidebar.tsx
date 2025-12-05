import React from 'react';
import { Filter, X, Check, Leaf, Ban, Wheat, Zap } from 'lucide-react';
import { DIETARY_OPTIONS } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  selectedFilters, 
  onToggleFilter 
}) => {
  
  // Helper to get icon for dietary option
  const getIcon = (option: string) => {
    if (option.includes('素')) return <Leaf size={16} />;
    if (option.includes('生酮') || option.includes('低碳')) return <Zap size={16} />;
    if (option.includes('无麸质')) return <Wheat size={16} />;
    return <Check size={16} />;
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-slate-100 shadow-2xl lg:shadow-none z-40 transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto lg:border-r lg:block flex flex-col
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Filter className="mr-2" size={20} /> 筛选
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3 mb-10 mt-2 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <span className="font-bold text-lg">智</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-lg block leading-none">冰箱大厨</span>
              <span className="text-xs text-slate-400 font-medium">AI 烹饪助手</span>
            </div>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 px-2">
              饮食偏好设定
            </h3>
            <div className="space-y-3">
              {DIETARY_OPTIONS.map(option => {
                const isSelected = selectedFilters.includes(option);
                return (
                  <button 
                    key={option} 
                    onClick={() => onToggleFilter(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group border text-left
                      ${isSelected 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200' 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center">
                      <span className={`p-1.5 rounded-lg mr-3 ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                        {getIcon(option)}
                      </span>
                      <span className="font-semibold">{option}</span>
                    </div>
                    {isSelected && (
                       <div className="bg-white/20 rounded-full p-1">
                         <Check size={12} strokeWidth={3} />
                       </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto">
             <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-200/50 rounded-full blur-xl"></div>
                <h4 className="font-bold text-indigo-900 mb-2 text-sm">💡 每日小贴士</h4>
                <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                  拍摄时确保光线充足，尽量将不同种类的食材分开放置，以便 AI 更准确识别！
                </p>
             </div>
             <div className="text-center mt-6 text-[10px] text-slate-300 font-medium uppercase tracking-widest">
               v1.0.0 • Powered by Gemini
             </div>
          </div>
        </div>
      </div>
    </>
  );
};