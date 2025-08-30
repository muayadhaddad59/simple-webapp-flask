// ultra-simple smoke test: start app locally and verify 200 OK
const http = require('http');

const req = http.get('http://localhost:3000', (res) => {
  if (res.statusCode === 200) {
    console.log("OK");
    process.exit(0);
  } else {
    console.error("Unexpected status:", res.statusCode);
    process.exit(1);
  }
});
req.on('error', (e) => { console.error(e); process.exit(1); });
setTimeout(() => { console.error("Timeout"); process.exit(1); }, 2000);
