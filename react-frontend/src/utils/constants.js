// src/utils/constants.js
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned'
};

export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

export const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'staff1', password: 'staff123', role: 'Staff' },
  { username: 'student1', password: 'student123', role: 'Student' }
];