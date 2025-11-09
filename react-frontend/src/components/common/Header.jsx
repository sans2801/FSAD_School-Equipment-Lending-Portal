// src/components/common/Header.jsx
import React from 'react';
import { Package, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <div className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">School Equipment Platform</h1>
              <p className="text-indigo-200 text-sm">
                Welcome, {user.name} ({user.role})
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}