const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { cloneDeep } = require('lodash');
const yargs = require('yargs').argv;

const yahooFinanceRouter = express.Router();

// Gets financial statistics data from yahoo.com for the given ticker
const mockFinancialStatistics = [
  "Market Cap (intraday) 5",
  "918.84B",
  "Enterprise Value 3",
  "937.68B",
  "Trailing P/E ",
  "82.12",
  "Forward P/E 1",
  "69.96",
  "PEG Ratio (5 yr expected) 1",
  "3.28",
  "Price/Sales (ttm)",
  "3.46",
  "Price/Book (mrq)",
  "16.23",
  "Enterprise Value/Revenue 3",
  "3.53",
  "Enterprise Value/EBITDA 6",
  "27.42",
  "Beta (5Y Monthly) ",
  "1.51",
  "52-Week Change 3",
  "14.71%",
  "S&P500 52-Week Change 3",
  "22.86%",
  "52 Week High 3",
  "2,035.80",
  "52 Week Low 3",
  "1,566.76",
  "50-Day Moving Average 3",
  "1,838.64",
  "200-Day Moving Average 3",
  "1,812.14",
  "Avg Vol (3 month) 3",
  "3.05M",
  "Avg Vol (10 day) 3",
  "3.34M",
  "Shares Outstanding 5",
  "495.8M",
  "Float ",
  "417.42M",
  "% Held by Insiders 1",
  "15.62%",
  "% Held by Institutions 1",
  "58.06%",
  "Shares Short (Dec 30, 2019) 4",
  "4.16M",
  "Short Ratio (Dec 30, 2019) 4",
  "1.28",
  "Short % of Float (Dec 30, 2019) 4",
  "1.01%",
  "Short % of Shares Outstanding (Dec 30, 2019) 4",
  "0.84%",
  "Shares Short (prior month Nov 28, 2019) 4",
  "3.56M",
  "Forward Annual Dividend Rate 4",
  "N/A",
  "Forward Annual Dividend Yield 4",
  "N/A",
  "Trailing Annual Dividend Rate 3",
  "N/A",
  "Trailing Annual Dividend Yield 3",
  "N/A",
  "5 Year Average Dividend Yield 4",
  "N/A",
  "Payout Ratio 4",
  "0.00%",
  "Dividend Date 3",
  "N/A",
  "Ex-Dividend Date 4",
  "N/A",
  "Last Split Factor 2",
  "2:1",
  "Last Split Date 3",
  "Sep 01, 1999",
  "Fiscal Year Ends ",
  "Dec 30, 2018",
  "Most Recent Quarter (mrq)",
  "Sep 29, 2019",
  "Profit Margin ",
  "4.27%",
  "Operating Margin (ttm)",
  "5.39%",
  "Return on Assets (ttm)",
  "5.22%",
  "Return on Equity (ttm)",
  "23.73%",
  "Revenue (ttm)",
  "265.47B",
  "Revenue Per Share (ttm)",
  "539.30",
  "Quarterly Revenue Growth (yoy)",
  "23.70%",
  "Gross Profit (ttm)",
  "93.73B",
  "EBITDA ",
  "34.19B",
  "Net Income Avi to Common (ttm)",
  "11.35B",
  "Diluted EPS (ttm)",
  "22.57",
  "Quarterly Earnings Growth (yoy)",
  "-26.00%",
  "Total Cash (mrq)",
  "43.4B",
  "Total Cash Per Share (mrq)",
  "87.54",
  "Total Debt (mrq)",
  "74.59B",
  "Total Debt/Equity (mrq)",
  "132.00",
  "Current Ratio (mrq)",
  "1.10",
  "Book Value Per Share (mrq)",
  "114.16",
  "Operating Cash Flow (ttm)",
  "35.33B",
  "Levered Free Cash Flow (ttm)",
  "22.58B"
];
yahooFinanceRouter.get('/FinancialStatistics/:ticker', async (req, res) => {
  const returnObject = {};

  const resultArray = [];
  if (yargs.hasOwnProperty('M')) {
    resultArray = cloneDeep(mockFinancialStatistics);
  }
  else {
    const ticker = req.params.ticker.toUpperCase();
    const result = await axios.get(`https://finance.yahoo.com/quote/${ticker}/key-statistics?p=${ticker}`);
    const $ = cheerio.load(result.data);

    $('td').each((index, element) => {
      resultArray.push($(element).text());
    })
  }

  for (let a = 0; a < resultArray.length; a += 2) {
    returnObject[resultArray[a]] = resultArray[a+1];
  }

  res.status(200).send({
    data: returnObject,
  });
});

module.exports = yahooFinanceRouter;