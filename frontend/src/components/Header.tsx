import React from 'react';
import { Theme, User } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, user, onLogin }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-parchment-100/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-parchment-300 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 rounded-xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden bg-white dark:bg-navy-800 border border-parchment-200 dark:border-slate-700">
            <img 
              src="/logo_GRA.jpeg" 
              alt="GRA Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = "w-10 h-10 bg-navy-900 dark:bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110";
                  parent.innerHTML = 'G';
                }
              }}
            />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-navy-900 dark:text-white">GRA</span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-navy-900 text-white dark:bg-emerald-600 rounded-full">v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-parchment-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-parchment-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-parchment-300 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-navy-900 dark:text-slate-100">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                {user.name.charAt(0)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;