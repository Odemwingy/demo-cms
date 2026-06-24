const fs = require('fs');
const cheerio = require('cheerio');

function extractFile(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf8');
    const $ = cheerio.load(content);
    console.log(`\n\n=== Text for ${filename} ===\n`);
    console.log($('body').text().replace(/\s+/g, ' ').substring(0, 2000));
  } catch (e) {
    console.log(`Failed to read ${filename}:`, e.message);
  }
}

extractFile('MMA静态页面/PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 12：04：54).html');
extractFile('MMA静态页面/PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 12：05：18).html');
