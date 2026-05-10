const http = require('http');

http.get('http://localhost:5001/api/direct-test', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`BODY: ${data}`);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
