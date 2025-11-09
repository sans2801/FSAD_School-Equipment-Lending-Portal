// src/App.jsx
import React, { useState, useEffect } from 'react';
import LoginForm from '../../frontend/src/components/auth/LoginForm';
import Header from '../../frontend/src/components/common/Header';
import Tabs from '../../frontend/src/components/common/Tabs';
import Alert from '../../frontend/src/components/common/Alert';
import EquipmentList from '../../frontend/src/components/equipment/EquipmentList';
import AddEquipmentForm from '../../frontend/src/components/equipment/AddEquipmentForm';
import EditEquipmentForm from '../../frontend/src/components/equipment/EditEquipmentForm';
import BorrowRequestForm from '../../frontend/src/components/requests/BorrowRequestForm';
import MyRequestsList from '../../frontend/src/components/requests/MyRequestsList';
import AllRequestsList from '../../frontend/src/components/requests/AllRequestsList';
import { authAPI, equipmentAPI, requestsAPI } from './services/api.js';
import { ROLES } from '../../frontend/src/utils/constants';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('equipment');
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEquipment, setEditingEquipment] = useState(null);

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      if (activeTab === 'equipment') fetchEquipment();
      else if (activeTab === 'requests') fetchAllRequests();
      else if (activeTab === 'myRequests') fetchMyRequests();
    }
  }, [user, activeTab]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const data = await equipmentAPI.getAll(token, searchTerm);
      if (data.equipment) setEquipment(data.equipment);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch equipment');
    }
    setLoading(false);
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsAPI.getAll(token);
      if (data.requests) setRequests(data.requests);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch requests');
    }
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsAPI.getMy(token);
      if (data.requests) setRequests(data.requests);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch your requests');
    }
    setLoading(false);
  };

  const handleLogin = async (username, password) => {
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showSuccess('Login successful!');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveTab('equipment');
  };

  const handleAddEquipment = async (equipmentData) => {
    setError('');
    setLoading(true);
    try {
      const data = await equipmentAPI.add(token, equipmentData);
      if (data.equipment) {
        showSuccess('Equipment added successfully!');
        fetchEquipment();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add equipment');
    }
    setLoading(false);
  };

  const handleUpdateEquipment = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await equipmentAPI.update(token, editingEquipment.id, editingEquipment);
      if (data.equipment) {
        showSuccess('Equipment updated successfully!');
        setEditingEquipment(null);
        fetchEquipment();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update equipment');
    }
    setLoading(false);
  };

  const handleBorrowRequest = async (requestData) => {
    setError('');
    setLoading(true);
    try {
      const data = await requestsAPI.create(token, requestData);
      if (data.request) {
        showSuccess('Request submitted successfully!');
        setActiveTab('equipment');
        fetchEquipment();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to submit request');
    }
    setLoading(false);
  };

  const handleApproveReject = async (requestId, action) => {
    setError('');
    setLoading(true);
    try {
      const data = await requestsAPI.approveReject(token, requestId, action);
      if (data.message) {
        showSuccess(data.message);
        fetchAllRequests();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to process request');
    }
    setLoading(false);
  };

  const handleReturn = async (requestId) => {
    setError('');
    setLoading(true);
    try {
      const data = await requestsAPI.markReturned(token, requestId);
      if (data.message) {
        showSuccess('Equipment returned successfully!');
        fetchAllRequests();
        fetchEquipment();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to return equipment');
    }
    setLoading(false);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const getTabs = () => {
    const tabs = [
      { id: 'equipment', label: 'Equipment' },
      { id: 'myRequests', label: 'My Requests' }
    ];
    
    if (user.role === ROLES.STAFF || user.role === ROLES.ADMIN) {
      tabs.push({ id: 'requests', label: 'All Requests' });
    }
    
    if (user.role === ROLES.ADMIN) {
      tabs.push({ id: 'addEquipment', label: 'Add Equipment' });
    }
    
    return tabs;
  };

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={loading}
        error={error}
        success={success}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      {error && (
        <div className="container mx-auto px-4 mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {success && (
        <div className="container mx-auto px-4 mt-4">
          <Alert type="success" message={success} />
        </div>
      )}

      <div className="container mx-auto px-4 mt-6">
        <Tabs tabs={getTabs()} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeTab === 'equipment' && (
          <div>
            {editingEquipment && (
              <EditEquipmentForm
                equipment={editingEquipment}
                onChange={setEditingEquipment}
                onSubmit={handleUpdateEquipment}
                onCancel={() => setEditingEquipment(null)}
                loading={loading}
              />
            )}
            <EquipmentList
              equipment={equipment}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={fetchEquipment}
              userRole={user.role}
              onEdit={setEditingEquipment}
              onRequestBorrow={(equipmentId) => {
                setActiveTab('borrow');
              }}
            />
          </div>
        )}

        {activeTab === 'addEquipment' && (
          <AddEquipmentForm onSubmit={handleAddEquipment} loading={loading} />
        )}

        {activeTab === 'borrow' && (
          <BorrowRequestForm
            equipment={equipment}
            onSubmit={handleBorrowRequest}
            onCancel={() => setActiveTab('equipment')}
            loading={loading}
          />
        )}

        {activeTab === 'myRequests' && <MyRequestsList requests={requests} />}

        {activeTab === 'requests' && (
          <AllRequestsList
            requests={requests}
            onApprove={(id) => handleApproveReject(id, 'approve')}
            onReject={(id) => handleApproveReject(id, 'reject')}
            onReturn={handleReturn}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}