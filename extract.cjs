const fs = require('fs');
const cheerio = require('cheerio');
const files = fs.readdirSync('MMA静态页面').filter(f => f.endsWith('.html'));

let allData = [];

for (let file of files) {
  const content = fs.readFileSync('MMA静态页面/' + file, 'utf8');
  const $ = cheerio.load(content);
  
  const headers = new Set();
  $('th').each((i, el) => {
    const text = $(el).text().trim();
    if (text) headers.add(text);
  });
  
  const labels = new Set();
  $('label, .label, dt, .field-label').each((i, el) => {
    const text = $(el).text().trim();
    if (text) labels.add(text);
  });

  const rowData = [];
  $('table tbody tr').each((i, tr) => {
    const cells = $(tr).find('td').map((j, td) => $(td).text().trim()).get();
    if (cells.length > 0) rowData.push(cells);
  });

  if (headers.size > 0 || labels.size > 0) {
    allData.push({
      file,
      headers: [...headers],
      labels: [...labels],
      sampleRows: rowData.slice(0, 5)
    });
  }
}

fs.writeFileSync('extracted_mma_fields.json', JSON.stringify(allData, null, 2));
console.log('Extraction complete. Wrote to extracted_mma_fields.json');
