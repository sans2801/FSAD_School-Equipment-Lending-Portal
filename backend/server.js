const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const prepareDb = require('./DbOperations')
const app = express();
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./school_equipment.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL
    )`);

    // Equipment table
    db.run(`CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      condition TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      available INTEGER NOT NULL
    )`);

    // Requests table
    db.run(`CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      reason TEXT,
      status TEXT NOT NULL,
      request_date TEXT NOT NULL,
      approved_by TEXT,
      approved_date TEXT,
      return_date TEXT,
      FOREIGN KEY (equipment_id) REFERENCES equipment(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Insert default users if not exists
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)');
        stmt.run('admin', 'admin123', 'admin', 'Admin User');
        stmt.run('staff1', 'staff123', 'staff', 'Lab Assistant');
        stmt.run('student1', 'student123', 'student', 'John Doe');
        stmt.finalize();
        console.log('Default users created');
      }
    });

    // Insert default equipment if not exists
    db.get('SELECT COUNT(*) as count FROM equipment', (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare('INSERT INTO equipment (name, category, condition, quantity, available) VALUES (?, ?, ?, ?, ?)');
        stmt.run('Microscope', 'Lab Equipment', 'Good', 5, 5);
        stmt.run('Calculator', 'Math Tools', 'Excellent', 20, 20);
        stmt.run('Projector', 'Electronics', 'Good', 3, 3);
        stmt.finalize();
        console.log('Default equipment created');
      }
    });
  });
  }
});

// Simulated sessions (token storage)
let sessions = {};

// Middleware: Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  req.user = sessions[token];
  next();
};

// Middleware: Role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

// ENDPOINT 1: User Login (POST /api/auth/login)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = `token_${Date.now()}_${Math.random()}`;
    sessions[token] = { id: user.id, username: user.username, role: user.role, name: user.name };
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, username: user.username, role: user.role, name: user.name }
    });
  });
});

// ENDPOINT 2: Get All Equipment (GET /api/equipment)
app.get('/api/equipment', authenticate, (req, res) => {
  const { search, category, available } = req.query;
  
  let query = 'SELECT * FROM equipment WHERE 1=1';
  let params = [];
  
  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (available === 'true') {
    query += ' AND available > 0';
  }
  
  db.all(query, params, (err, equipment) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ equipment });
  });
});

// ENDPOINT 3: Add Equipment (POST /api/equipment) - Admin only
app.post('/api/equipment', authenticate, authorize('admin'), (req, res) => {
  const { name, category, condition, quantity } = req.body;
  
  if (!name || !category || !condition || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const qty = parseInt(quantity);
  
  db.run(
    'INSERT INTO equipment (name, category, condition, quantity, available) VALUES (?, ?, ?, ?, ?)',
    [name, category, condition, qty, qty],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      db.get('SELECT * FROM equipment WHERE id = ?', [this.lastID], (err, equipment) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Equipment added successfully', equipment });
      });
    }
  );
});

// ENDPOINT 4: Update Equipment (PUT /api/equipment/:id) - Admin only
app.put('/api/equipment/:id', authenticate, authorize('admin'), (req, res) => {
  const equipmentId = parseInt(req.params.id);
  const { name, category, condition, quantity } = req.body;
  
  db.get('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    const borrowed = item.quantity - item.available;
    
    const updates = [];
    const params = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (category) {
      updates.push('category = ?');
      params.push(category);
    }
    if (condition) {
      updates.push('condition = ?');
      params.push(condition);
    }
    if (quantity !== undefined) {
      const newQty = parseInt(quantity);
      if (newQty < borrowed) {
        return res.status(400).json({ error: `Cannot reduce quantity below borrowed items (${borrowed})` });
      }
      updates.push('quantity = ?');
      updates.push('available = ?');
      params.push(newQty);
      params.push(newQty - borrowed);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(equipmentId);
    
    db.run(
      `UPDATE equipment SET ${updates.join(', ')} WHERE id = ?`,
      params,
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        db.get('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, equipment) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Equipment updated successfully', equipment });
        });
      }
    );
  });
});

