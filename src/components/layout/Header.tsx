import { Info } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  onNavigate: (page: 'home' | 'about') => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-dark-border sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/WhatsApp Image 2025-10-05 at 11.07.04_0e631f8c.jpg"
              alt="Rain-Sight Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900 dark:text-text-primary">Rain-Sight</h1>
              <p className="text-xs text-gray-600 dark:text-text-tertiary">From Space to Your Schedule</p>
            </div>
          </button>

          <nav className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-nasa-blue text-white shadow-glow-sm'
                  : 'text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'about'
                  ? 'bg-nasa-blue text-white shadow-glow-sm'
                  : 'text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </button>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
