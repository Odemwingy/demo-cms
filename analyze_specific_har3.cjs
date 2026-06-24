const fs = require('fs');
const path = require('path');

const filename = 'MMA数据包/Main Menu-MUSI-AIRCASTS BY CGTN单曲数据.har';
try {
  const har = JSON.parse(fs.readFileSync(filename, 'utf8'));
  console.log(`\n=== Detailed Endpoints in ${path.basename(filename)} ===`);
  
  const targetUrls = [
    'get-metadata-view',
    'get-other-info',
    'qcdata'
  ];
  
  har.log.entries.forEach(entry => {
    const url = entry.request.url;
    if (targetUrls.some(t => url.includes(t)) && entry.response.content && entry.response.content.text) {
        console.log(`\n-> ${url}`);
        const text = entry.response.content.text;
        if (text.startsWith('{') || text.startsWith('[')) {
           try {
              const json = JSON.parse(text);
              console.log(JSON.stringify(json, null, 2).substring(0, 1000));
           } catch(e) {
              console.log('Error parsing JSON');
           }
        } else {
           console.log('Response is not JSON, might be HTML? First 200 chars:');
           console.log(text.substring(0, 200));
        }
    }
  });
} catch (e) {
  console.log('Error:', e.message);
}