// ENDPOINT 5: Create Borrow Request (POST /api/requests)
app.post('/api/requests', authenticate, (req, res) => {
  const { equipmentId, quantity, reason } = req.body;
  
  if (!equipmentId || !quantity) {
    return res.status(400).json({ error: 'Equipment ID and quantity are required' });
  }
  
  const qty = parseInt(quantity);
  
  db.get('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    if (item.available < qty) {
      return res.status(400).json({ error: `Not enough available. Only ${item.available} available.` });
    }
    
    const requestDate = new Date().toISOString();
    
    db.run(
      `INSERT INTO requests (equipment_id, equipment_name, user_id, user_name, quantity, reason, status, request_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.name, req.user.id, req.user.name, qty, reason || '', 'pending', requestDate],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        db.get('SELECT * FROM requests WHERE id = ?', [this.lastID], (err, request) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json({ message: 'Request submitted successfully', request });
        });
      }
    );
  });
});

// ENDPOINT 6: Approve/Reject Request (PUT /api/requests/:id) - Staff/Admin only
app.put('/api/requests/:id', authenticate, authorize('staff', 'admin'), (req, res) => {
  const requestId = parseInt(req.params.id);
  const { action } = req.body;
  
  db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: `Request already ${request.status}` });
    }
    
    const approvedDate = new Date().toISOString();
    
    if (action === 'approve') {
      db.get('SELECT * FROM equipment WHERE id = ?', [request.equipment_id], (err, item) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (item.available < request.quantity) {
          return res.status(400).json({ error: 'Equipment no longer available in requested quantity' });
        }
        
        db.run('UPDATE equipment SET available = available - ? WHERE id = ?', [request.quantity, item.id], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          db.run(
            'UPDATE requests SET status = ?, approved_by = ?, approved_date = ? WHERE id = ?',
            ['approved', req.user.name, approvedDate, requestId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }
              
              db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, updatedRequest) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                res.json({ message: 'Request approved successfully', request: updatedRequest });
              });
            }
          );
        });
      });
    } else if (action === 'reject') {
      db.run(
        'UPDATE requests SET status = ?, approved_by = ?, approved_date = ? WHERE id = ?',
        ['rejected', req.user.name, approvedDate, requestId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, updatedRequest) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Request rejected', request: updatedRequest });
          });
        }
      );
    } else {
      res.status(400).json({ error: 'Invalid action. Use "approve" or "reject"' });
    }
  });
});

// ENDPOINT 7: Return Equipment (PUT /api/requests/:id/return) - Staff/Admin only
app.put('/api/requests/:id/return', authenticate, authorize('staff', 'admin'), (req, res) => {
  const requestId = parseInt(req.params.id);
  
  db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved requests can be returned' });
    }
    
    const returnDate = new Date().toISOString();
    
    db.run('UPDATE equipment SET available = available + ? WHERE id = ?', [request.quantity, request.equipment_id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      db.run(
        'UPDATE requests SET status = ?, return_date = ? WHERE id = ?',
        ['returned', returnDate, requestId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, updatedRequest) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Equipment returned successfully', request: updatedRequest });
          });
        }
      );
    });
  });
});

// BONUS: Get User's Requests (GET /api/requests/my)
app.get('/api/requests/my', authenticate, (req, res) => {
  db.all('SELECT * FROM requests WHERE user_id = ? ORDER BY request_date DESC', [req.user.id], (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ requests });
  });
});

// BONUS: Get All Requests (GET /api/requests) - Staff/Admin only
app.get('/api/requests', authenticate, authorize('staff', 'admin'), (req, res) => {
  const { status } = req.query;
  
  let query = 'SELECT * FROM requests WHERE 1=1';
  let params = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY request_date DESC';
  
  db.all(query, params, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ requests });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`School Equipment Lending API running on http://localhost:${PORT}`);
  console.log('\nTest credentials:');
  console.log('Admin: username=admin, password=admin123');
  console.log('Staff: username=staff1, password=staff123');
  console.log('Student: username=student1, password=student123');
  console.log('\nDatabase: school_equipment.db');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  });
});