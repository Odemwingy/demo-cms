const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('MMA静态页面/南航2025PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 11：45：04).html', 'utf8');
const $ = cheerio.load(content);

// Root nodes (Systems)
const roots = [];
$('.fancytree-container > li > span.fancytree-node > span.fancytree-title').each((i, el) => {
  roots.push($(el).text().trim());
});
console.log('Root nodes (Systems):', roots);

// Sub roots (just to see if we missed any)
const subRoots = [];
$('.fancytree-container > li > ul > li > span.fancytree-node > span.fancytree-title').each((i, el) => {
  subRoots.push($(el).text().trim());
});
console.log('Level 2 nodes:', subRoots);

// Top level context elements (Airline / Cycle)
console.log('Top Title/Breadcrumb:', $('.subtitle').text());
console.log('Title Tag:', $('title').text());

// Looking for user/airline/cycle selectors
const dropdowns = [];
$('.header select, .top select, select').each((i, el) => {
  dropdowns.push($(el).attr('id') || $(el).attr('name'));
});
console.log('Select dropdowns:', dropdowns);

// Look at the general page header to see where Airline and Cycle are specified
console.log('Header text:', $('.header').text().replace(/\s+/g, ' ').substring(0, 200));
