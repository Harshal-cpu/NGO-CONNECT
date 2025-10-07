const { spawn } = require('child_process');
const path = require('path');

console.log('Starting backend server...');

const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});
