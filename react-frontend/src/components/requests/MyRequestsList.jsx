// src/components/requests/MyRequestsList.jsx
import React from 'react';
import RequestCard from './RequestCard';

export default function MyRequestsList({ requests }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Borrow Requests</h2>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No requests found
          </div>
        ) : (
          requests.map((request) => (
            <RequestCard key={request.id} request={request} showActions={false} />
          ))
        )}
      </div>
    </div>
  );
}