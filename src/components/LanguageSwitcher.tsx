import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="text-amber-200" size={20} />
      <div className="flex gap-1">
        <button 
          onClick={() => changeLanguage('en')} 
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-amber-200 text-green-800' : 'text-amber-200 hover:bg-green-700'}`}
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('pt')} 
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === 'pt' ? 'bg-amber-200 text-green-800' : 'text-amber-200 hover:bg-green-700'}`}
        >
          PT
        </button>
        <button 
          onClick={() => changeLanguage('es')} 
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === 'es' ? 'bg-amber-200 text-green-800' : 'text-amber-200 hover:bg-green-700'}`}
        >
          ES
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;