const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const yahooFinanceRouter = express.Router();

yahooFinanceRouter.get('/FinancialStatistics/:ticker', async (req, res) => {
  const returnObject = {};
  const ticker = req.params.ticker.toUpperCase();
  const result = await axios.get(`https://finance.yahoo.com/quote/${ticker}/key-statistics?p=${ticker}`);
  const $ = cheerio.load(result.data);

  const resultArray = [];
  $('td').each((index, element) => {
    resultArray.push($(element).text());
  })

  for (let a = 0; a < resultArray.length; a += 2) {
    returnObject[resultArray[a]] = resultArray[a+1];
  }

  res.status(200).send({
    data: returnObject,
  });
})

module.exports = yahooFinanceRouter;