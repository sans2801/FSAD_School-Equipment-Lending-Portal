// src/components/requests/BorrowRequestForm.jsx
import React, { useState } from 'react';

export default function BorrowRequestForm({ equipment, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    equipmentId: '',
    quantity: 1,
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Request Equipment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Equipment</label>
          <select
            value={formData.equipmentId}
            onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select equipment...</option>
            {equipment.filter(e => e.available > 0).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Available: {item.available})
              </option>
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
        <div>
          <label className="block text-sm font-semibold mb-2">Reason (Optional)</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}