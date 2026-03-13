// simple script to write to a temp file, to be used in auth.config.ts
const fs = require('fs');
fs.writeFileSync('middleware.log', 'Log start\n');
