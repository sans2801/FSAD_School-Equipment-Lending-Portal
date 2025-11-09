// src/components/equipment/AddEquipmentForm.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CONDITIONS } from '../../utils/constants';

export default function AddEquipmentForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: 'Good',
    quantity: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', category: '', condition: 'Good', quantity: 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add New Equipment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Equipment Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond}>{cond}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Adding...' : 'Add Equipment'}
        </button>
      </form>
    </div>
  );
}