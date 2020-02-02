const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { cloneDeep } = require('lodash');
const yargs = require('yargs').argv;

const yahooFinanceRouter = express.Router();

// Gets financial statistics data from yahoo.com for the given ticker AAPL
const mockFinancialStatistics = [
  "Market Cap (intraday) 5",
  "1.42T",
  "Enterprise Value 3",
  "1.39T",
  "Trailing P/E ",
  "25.75",
  "Forward P/E 1",
  "21.38",
  "PEG Ratio (5 yr expected) 1",
  "2.26",
  "Price/Sales (ttm)",
  "5.31",
  "Price/Book (mrq)",
  "15.89",
  "Enterprise Value/Revenue 3",
  "5.21",
  "Enterprise Value/EBITDA 6",
  "17.85",
  "Beta (5Y Monthly) ",
  "N/A",
  "52-Week Change 3",
  "92.25%",
  "S&P500 52-Week Change 3",
  "22.20%",
  "52 Week High 3",
  "327.85",
  "52 Week Low 3",
  "160.23",
  "50-Day Moving Average 3",
  "297.30",
  "200-Day Moving Average 3",
  "245.42",
  "Avg Vol (3 month) 3",
  "28.15M",
  "Avg Vol (10 day) 3",
  "32.83M",
  "Shares Outstanding 5",
  "4.38B",
  "Float ",
  "4.13B",
  "% Held by Insiders 1",
  "0.07%",
  "% Held by Institutions 1",
  "62.39%",
  "Shares Short (Jan 14, 2020) 4",
  "41.6M",
  "Short Ratio (Jan 14, 2020) 4",
  "1.28",
  "Short % of Float (Jan 14, 2020) 4",
  "0.95%",
  "Short % of Shares Outstanding (Jan 14, 2020) 4",
  "0.95%",
  "Shares Short (prior month Dec 12, 2019) 4",
  "50.75M",
  "Forward Annual Dividend Rate 4",
  "3.08",
  "Forward Annual Dividend Yield 4",
  "0.97%",
  "Trailing Annual Dividend Rate 3",
  "2.27",
  "Trailing Annual Dividend Yield 3",
  "0.71%",
  "5 Year Average Dividend Yield 4",
  "1.62",
  "Payout Ratio 4",
  "25.23%",
  "Dividend Date 3",
  "Nov 13, 2019",
  "Ex-Dividend Date 4",
  "Nov 06, 2019",
  "Last Split Factor 2",
  "7:1",
  "Last Split Date 3",
  "Jun 08, 2014",
  "Fiscal Year Ends ",
  "Sep 27, 2019",
  "Most Recent Quarter (mrq)",
  "Dec 27, 2019",
  "Profit Margin ",
  "21.49%",
  "Operating Margin (ttm)",
  "24.71%",
  "Return on Assets (ttm)",
  "11.58%",
  "Return on Equity (ttm)",
  "55.47%",
  "Revenue (ttm)",
  "267.68B",
  "Revenue Per Share (ttm)",
  "58.99",
  "Quarterly Revenue Growth (yoy)",
  "8.90%",
  "Gross Profit (ttm)",
  "98.39B",
  "EBITDA ",
  "78.12B",
  "Net Income Avi to Common (ttm)",
  "57.53B",
  "Diluted EPS (ttm)",
  "12.60",
  "Quarterly Earnings Growth (yoy)",
  "11.40%",
  "Total Cash (mrq)",
  "107.16B",
  "Total Cash Per Share (mrq)",
  "24.44",
  "Total Debt (mrq)",
  "108.29B",
  "Total Debt/Equity (mrq)",
  "120.96",
  "Current Ratio (mrq)",
  "1.60",
  "Book Value Per Share (mrq)",
  "20.42",
  "Operating Cash Flow (ttm)",
  "73.22B",
  "Levered Free Cash Flow (ttm)",
  "46.64B"
];
yahooFinanceRouter.get('/FinancialStatistics/:ticker', async (req, res) => {
  const returnObject = {};

  let resultArray;
  if (yargs.hasOwnProperty('M')) {
    resultArray = cloneDeep(mockFinancialStatistics);
  }
  else {
    resultArray = [];
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