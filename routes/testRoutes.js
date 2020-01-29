const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const testRouter = express.Router();

testRouter.get('/test', (req, res) => {
  res.status(200).send({
    data: 'hello there',
  });
});

testRouter.get('/yahoo', async (req, res) => {
  const result = await axios.get('https://finance.yahoo.com/quote/AMD/key-statistics?p=AMD')
  const $ = cheerio.load(result.data);
  console.log($('.Trsdu').text())
  const resultArray = [];
  $('td').each((index, element) => {
    resultArray.push($(element).text());
  })
  console.log(resultArray);

  res.status(200).send({
    data: resultArray,
  });
});

testRouter.get('/simpleWebsite', async (req, res) => {
  const result = await axios.get('http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm')
  const $ = cheerio.load(result.data);
  console.log($('.whs2').text())

  res.status(200).send({
    data: 'hello there',
  });
})

module.exports = testRouter;