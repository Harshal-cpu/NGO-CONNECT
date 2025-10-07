const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: Date.now(), name, email, password: hashedPassword, role, phone };
  users.push(user);
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, name, email, role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, name: user.name, email, role: user.role } });
});

app.listen(5000, () => console.log('Auth server running on port 5000'));
