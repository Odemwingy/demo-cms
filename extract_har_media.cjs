const fs = require('fs');
const path = require('path');

const harDir = 'MMA数据包';
const files = fs.readdirSync(harDir).filter(f => f.endsWith('.har'));

let allMedia = [];

files.forEach(file => {
  const filepath = path.join(harDir, file);
  try {
    const har = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    har.log.entries.forEach(entry => {
      const url = entry.request.url;
      if (entry.response.content && entry.response.content.text) {
        if (url.includes('status-sheet')) {
          const text = entry.response.content.text;
          if (text.startsWith('{')) {
             try {
                const json = JSON.parse(text);
                if (json.data && json.data.rows && Array.isArray(json.data.rows)) {
                   allMedia = allMedia.concat(json.data.rows);
                }
             } catch(e) {}
          }
        }
      }
    });
  } catch (e) {}
});

// Deduplicate by media ID
const uniqueMedia = [];
const seen = new Set();
allMedia.forEach(item => {
  const id = item.media_id || item.id || item.uid;
  if (id && !seen.has(id)) {
    seen.add(id);
    uniqueMedia.push(item);
  }
});

fs.writeFileSync('server/mma_data.json', JSON.stringify(uniqueMedia, null, 2));
console.log(`Extracted ${uniqueMedia.length} unique media items from HAR files.`);
if (uniqueMedia.length > 0) {
   console.log('Sample keys of first item:', Object.keys(uniqueMedia[0]).join(', '));
}
