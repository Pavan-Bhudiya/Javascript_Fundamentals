require("dotenv").config();
const express = require('express');
const noteRoutes = require('./routes/notes');
const path = require('path');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Routes
app.use('/api/notes', noteRoutes);

// Basic route - now serves the frontend from public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404 errors


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Note-Taking API is ready!`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;