const xlsx = require('xlsx');
const path = require('path');

const workbook = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125-metadata-v5.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log("Headers for metadata xlsx:", data[0] || []);

const workbook2 = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125_sds_v16.xlsm'));
const sheetName2 = workbook2.SheetNames[0];
const worksheet2 = workbook2.Sheets[sheetName2];
const data2 = xlsx.utils.sheet_to_json(worksheet2, { header: 1 });
console.log("Headers for sds xlsm (Row 1):", data2[0] || []);
console.log("Headers for sds xlsm (Row 2):", data2[1] || []);
console.log("Headers for sds xlsm (Row 3):", data2[2] || []);
