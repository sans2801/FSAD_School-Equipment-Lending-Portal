// src/components/common/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}