// src/components/common/Alert.jsx
import React from 'react';

export default function Alert({ type, message, onClose }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700'
  };

  return (
    <div className={`border px-4 py-3 rounded-lg ${styles[type]}`}>
      {message}
    </div>
  );
}