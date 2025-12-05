import React from 'react';
import { Clock, Flame, ChefHat, AlertCircle, Check, ArrowRight, Tag } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onAddMissing: (ingredients: string[]) => void;
  isAdded: boolean;
  index?: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onAddMissing, isAdded, index = 0 }) => {
  
  // Dynamic gradient based on difficulty or random hash could be cool, 
  // but let's stick to difficulty for semantic meaning.
  const getHeaderStyle = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'from-emerald-400 to-teal-500';
      case 'medium': return 'from-orange-400 to-amber-500';
      case 'hard': return 'from-rose-400 to-red-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return diff;
    }
  };

  return (
    <div 
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-300 group animate-slide-up h-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative Header */}
      <div className={`h-24 bg-gradient-to-r ${getHeaderStyle(recipe.difficulty)} relative overflow-hidden p-6 flex items-start justify-between`}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black opacity-5 rounded-full blur-xl"></div>
        
        <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 shadow-sm">
          {getDifficultyLabel(recipe.difficulty)}
        </div>
      </div>

      <div className="p-6 pt-0 flex-1 flex flex-col relative">
        {/* Main Content pushed up into header */}
        <div className="-mt-12 mb-4 bg-white rounded-2xl p-4 shadow-lg border border-slate-50/50">
           <div className="flex items-center justify-between mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center"><Clock size={12} className="mr-1" /> {recipe.prepTime}</span>
              <span className="flex items-center text-orange-400"><Flame size={12} className="mr-1" /> {recipe.calories} kcal</span>
           </div>
           <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
            {recipe.title}
           </h3>
        </div>

        <p className="text-slate-500 text-sm mb-5 leading-relaxed flex-1">
          {recipe.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Tag size={10} className="mr-1 opacity-50" /> {tag}
            </span>
          ))}
        </div>

        {/* Missing Ingredients Section */}
        {recipe.missingIngredients.length > 0 && (
          <div className="mb-6 bg-orange-50 rounded-xl p-4 border border-orange-100/50 relative overflow-hidden group/missing">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-full blur-xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover/missing:opacity-100"></div>
            
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center text-orange-800 text-xs font-bold uppercase tracking-wider">
                <AlertCircle size={12} className="mr-1.5" /> 缺少食材
              </div>
            </div>
            
            <div className="text-slate-700 text-sm font-medium mb-3 relative z-10 truncate">
              {recipe.missingIngredients.join('、')}
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onAddMissing(recipe.missingIngredients); }}
              disabled={isAdded}
              className={`
                w-full py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center relative z-10
                ${isAdded 
                  ? 'bg-green-100 text-green-700 cursor-default' 
                  : 'bg-white text-orange-600 shadow-sm hover:shadow hover:bg-orange-50 border border-orange-100'}
              `}
            >
              {isAdded ? (
                <><Check size={14} className="mr-1.5"/> 已加入清单</>
              ) : (
                "+ 一键购买"
              )}
            </button>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={() => onSelect(recipe)}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center group/btn hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-200"
        >
          <ChefHat size={18} className="mr-2" />
          开始烹饪
          <ArrowRight size={16} className="ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
        </button>
      </div>
    </div>
  );
};