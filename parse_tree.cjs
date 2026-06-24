const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('PAC Services - Metadata Management .html', 'utf8');
const $ = cheerio.load(content);

function parseList(ul, prefix = 'HU') {
  const result = [];
  $(ul).children('li').each((i, li) => {
    let title = $(li).find('> span.fancytree-node .fancytree-title').text().trim();
    if (!title) {
        title = $(li).clone().children().remove().end().text().trim();
    }
    title = title.replace(/\s*\(\d+\)$/, '');
    
    const node = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      code: prefix + '-' + i,
      status: 'normal',
      count: Math.floor(Math.random() * 50)
    };
    
    node.totalCount = node.count;

    const nestedUl = $(li).children('ul');
    if (nestedUl.length > 0) {
      node.children = parseList(nestedUl[0], node.code);
    }
    result.push(node);
  });
  return result;
}

const rootUl = $('.fancytree-container');
const treeData = parseList(rootUl);

fs.writeFileSync('category_tree.json', JSON.stringify(treeData, null, 2));

const tsxContent = fs.readFileSync('src/app/pages/CategoryTree.tsx', 'utf8');
const startTag = 'const TREE_DATA: TreeNodeData[] = ';
const endTag = '];';
const startIndex = tsxContent.indexOf(startTag);

if (startIndex !== -1) {
  let openBrackets = 0;
  let endIndex = -1;
  for (let i = startIndex + startTag.length - 1; i < tsxContent.length; i++) {
    if (tsxContent[i] === '[') openBrackets++;
    if (tsxContent[i] === ']') openBrackets--;
    if (openBrackets === 0) {
      endIndex = i + 1;
      break;
    }
  }
  
  if (endIndex !== -1) {
     const newTsx = tsxContent.slice(0, startIndex) + 'const TREE_DATA: TreeNodeData[] = ' + JSON.stringify(treeData, null, 2) + ';' + tsxContent.slice(endIndex + 1);
     fs.writeFileSync('src/app/pages/CategoryTree.tsx', newTsx);
     console.log('Successfully injected TREE_DATA into CategoryTree.tsx');
  }
}
