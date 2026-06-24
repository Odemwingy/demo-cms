const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('MMA静态页面/南航2025PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 11：45：04).html', 'utf8');
const $ = cheerio.load(content);
const tree = [];
$('.fancytree-title').each((i, el) => {
  tree.push($(el).text().trim());
});
console.log('Tree nodes:', tree.slice(0, 50));
