// src/components/equipment/EditEquipmentForm.jsx
import React from 'react';
import { CONDITIONS } from '../../utils/constants';

export default function EditEquipmentForm({ equipment, onChange, onSubmit, onCancel, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Edit Equipment</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={equipment.name}
            onChange={(e) => onChange({ ...equipment, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <input
            type="text"
            value={equipment.category}
            onChange={(e) => onChange({ ...equipment, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Condition</label>
          <select
            value={equipment.condition}
            onChange={(e) => onChange({ ...equipment, condition: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
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
            value={equipment.quantity}
            onChange={(e) => onChange({ ...equipment, quantity: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            min="1"
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}