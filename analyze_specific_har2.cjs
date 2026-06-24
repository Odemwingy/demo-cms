const fs = require('fs');
const path = require('path');

const filename = 'MMA数据包/Main Menu-MUSI-AIRCASTS BY CGTN单曲数据.har';
try {
  const har = JSON.parse(fs.readFileSync(filename, 'utf8'));
  console.log(`\n=== All XHR/Fetch Requests in ${path.basename(filename)} ===`);
  
  har.log.entries.forEach(entry => {
    const url = entry.request.url;
    if (url.includes('api') || url.includes('mma/')) {
        if (url.includes('.css') || url.includes('.js') || url.includes('.png') || url.includes('.jpg')) return;
        console.log(url);
    }
  });
} catch (e) {
  console.log('Error:', e.message);
}
