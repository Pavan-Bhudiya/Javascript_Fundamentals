// server.js
// ----------------------
// ✅ Express API App - Week 2 Task
// ----------------------
// Features:
// - GET / → responds "My week 2 API"
// - POST /user → accepts {name, email}, responds "Hello, [name]!"
// - GET /user/:id → responds "User [id] profile"
// - Handles 400 for missing data
// - JSON parsing
// - Custom middleware logs requests
// - Serves static HTML page at /
// - Uses .env for PORT
// - Example curl commands included below
// ----------------------

const express=require('express');
const dotenv= require('dotenv');
const path=require('path');
dotenv.config(); 
const app = express();
const PORT = process.env.PORT;

// ----------------------
// MIDDLEWARES
// ----------------------

// JSON parsing
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static HTML page (index.html inside /public folder)

app.use(express.static(path.join(__dirname, "public")));
app.get ('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
})

// ----------------------
// ROUTES
// ----------------------

// GET /
app.get("/", (req, res) => {
  res.send("My week 2 API");
});

// POST /user
app.post("/user", (req, res) => {
  const { name, email } = req.body;

  // If missing data → return 400
  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  res.json({ message: `Hello, ${name}!` });
});

// GET /user/:id
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  res.send(`User ${id} profile`);
});

// ----------------------
// ERROR HANDLING
// ----------------------

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// ----------------------
// TEST COMMANDS (run in terminal)
// ----------------------
/*
curl http://localhost:3000/
# → My week 2 API

curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
# → {"message":"Hello, Alice!"}

curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
# → {"error":"Missing name or email"} (400 Bad Request)

curl http://localhost:3000/user/123
# → User 123 profile
*/
// ----------------------