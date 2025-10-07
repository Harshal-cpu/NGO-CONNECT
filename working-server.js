const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User exists' });
  }
  
  const user = { id: Date.now(), name, email, password, role, phone };
  users.push(user);
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name, email, role } 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  
  res.json({ 
    success: true, 
    token: 'fake-token', 
    user: { id: user.id, name: user.name, email, role: user.role } 
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
