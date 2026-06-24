const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const docsDir = '松下MMA介绍说明静态页面';
const files = ['Single Database Model (2026_6_23 13：50：08).html', 'Understanding Versioning (2026_6_23 13：55：39).html', 'Add Media to VLS or LCS (2026_6_23 13：51：15).html', 'Export Cycle (2026_6_23 14：01：38).html'];

files.forEach(file => {
  const filepath = path.join(docsDir, file);
  try {
    const html = fs.readFileSync(filepath, 'utf8');
    const $ = cheerio.load(html);
    $('script, style, link').remove();
    const text = $('body').text().replace(/\s+/g, ' ').substring(0, 1500).trim();
    console.log(`\n=== DOC: ${file} ===`);
    console.log(text);
  } catch (e) {
    console.log(`Error reading ${file}`);
  }
});
