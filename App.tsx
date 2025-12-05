import React, { useState } from 'react';
import { Menu, ShoppingBag, ArrowLeft, RefreshCw, ChefHat, Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ImageUpload } from './components/ImageUpload';
import { RecipeCard } from './components/RecipeCard';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { Recipe, ViewState, GeminiResponse } from './types';
import { analyzeFridgeAndGetRecipes } from './services/geminiService';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedMissingToShopMap, setAddedMissingToShopMap] = useState<Record<string, boolean>>({});

  const handleImageSelected = async (base64: string) => {
    setIsLoading(true);
    try {
      const data: GeminiResponse = await analyzeFridgeAndGetRecipes(base64, dietaryFilters);
      setRecipes(data.recipes);
      setIdentifiedIngredients(data.identifiedIngredients);
      setCurrentView('dashboard');
    } catch (error) {
      console.error(error);
      alert("分析图片失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setDietaryFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const addToShoppingList = (items: string[], recipeId: string) => {
    setShoppingList(prev => [...new Set([...prev, ...items])]); // Dedup
    setAddedMissingToShopMap(prev => ({...prev, [recipeId]: true}));
  };

  const removeFromShoppingList = (item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return (
          <ImageUpload 
            onImageSelected={handleImageSelected} 
            isLoading={isLoading} 
          />
        );
      case 'dashboard':
        return (
          <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
             <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-lg shadow-emerald-900/5">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                  <span className="bg-emerald-100 p-2 rounded-xl text-emerald-600 mr-3">
                    <Sparkles size={20} />
                  </span>
                  为您推荐的食谱
                </h1>
                <p className="text-slate-500 text-sm mt-2 ml-1">
                  识别到的食材：
                  <span className="text-slate-800 font-semibold">
                    {identifiedIngredients.join('、')}
                  </span>
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setRecipes([]); setIdentifiedIngredients([]); setCurrentView('upload'); }}
                icon={<RefreshCw size={16} />}
                className="bg-white hover:bg-slate-50 border-slate-200 rounded-xl"
              >
                重新扫描
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <div key={recipe.id} className="h-full">
                  <RecipeCard 
                    recipe={recipe} 
                    index={index}
                    onSelect={(r) => { setSelectedRecipe(r); setCurrentView('cooking'); }}
                    onAddMissing={(items) => addToShoppingList(items, recipe.id)}
                    isAdded={!!addedMissingToShopMap[recipe.id]}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'shopping':
        return (
          <ShoppingList 
            items={shoppingList} 
            onRemoveItem={removeFromShoppingList} 
            onClear={() => setShoppingList([])}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        selectedFilters={dietaryFilters}
        onToggleFilter={toggleFilter}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Navbar */}
        <header className="h-20 bg-transparent flex items-center justify-between px-6 z-20 pointer-events-none">
          <div className="flex items-center pointer-events-auto">
             {/* Mobile Sidebar Toggle */}
            <button 
              className="lg:hidden p-3 -ml-2 mr-2 text-slate-700 hover:bg-white/50 rounded-2xl transition-colors backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Back Button (only when not in upload) */}
            {currentView === 'shopping' && (
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mr-3 p-3 rounded-full bg-white/50 hover:bg-white text-slate-700 transition-all shadow-sm backdrop-blur-sm animate-fade-in"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <div className="flex items-center space-x-2 lg:hidden bg-white/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40">
               <ChefHat size={20} className="text-emerald-700" />
               <span className="font-bold text-slate-800">智能冰箱大厨</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button 
              onClick={() => setCurrentView(currentView === 'shopping' ? 'dashboard' : 'shopping')}
              className={`
                relative p-3 rounded-2xl transition-all duration-300 backdrop-blur-md border
                ${currentView === 'shopping' 
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-200' 
                  : 'bg-white/40 text-slate-700 border-white/50 hover:bg-white/60'}
              `}
            >
              <ShoppingBag size={24} />
              {shoppingList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-50 animate-scale-in">
                  {shoppingList.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth p-safe">
          {renderContent()}
        </main>

        {/* Cooking Mode Overlay */}
        {currentView === 'cooking' && selectedRecipe && (
          <CookingMode 
            recipe={selectedRecipe} 
            onClose={() => setCurrentView('dashboard')} 
          />
        )}
      </div>
    </div>
  );
};

export default App;