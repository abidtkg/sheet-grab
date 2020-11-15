const { csvFormat, csvParseRows } = require('d3-dsv');
const objectPath = require('object-path');

function structureRow(rowObj) {
  const entries = Object.entries(rowObj);
  const structured = {};
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    objectPath.set(structured, key, value);
  }
  return structured;
}

function parseRows(rows, title) {
  const sheetJSON = rows.reduce((acc, row) => {
    const cleanRow = {};
    const rowEntries = Object.entries(row);
    rowEntries.forEach(([key, value]) => {
      if (key.charAt(0) !== '_') {
        cleanRow[key] = value;
      }
    });
    acc.push(structureRow(cleanRow));
    return acc;
  }, []);
  if (title.indexOf('-config') > -1) {
    // slightly awkwardly converting the google sheet object to some plain JSON
    // then using d3 to format as a csv as god intended
    const pureRows = csvParseRows(csvFormat(sheetJSON));
    const configObject = {};
    pureRows.forEach((r) => {
      if (r[0].indexOf('.list') > 1) {
        const [key] = r[0].split('.');
        const values = r[1].split(',');
        configObject[key] = values;
      } else {
        configObject[r[0]] = r[1];
      }
    });
    return configObject;
  }
  return sheetJSON;
}

exports.parseRows = parseRows;