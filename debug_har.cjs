const fs = require('fs');
const path = require('path');

const harDir = 'MMA数据包';
const files = fs.readdirSync(harDir).filter(f => f.endsWith('.har'));

files.forEach(file => {
  const filepath = path.join(harDir, file);
  try {
    const har = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    har.log.entries.forEach(entry => {
      const url = entry.request.url;
      if (entry.response.content && entry.response.content.text) {
        if (url.includes('status-sheet')) {
          const text = entry.response.content.text;
          if (text.startsWith('{') || text.startsWith('[')) {
             try {
                const json = JSON.parse(text);
                console.log(`\nURL: ${url}`);
                console.log(`Keys:`, Object.keys(json));
                if (json.content) {
                  console.log(`Content keys:`, Object.keys(json.content));
                  if (json.content.data) {
                    console.log(`Data is array?`, Array.isArray(json.content.data));
                    if (Array.isArray(json.content.data) && json.content.data.length > 0) {
                      console.log(`Sample item id keys:`, Object.keys(json.content.data[0]));
                    }
                  }
                }
             } catch(e) {}
          }
        }
      }
    });
  } catch (e) {}
});
