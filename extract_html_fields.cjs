const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Parse all static HTML files to extract form fields, tabs, and labels
const dirs = ['MMA静态页面', 'MMA静态页面2'];
const results = {};

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 1. Find active tabs
    const tabs = [...doc.querySelectorAll('.tab_header a, .mma_tab_container a, ul.tabs-header a, li.tab a, .tab-header a, a.ui-tabs-anchor')]
      .map(el => el.textContent.trim())
      .filter(t => t.length > 0 && t.length < 50);

    // 2. Find all labels (form field names)
    const labels = [...doc.querySelectorAll('label, .field-label, td.label, th')]
      .map(el => el.textContent.trim())
      .filter(l => l.length > 1 && l.length < 60 && !l.includes('\n'));

    // 3. Find all select options
    const selects = {};
    doc.querySelectorAll('select').forEach(sel => {
      const name = sel.name || sel.id || 'unknown';
      selects[name] = [...sel.querySelectorAll('option')].map(o => o.textContent.trim()).filter(Boolean);
    });

    // 4. Find input names
    const inputs = [...doc.querySelectorAll('input[name], input[id]')]
      .map(i => i.name || i.id)
      .filter(Boolean);

    results[file] = { dir, tabs, labels: [...new Set(labels)], selects, inputs: [...new Set(inputs)] };
  }
}

fs.writeFileSync('extracted_html_fields.json', JSON.stringify(results, null, 2));
console.log('Extracted field data from', Object.keys(results).length, 'files');
console.log('Output saved to extracted_html_fields.json');
