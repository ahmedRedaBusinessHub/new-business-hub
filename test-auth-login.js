const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Login Result:', data));
});

req.write(JSON.stringify({
  identifier: 'a-younus@aqdim.sa',
  password: '123' 
}));
req.end();
