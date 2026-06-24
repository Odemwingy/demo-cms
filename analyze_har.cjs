const fs = require('fs');

function analyzeHar(filename) {
  try {
    const raw = fs.readFileSync(filename, 'utf8');
    const har = JSON.parse(raw);
    const entries = har.log.entries;
    
    console.log(`\n=== Analysis of ${filename} ===`);
    const endpoints = new Set();
    
    entries.forEach(entry => {
      const url = entry.request.url;
      // only care about API calls to nextcloud.aero/mma/ or similar json responses
      if (entry.response.content && entry.response.content.mimeType && entry.response.content.mimeType.includes('application/json')) {
        endpoints.add(url);
        if (url.includes('api') || url.includes('json') || url.includes('mma/')) {
           console.log(`\nURL: ${url}`);
           if (entry.response.content.text) {
             console.log(`Sample Response (${entry.response.content.text.length} chars):`, entry.response.content.text.substring(0, 500));
           }
        }
      }
    });
    
  } catch (e) {
    console.log('Error parsing HAR:', e.message);
  }
}

analyzeHar('MMA数据包/home.har');
analyzeHar('MMA数据包/Video Broadcast.har');
