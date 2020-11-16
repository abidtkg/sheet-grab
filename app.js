require('dotenv').config()
const express = require('express');
const app = express();
const helmet = require('helmet');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { googleSheetParser } = require('./config/googleSheetParser');

app.use(helmet());

app.get('/', (req, res) => {
  res.json({health:'ready and willing'});
});

app.get('/:sheetID.json', (req, res) => {
  const doc = new GoogleSpreadsheet(req.params.sheetID);
  doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  })
  .then(googleSheetParser(res, req, doc))
  .catch((err) => {
    res.json({ error: `service acc error : ${err}` });
  });
});


const port = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000;
app.listen(port, () => {
  console.log(`Server Port: ${port}`);
});
