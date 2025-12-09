const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB setup: db file in same folder
const DBSOURCE = path.join(__dirname, 'facilities.db');
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      address TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      phone TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// GET all (with optional category filter)
app.get('/api/facilities', (req, res) => {
  const { category, q } = req.query;
  let sql = 'SELECT * FROM facilities';
  let params = [];
  if (category && q) {
    sql += ' WHERE category = ? AND (name LIKE ? OR address LIKE ?)';
    params = [category, `%${q}%`, `%${q}%`];
  } else if (category) {
    sql += ' WHERE category = ?';
    params = [category];
  } else if (q) {
    sql += ' WHERE (name LIKE ? OR address LIKE ? OR category LIKE ?)';
    params = [`%${q}%`, `%${q}%`, `%${q}%`];
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ data: rows });
  });
});

// GET by id
app.get('/api/facilities/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM facilities WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ data: row });
  });
});

// CREATE
app.post('/api/facilities', (req, res) => {
  const { name, category, address, latitude, longitude, phone, description } = req.body;
  const sql = `INSERT INTO facilities (name, category, address, latitude, longitude, phone, description)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, category, address, latitude, longitude, phone, description];
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ data: { id: this.lastID } });
  });
});

// UPDATE
app.put('/api/facilities/:id', (req, res) => {
  const id = req.params.id;
  const { name, category, address, latitude, longitude, phone, description } = req.body;
  const sql = `UPDATE facilities SET name=?, category=?, address=?, latitude=?, longitude=?, phone=?, description=? WHERE id=?`;
  const params = [name, category, address, latitude, longitude, phone, description, id];
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ data: { changes: this.changes } });
  });
});

// DELETE
app.delete('/api/facilities/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM facilities WHERE id = ?', id, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ data: { changes: this.changes } });
  });
});

// Health
app.get('/', (req, res) => {
  res.send('GIS Facility API running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
