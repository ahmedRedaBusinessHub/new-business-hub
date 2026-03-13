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
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log("Login Res:", json);
    if (!json.access_token && !json.data?.access_token) return;
    const token = json.access_token || json.data.access_token;

    // Now fetch /auth/me
    const meOptions = {
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/auth/me',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
    http.request(meOptions, meRes => {
      let meData = '';
      meRes.on('data', c => meData += c);
      meRes.on('end', () => {
        console.log("Auth Me:", JSON.stringify(JSON.parse(meData), null, 2));
      });
    }).end();
  });
});

req.write(JSON.stringify({
  identifier: 'a-younus@aqdim.sa',
  password: 'Password123' // Or whatever default is used. Since I don't know it, I will skip if it fails.
}));
req.end();
