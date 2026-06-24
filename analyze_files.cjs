const fs = require('fs');
const cheerio = require('cheerio');

function analyzeImagesTab() {
  const file = 'MMA静态页面/PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 12：05：18).html';
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));

  console.log('--- Analyzing 12:05:18 (Images Tab) ---');
  
  const activeTabs = [];
  $('.nav-tabs li.active').each((i, el) => activeTabs.push($(el).text().trim()));
  console.log('Active Tab:', activeTabs.join(', '));
  
  console.log('Images in active tab-pane:');
  $('.tab-pane.active img, .tab-pane.active table, .tab-pane.active .row').each((i, el) => {
    if ($(el).is('img')) {
      console.log('  Image:', $(el).attr('src'), '| alt:', $(el).attr('alt'));
    } else if ($(el).is('table')) {
      console.log('  Table found.');
      $(el).find('tr').each((j, tr) => {
        console.log('    Row:', $(tr).text().replace(/\s+/g, ' ').substring(0, 100));
      });
    }
  });

  console.log('Looking for image requirement lists or upload buttons:');
  $('.tab-pane.active .btn, .tab-pane.active a').each((i, el) => {
    console.log('  Action/Link:', $(el).text().trim());
  });
}

function analyzeFlightScript() {
  const file = 'MMA静态页面/PAC Services - Metadata Management (MMA) - CZ0725 (2026_6_23 12：04：54).html';
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));

  console.log('\n--- Analyzing 12:04:54 (FlightScript Dashboard) ---');
  
  // Let's see the selected category tree node
  const activeNode = $('.fancytree-node.fancytree-active .fancytree-title').text();
  console.log('Active Category Node:', activeNode);

  // Let's look at the table headers
  const headers = [];
  $('.dataTable th').each((i, el) => headers.push($(el).text().trim()));
  console.log('Table Headers:', headers.join(', '));
}

analyzeImagesTab();
analyzeFlightScript();
