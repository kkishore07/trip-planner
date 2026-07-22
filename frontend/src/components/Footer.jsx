import React from 'react';
import { Compass, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0b0f19]/50 py-8 mt-12 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Compass className="w-5 h-5 text-brand-500" />
          <span>© 2026 <strong>JourneyMate AI</strong>. Intelligent Travel Planning System. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for global travelers
          </span>
          <div className="flex space-x-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Github className="w-4 h-4 cursor-pointer hover:text-brand-500 transition-colors" />
            <Twitter className="w-4 h-4 cursor-pointer hover:text-brand-500 transition-colors" />
            <Linkedin className="w-4 h-4 cursor-pointer hover:text-brand-500 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
