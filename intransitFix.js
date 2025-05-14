const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// File paths
const inputFile = path.join(__dirname, 'WithShippedQty.csv');
const outputFile = path.join(__dirname, 'update.xml');

// XML header
let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?><tXML>\n';

// Read and parse CSV
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    const columns = Object.values(row);

    if (columns.length >= 3) {
      const orderNumber = columns[1]; // second column
      const sku = columns[2];         // third column

      xmlOutput += `  <order>\n`;
      xmlOutput += `    <orderNumber>${orderNumber}</orderNumber>\n`;
      xmlOutput += `    <commerceItems>\n`;
      xmlOutput += `      <item>\n`;
      xmlOutput += `        <sku>${sku}</sku>\n`;
      xmlOutput += `        <shippedQty>1.00</shippedQty>\n`;
      xmlOutput += `      </item>\n`;
      xmlOutput += `    </commerceItems>\n`;
      xmlOutput += `  </order>\n`;
    }
  })
  .on('end', () => {
    xmlOutput += '</tXML>\n';

    fs.writeFile(outputFile, xmlOutput, (err) => {
      if (err) {
        console.error('Error writing XML file:', err);
      } else {
        console.log('XML file written successfully to', outputFile);
      }
    });
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });
