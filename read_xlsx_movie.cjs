const xlsx = require('xlsx');
const path = require('path');

const workbook = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125-metadata-v5.xlsx'));
const worksheet = workbook.Sheets['Movie'];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log("Metadata xlsx Movie Sheet (Row 1):", data[0] || []);
console.log("Metadata xlsx Movie Sheet (Row 2):", data[1] || []);

const workbook2 = xlsx.readFile(path.join(__dirname, 'video静态网页和导入表格/ca0125_sds_v16.xlsm'));
const worksheet2 = workbook2.Sheets['Movie'];
const data2 = xlsx.utils.sheet_to_json(worksheet2, { header: 1 });
console.log("\nSDS xlsm Movie Sheet (Row 1):", data2[0] || []);
console.log("SDS xlsm Movie Sheet (Row 2):", data2[1] || []);
console.log("SDS xlsm Movie Sheet (Row 3):", data2[2] || []);
