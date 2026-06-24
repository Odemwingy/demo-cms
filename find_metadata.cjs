const fs = require('fs');
const path = require('path');

const harDir = 'MMA数据包';
const files = fs.readdirSync(harDir).filter(f => f.endsWith('.har'));

const metadataUrls = new Set();
let sampleMetadata = null;

files.forEach(file => {
  const filepath = path.join(harDir, file);
  try {
    const har = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    har.log.entries.forEach(entry => {
      const url = entry.request.url;
      if (entry.response.content && entry.response.content.text) {
        // Look for endpoints fetching single media data
        if (url.includes('metadata') || url.includes('media') || url.includes('file-info')) {
          if (url.includes('status-sheet') || url.includes('.css') || url.includes('.js')) return;
          const text = entry.response.content.text;
          if (text.startsWith('{')) {
             metadataUrls.add(url);
             if (!sampleMetadata && text.length > 500 && text.includes('title')) {
                sampleMetadata = JSON.parse(text);
                console.log(`\nFound detailed metadata in ${file}: ${url}`);
             }
          }
        }
      }
    });
  } catch (e) {}
});

console.log(`\nFound ${metadataUrls.size} metadata endpoints. Sample URLs:`);
Array.from(metadataUrls).slice(0, 5).forEach(u => console.log(u));

if (sampleMetadata) {
  console.log('\nSample keys of detailed metadata:', Object.keys(sampleMetadata));
  if (sampleMetadata.data) console.log('data keys:', Object.keys(sampleMetadata.data));
  if (sampleMetadata.content) console.log('content keys:', Object.keys(sampleMetadata.content));
}
