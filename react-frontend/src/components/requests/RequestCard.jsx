// src/components/requests/RequestCard.jsx
import React from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function RequestCard({ request, showActions, onApprove, onReject, onReturn, loading }) {
  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{request.equipment_name}</h3>
          {request.user_name && (
            <p className="text-sm text-gray-600">Requested by: {request.user_name}</p>
          )}
          <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
          {request.reason && (
            <p className="text-sm text-gray-600 mt-1">Reason: {request.reason}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(request.status)}`}>
          {request.status.toUpperCase()}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>Requested: {new Date(request.request_date).toLocaleString()}</p>
        {request.approved_date && (
          <p>
            {request.status === 'approved' ? 'Approved' : 'Processed'} by {request.approved_by} on{' '}
            {new Date(request.approved_date).toLocaleString()}
          </p>
        )}
        {request.return_date && (
          <p>Returned: {new Date(request.return_date).toLocaleString()}</p>
        )}
      </div>
      {showActions && request.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(request.id)}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => onReject(request.id)}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
      {showActions && request.status === 'approved' && (
        <button
          onClick={() => onReturn(request.id)}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          Mark as Returned
        </button>
      )}
    </div>
  );
}