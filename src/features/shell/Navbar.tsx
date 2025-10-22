/**
 * Navbar - شريط التنقل العلوي
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from './useTheme';
import { navItems } from './nav.config';
import type { Language } from './types';

interface NavbarProps {
  brand?: string;
  lang?: Language;
  onLangChange?: (lang: Language) => void;
  currentPath?: string;
}

export default function Navbar({ 
  brand = 'AgriAI', 
  lang = 'ar',
  onLangChange,
  currentPath = '/'
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const { theme, toggleTheme } = useTheme();

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تحديث التبويب النشط
  useEffect(() => {
    const activeIndex = navItems.findIndex(item => {
      if (item.exact) {
        return item.href === currentPath;
      }
      return currentPath.startsWith(item.href);
    });

    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [currentPath]);

  // حساب موقع الخط السفلي
  useEffect(() => {
    const updateUnderline = () => {
      const tabElement = document.querySelector(`[data-tab-index="${activeTab}"]`);
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement as HTMLElement;
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab]);

  // تبديل اللغة
  const handleLangToggle = () => {
    const newLang: Language = lang === 'ar' ? 'en' : 'ar';
    onLangChange?.(newLang);
    
    // تحديث اتجاه الصفحة
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          handleLangToggle();
        } else if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          toggleTheme();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lang, theme]);

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md shadow-lg border-b border-white/10 dark:border-white/5'
          : 'bg-transparent'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10E5C1]/20 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-[#10E5C1] to-[#0fd0b0] p-2.5 rounded-xl shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#10E5C1] to-[#0fd0b0] bg-clip-text text-transparent">
              {brand}
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                data-tab-index={index}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === index
                    ? 'text-[#10E5C1]'
                    : 'text-gray-600 dark:text-slate-300 hover:text-[#10E5C1] hover:bg-white/5 dark:hover:bg-white/5'
                }`}
                aria-current={activeTab === index ? 'page' : undefined}
              >
                {lang === 'ar' ? item.title : item.titleEn || item.title}
              </a>
            ))}

            {/* Active Tab Underline */}
            <AnimatePresence>
              <motion.div
                key={activeTab}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: underlineStyle.width, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 h-0.5 bg-[#10E5C1] rounded-full"
                style={{
                  left: underlineStyle.left,
                  boxShadow: '0 0 12px rgba(16, 229, 193, 0.7)'
                }}
              />
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={handleLangToggle}
              className="relative p-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10E5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label={`Switch to ${lang === 'ar' ? 'English' : 'العربية'}`}
              title={`Switch Language (Ctrl+L)`}
            >
              <Languages className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10E5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Toggle Theme (Ctrl+T)`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

