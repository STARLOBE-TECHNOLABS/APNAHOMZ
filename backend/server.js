const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);

app.get('/', (req, res) => {
  res.send('FloorLite Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

