// src/components/equipment/EquipmentList.jsx
import React from 'react';
import EquipmentCard from './EquipmentCard';
import SearchBar from '../common/SearchBar';

export default function EquipmentList({ 
  equipment, 
  searchTerm, 
  onSearchChange, 
  onSearch, 
  userRole, 
  onEdit, 
  onRequestBorrow 
}) {
  return (
    <div>
      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Search equipment..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            userRole={userRole}
            onEdit={onEdit}
            onRequestBorrow={onRequestBorrow}
          />
        ))}
      </div>
    </div>
  );
}