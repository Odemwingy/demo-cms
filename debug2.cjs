const fs = require('fs');
const path = require('path');

const harDir = 'MMA数据包';
const files = fs.readdirSync(harDir).filter(f => f.endsWith('.har'));

let count = 0;
files.forEach(file => {
  const filepath = path.join(harDir, file);
  try {
    const har = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    har.log.entries.forEach(entry => {
      const url = entry.request.url;
      if (entry.response.content && entry.response.content.text && url.includes('status-sheet')) {
        const text = entry.response.content.text;
        if (text.startsWith('{')) {
           try {
              const json = JSON.parse(text);
              if (count < 1 && json.data) {
                 console.log(`URL: ${url}`);
                 console.log(`typeof json.data:`, typeof json.data);
                 if (typeof json.data === 'object' && !Array.isArray(json.data)) {
                    console.log('Keys of json.data:', Object.keys(json.data));
                    if (json.data.data) {
                       console.log('json.data.data is array?', Array.isArray(json.data.data));
                       if (Array.isArray(json.data.data) && json.data.data.length > 0) {
                          console.log('Sample item:', Object.keys(json.data.data[0]));
                       }
                    }
                 }
                 count++;
              }
           } catch(e) {}
        }
      }
    });
  } catch (e) {}
});
