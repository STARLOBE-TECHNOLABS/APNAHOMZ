const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authenticateToken = require('../middleware/authMiddleware');

// Get all plans for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const sql = `SELECT * FROM plans WHERE user_id = ? ORDER BY updated_at DESC`;
    const [rows] = await db.query(sql, [userId]);
    
    // Parse the data field back to JSON
    const plans = rows.map(plan => ({
      ...plan,
      data: (typeof plan.data === 'string') ? JSON.parse(plan.data) : plan.data
    }));
    
    res.json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ message: 'Error fetching plans' });
  }
});

// Get a single plan by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const planId = req.params.id;
  
  try {
    const sql = `SELECT * FROM plans WHERE id = ? AND user_id = ?`;
    const [rows] = await db.query(sql, [planId, userId]);
    const row = rows[0];
    
    if (!row) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json({
      ...row,
      data: (typeof row.data === 'string') ? JSON.parse(row.data) : row.data
    });
  } catch (err) {
    console.error('Error fetching plan:', err);
    res.status(500).json({ message: 'Error fetching plan' });
  }
});

// Create a new plan
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id, name, data } = req.body;
  
  if (!id || !name || !data) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const sql = `INSERT INTO plans (id, user_id, name, data, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    const dataString = JSON.stringify(data);
    
    await db.query(sql, [id, userId, name, dataString]);
    
    res.status(201).json({ message: 'Plan saved successfully', id });
  } catch (err) {
    console.error('Error creating plan:', err);
    res.status(500).json({ message: 'Error saving plan' });
  }
});

// Update a plan
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const planId = req.params.id;
  const { name, data } = req.body;
  
  if (!name || !data) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const sql = `UPDATE plans SET name = ?, data = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`;
    const dataString = JSON.stringify(data);
    
    const [result] = await db.query(sql, [name, dataString, planId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Plan not found or unauthorized' });
    }
    
    res.json({ message: 'Plan updated successfully' });
  } catch (err) {
    console.error('Error updating plan:', err);
    res.status(500).json({ message: 'Error updating plan' });
  }
});

// Delete a plan
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const planId = req.params.id;

  try {
    const sql = `DELETE FROM plans WHERE id = ? AND user_id = ?`;
    const [result] = await db.query(sql, [planId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Plan not found or unauthorized' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting plan:', err);
    res.status(500).json({ message: 'Error deleting plan' });
  }
});

module.exports = router;
