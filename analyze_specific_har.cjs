const fs = require('fs');
const path = require('path');

const filename = 'MMA数据包/Main Menu-MUSI-AIRCASTS BY CGTN单曲数据.har';
try {
  const har = JSON.parse(fs.readFileSync(filename, 'utf8'));
  let found = false;
  
  console.log(`\n=== Analyzing ${path.basename(filename)} ===`);
  
  har.log.entries.forEach(entry => {
    const url = entry.request.url;
    if (entry.response.content && entry.response.content.text) {
      if (url.includes('metadata') || url.includes('file-info') || url.includes('media') || url.includes('status')) {
        const text = entry.response.content.text;
        if (text.startsWith('{') || text.startsWith('[')) {
           try {
              const json = JSON.parse(text);
              console.log(`\n-> API Endpoint: ${url}`);
              
              // If it's the get-tags endpoint (detailed metadata)
              if (url.includes('get-tags') && json.content) {
                 found = true;
                 console.log("Found Detailed Metadata (get-tags):");
                 if (json.content.options) {
                    console.log(`- Genre/Category Options count: ${Object.keys(json.content.options).length}`);
                 }
                 if (json.content.values) {
                    console.log(`- Selected Values:`, json.content.values);
                 }
              }
              
              // If it's a list or detailed object
              if (json.data && !Array.isArray(json.data) && typeof json.data === 'object') {
                  if (json.data.rows && json.data.rows.length > 0) {
                     found = true;
                     console.log("Found Status Sheet Array. Keys of first item:");
                     console.log(Object.keys(json.data.rows[0]).join(', '));
                     console.log("\nSample Data (First item):");
                     console.log(JSON.stringify(json.data.rows[0], null, 2).substring(0, 800) + '...');
                  }
              }
           } catch(e) {}
        }
      }
    }
  });
  
  if (!found) {
     console.log("Did not find detailed JSON data in this HAR file.");
  }
} catch (e) {
  console.log('Error reading HAR:', e.message);
}
