// src/components/equipment/EquipmentCard.jsx
import React from 'react';
import { Edit } from 'lucide-react';

export default function EquipmentCard({ item, userRole, onEdit, onRequestBorrow }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
        {userRole === 'admin' && (
          <button
            onClick={() => onEdit(item)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Category:</span> {item.category}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Condition:</span> {item.condition}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-semibold">Available:</span> {item.available} / {item.quantity}
      </p>
      {item.available > 0 ? (
        <button
          onClick={() => onRequestBorrow(item.id)}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Request Borrow
        </button>
      ) : (
        <div className="w-full bg-gray-200 text-gray-600 py-2 rounded-lg text-center">
          Not Available
        </div>
      )}
    </div>
  );
}