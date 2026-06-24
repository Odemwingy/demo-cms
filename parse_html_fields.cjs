const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = path.join(__dirname, 'video静态网页和导入表格');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const allFields = new Set();
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const $ = cheerio.load(content);
  $('input, select, textarea').each((_, el) => {
    const name = $(el).attr('name');
    const id = $(el).attr('id');
    const label = $(`label[for="${id}"]`).text().trim() || $(el).closest('dl').find('dt').text().trim();
    if (name || id) {
      allFields.add(`${name || id} (${label || 'no label'})`);
    }
  });
}

console.log("All fields in HTML files:");
console.log(Array.from(allFields).sort().join('\n'));
