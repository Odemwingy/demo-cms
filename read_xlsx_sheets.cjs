const xlsx = require('xlsx');
const path = require('path');
const workbook = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125-metadata-v5.xlsx'));
console.log("Metadata xlsx Sheets:", workbook.SheetNames);
const workbook2 = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125_sds_v16.xlsm'));
console.log("SDS xlsm Sheets:", workbook2.SheetNames);
