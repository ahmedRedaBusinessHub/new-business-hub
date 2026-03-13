const http = require('http');

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/callback/credentials',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

// I'd need a CSRF token to login through NextAuth via HTTP. That's too complicated to script.
