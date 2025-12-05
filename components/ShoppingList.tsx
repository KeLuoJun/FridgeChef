import React from 'react';
import { ShoppingCart, Trash2, Check, ArrowRight } from 'lucide-react';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (item: string) => void;
  onClear: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onClear }) => {
  return (
    <div className="max-w-2xl mx-auto w-full p-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <div className="bg-emerald-100 p-2 rounded-xl mr-3 text-emerald-600">
            <ShoppingCart size={28} />
          </div>
          购物清单
        </h2>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
          >
            清空列表
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
           <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20"></div>
              <ShoppingCart size={48} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">您的清单是空的</h3>
           <p className="text-slate-400 max-w-xs mx-auto">
             去食谱页面看看，把缺少的食材一键添加到这里。
           </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div 
              key={`${item}-${index}`} 
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="flex items-center cursor-pointer select-none flex-1" 
                onClick={() => onRemoveItem(item)}
              >
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-4 flex items-center justify-center group-hover:border-emerald-400 transition-colors bg-slate-50">
                  <Check size={14} className="text-white opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 transition-opacity" strokeWidth={3} />
                </div>
                <span className="text-slate-700 font-bold text-lg group-hover:text-slate-900 transition-colors">{item}</span>
              </div>
              
              <button 
                onClick={() => onRemoveItem(item)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
             <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                {items.length} 个待购物品
             </p>
          </div>
        </div>
      )}
    </div>
  );
};