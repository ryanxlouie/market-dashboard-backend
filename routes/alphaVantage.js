const express = require('express');
const axios = require('axios');
const { cloneDeep } = require('lodash');
const yargs = require('yargs').argv;
const { avApiKey } = require('../config');

const alphaVantageRouter = express.Router();

// Gets the daily prices for a set time range AAPL
const mockDailyPriceQuote = {
  "2020-01-24": {
      "1. open": "320.2500",
      "2. high": "323.3300",
      "3. low": "317.5188",
      "4. close": "318.3100",
      "5. volume": "36634380"
  },
  "2020-01-23": {
      "1. open": "317.9200",
      "2. high": "319.5600",
      "3. low": "315.6500",
      "4. close": "319.2300",
      "5. volume": "26117993"
  },
  "2020-01-22": {
      "1. open": "318.5800",
      "2. high": "319.9900",
      "3. low": "317.3100",
      "4. close": "317.7000",
      "5. volume": "25458115"
  },
  "2020-01-21": {
      "1. open": "317.1900",
      "2. high": "319.0200",
      "3. low": "316.0000",
      "4. close": "316.5700",
      "5. volume": "27235039"
  },
  "2020-01-17": {
      "1. open": "316.2700",
      "2. high": "318.7400",
      "3. low": "315.0000",
      "4. close": "318.7300",
      "5. volume": "34454117"
  },
  "2020-01-16": {
      "1. open": "313.5900",
      "2. high": "315.7000",
      "3. low": "312.0900",
      "4. close": "315.2400",
      "5. volume": "27207254"
  },
  "2020-01-15": {
      "1. open": "311.8500",
      "2. high": "315.5000",
      "3. low": "309.5500",
      "4. close": "311.3400",
      "5. volume": "30480882"
  },
  "2020-01-14": {
      "1. open": "316.7000",
      "2. high": "317.5700",
      "3. low": "312.1700",
      "4. close": "312.6800",
      "5. volume": "40653457"
  },
  "2020-01-13": {
      "1. open": "311.6400",
      "2. high": "317.0700",
      "3. low": "311.1500",
      "4. close": "316.9600",
      "5. volume": "30028742"
  },
  "2020-01-10": {
      "1. open": "310.6000",
      "2. high": "312.6700",
      "3. low": "308.2500",
      "4. close": "310.3300",
      "5. volume": "35217272"
  },
  "2020-01-09": {
      "1. open": "307.2350",
      "2. high": "310.4300",
      "3. low": "306.2000",
      "4. close": "309.6300",
      "5. volume": "42621542"
  },
  "2020-01-08": {
      "1. open": "297.1600",
      "2. high": "304.4399",
      "3. low": "297.1560",
      "4. close": "303.1900",
      "5. volume": "33090946"
  },
  "2020-01-07": {
      "1. open": "299.8400",
      "2. high": "300.9000",
      "3. low": "297.4800",
      "4. close": "298.3900",
      "5. volume": "27877655"
  },
  "2020-01-06": {
      "1. open": "293.7900",
      "2. high": "299.9600",
      "3. low": "292.7500",
      "4. close": "299.8000",
      "5. volume": "29644644"
  },
  "2020-01-03": {
      "1. open": "297.1500",
      "2. high": "300.5800",
      "3. low": "296.5000",
      "4. close": "297.4300",
      "5. volume": "36633878"
  },
  "2020-01-02": {
      "1. open": "296.2400",
      "2. high": "300.6000",
      "3. low": "295.1900",
      "4. close": "300.3500",
      "5. volume": "33911864"
  },
  "2019-12-31": {
      "1. open": "289.9300",
      "2. high": "293.6800",
      "3. low": "289.5200",
      "4. close": "293.6500",
      "5. volume": "25247625"
  },
  "2019-12-30": {
      "1. open": "289.4600",
      "2. high": "292.6900",
      "3. low": "285.2200",
      "4. close": "291.5200",
      "5. volume": "36059614"
  },
  "2019-12-27": {
      "1. open": "291.1200",
      "2. high": "293.9700",
      "3. low": "288.1200",
      "4. close": "289.8000",
      "5. volume": "36592936"
  },
  "2019-12-26": {
      "1. open": "284.8200",
      "2. high": "289.9800",
      "3. low": "284.7000",
      "4. close": "289.9100",
      "5. volume": "23334004"
  },
  "2019-12-24": {
      "1. open": "284.6900",
      "2. high": "284.8900",
      "3. low": "282.9197",
      "4. close": "284.2700",
      "5. volume": "12119714"
  },
  "2019-12-23": {
      "1. open": "280.5300",
      "2. high": "284.2500",
      "3. low": "280.3735",
      "4. close": "284.0000",
      "5. volume": "24677883"
  },
  "2019-12-20": {
      "1. open": "282.2300",
      "2. high": "282.6500",
      "3. low": "278.5600",
      "4. close": "279.4400",
      "5. volume": "69032743"
  },
  "2019-12-19": {
      "1. open": "279.5000",
      "2. high": "281.1800",
      "3. low": "278.9500",
      "4. close": "280.0200",
      "5. volume": "24626947"
  },
  "2019-12-18": {
      "1. open": "279.8000",
      "2. high": "281.9000",
      "3. low": "279.1200",
      "4. close": "279.7400",
      "5. volume": "29024687"
  },
  "2019-12-17": {
      "1. open": "279.5700",
      "2. high": "281.7700",
      "3. low": "278.8000",
      "4. close": "280.4100",
      "5. volume": "28575798"
  },
  "2019-12-16": {
      "1. open": "277.0000",
      "2. high": "280.7900",
      "3. low": "276.9800",
      "4. close": "279.8600",
      "5. volume": "32081105"
  },
  "2019-12-13": {
      "1. open": "271.4600",
      "2. high": "275.3000",
      "3. low": "270.9300",
      "4. close": "275.1500",
      "5. volume": "33432806"
  },
  "2019-12-12": {
      "1. open": "267.7800",
      "2. high": "272.5599",
      "3. low": "267.3210",
      "4. close": "271.4600",
      "5. volume": "34437042"
  },
  "2019-12-11": {
      "1. open": "268.8100",
      "2. high": "271.1000",
      "3. low": "268.5000",
      "4. close": "270.7700",
      "5. volume": "19723391"
  },
  "2019-12-10": {
      "1. open": "268.6000",
      "2. high": "270.0700",
      "3. low": "265.8600",
      "4. close": "268.4800",
      "5. volume": "22632383"
  },
  "2019-12-09": {
      "1. open": "270.0000",
      "2. high": "270.8000",
      "3. low": "264.9100",
      "4. close": "266.9200",
      "5. volume": "32182645"
  },
  "2019-12-06": {
      "1. open": "267.4800",
      "2. high": "271.0000",
      "3. low": "267.3000",
      "4. close": "270.7100",
      "5. volume": "26547493"
  },
  "2019-12-05": {
      "1. open": "263.7900",
      "2. high": "265.8900",
      "3. low": "262.7300",
      "4. close": "265.5800",
      "5. volume": "18661343"
  },
  "2019-12-04": {
      "1. open": "261.0700",
      "2. high": "263.3100",
      "3. low": "260.6800",
      "4. close": "261.7400",
      "5. volume": "16810388"
  },
  "2019-12-03": {
      "1. open": "258.3100",
      "2. high": "259.5300",
      "3. low": "256.2900",
      "4. close": "259.4500",
      "5. volume": "29377268"
  },
  "2019-12-02": {
      "1. open": "267.2700",
      "2. high": "268.2500",
      "3. low": "263.4500",
      "4. close": "264.1600",
      "5. volume": "23693550"
  },
  "2019-11-29": {
      "1. open": "266.6000",
      "2. high": "268.0000",
      "3. low": "265.9000",
      "4. close": "267.2500",
      "5. volume": "11654363"
  },
  "2019-11-27": {
      "1. open": "265.5800",
      "2. high": "267.9800",
      "3. low": "265.3100",
      "4. close": "267.8400",
      "5. volume": "16386122"
  },
  "2019-11-26": {
      "1. open": "266.9400",
      "2. high": "267.1600",
      "3. low": "262.5000",
      "4. close": "264.2900",
      "5. volume": "26334882"
  },
  "2019-11-25": {
      "1. open": "262.7100",
      "2. high": "266.4400",
      "3. low": "262.5200",
      "4. close": "266.3700",
      "5. volume": "21029517"
  },
  "2019-11-22": {
      "1. open": "262.5900",
      "2. high": "263.1800",
      "3. low": "260.8400",
      "4. close": "261.7800",
      "5. volume": "16331263"
  },
  "2019-11-21": {
      "1. open": "263.6900",
      "2. high": "264.0050",
      "3. low": "261.1800",
      "4. close": "262.0100",
      "5. volume": "30348778"
  },
  "2019-11-20": {
      "1. open": "265.5400",
      "2. high": "266.0830",
      "3. low": "260.4000",
      "4. close": "263.1900",
      "5. volume": "26609919"
  },
  "2019-11-19": {
      "1. open": "267.9000",
      "2. high": "268.0000",
      "3. low": "265.3926",
      "4. close": "266.2900",
      "5. volume": "19069597"
  },
  "2019-11-18": {
      "1. open": "265.8000",
      "2. high": "267.4300",
      "3. low": "264.2300",
      "4. close": "267.1000",
      "5. volume": "21700897"
  },
  "2019-11-15": {
      "1. open": "263.6800",
      "2. high": "265.7800",
      "3. low": "263.0100",
      "4. close": "265.7600",
      "5. volume": "25093666"
  },
  "2019-11-14": {
      "1. open": "263.7500",
      "2. high": "264.8800",
      "3. low": "262.1000",
      "4. close": "262.6400",
      "5. volume": "22395556"
  },
  "2019-11-13": {
      "1. open": "261.1300",
      "2. high": "264.7800",
      "3. low": "261.0700",
      "4. close": "264.4700",
      "5. volume": "25817593"
  },
  "2019-11-12": {
      "1. open": "261.5500",
      "2. high": "262.7900",
      "3. low": "260.9200",
      "4. close": "261.9600",
      "5. volume": "21847226"
  },
  "2019-11-11": {
      "1. open": "258.3000",
      "2. high": "262.4700",
      "3. low": "258.2800",
      "4. close": "262.2000",
      "5. volume": "20507459"
  },
  "2019-11-08": {
      "1. open": "258.6900",
      "2. high": "260.4400",
      "3. low": "256.8500",
      "4. close": "260.1400",
      "5. volume": "17520495"
  },
  "2019-11-07": {
      "1. open": "258.7400",
      "2. high": "260.3500",
      "3. low": "258.1100",
      "4. close": "259.4300",
      "5. volume": "23735083"
  },
  "2019-11-06": {
      "1. open": "256.7700",
      "2. high": "257.4900",
      "3. low": "255.3650",
      "4. close": "257.2400",
      "5. volume": "18966124"
  },
  "2019-11-05": {
      "1. open": "257.0500",
      "2. high": "258.1900",
      "3. low": "256.3200",
      "4. close": "257.1300",
      "5. volume": "19974427"
  },
  "2019-11-04": {
      "1. open": "257.3300",
      "2. high": "257.8450",
      "3. low": "255.3800",
      "4. close": "257.5000",
      "5. volume": "25817952"
  },
  "2019-11-01": {
      "1. open": "249.5400",
      "2. high": "255.9300",
      "3. low": "249.1600",
      "4. close": "255.8200",
      "5. volume": "37781334"
  },
  "2019-10-31": {
      "1. open": "247.2400",
      "2. high": "249.1700",
      "3. low": "237.2600",
      "4. close": "248.7600",
      "5. volume": "34790520"
  },
  "2019-10-30": {
      "1. open": "244.7600",
      "2. high": "245.3000",
      "3. low": "241.2100",
      "4. close": "243.2600",
      "5. volume": "31130522"
  },
  "2019-10-29": {
      "1. open": "248.9700",
      "2. high": "249.7500",
      "3. low": "242.5700",
      "4. close": "243.2900",
      "5. volume": "35709867"
  },
  "2019-10-28": {
      "1. open": "247.4200",
      "2. high": "249.2500",
      "3. low": "246.7200",
      "4. close": "249.0500",
      "5. volume": "23655368"
  },
  "2019-10-25": {
      "1. open": "243.1600",
      "2. high": "246.7300",
      "3. low": "242.8800",
      "4. close": "246.5800",
      "5. volume": "18369296"
  },
  "2019-10-24": {
      "1. open": "244.5100",
      "2. high": "244.8000",
      "3. low": "241.8050",
      "4. close": "243.5800",
      "5. volume": "17916255"
  },
  "2019-10-23": {
      "1. open": "242.1000",
      "2. high": "243.2400",
      "3. low": "241.2200",
      "4. close": "243.1800",
      "5. volume": "19932545"
  },
  "2019-10-22": {
      "1. open": "241.1600",
      "2. high": "242.2000",
      "3. low": "239.6218",
      "4. close": "239.9600",
      "5. volume": "22684001"
  },
  "2019-10-21": {
      "1. open": "237.5200",
      "2. high": "240.9900",
      "3. low": "237.3200",
      "4. close": "240.5100",
      "5. volume": "21811567"
  },
  "2019-10-18": {
      "1. open": "234.5900",
      "2. high": "237.5800",
      "3. low": "234.2900",
      "4. close": "236.4100",
      "5. volume": "24248023"
  },
  "2019-10-17": {
      "1. open": "235.0900",
      "2. high": "236.1500",
      "3. low": "233.5200",
      "4. close": "235.2800",
      "5. volume": "17272897"
  },
  "2019-10-16": {
      "1. open": "233.3700",
      "2. high": "235.2400",
      "3. low": "233.2000",
      "4. close": "234.3700",
      "5. volume": "19286694"
  },
  "2019-10-15": {
      "1. open": "236.3900",
      "2. high": "237.6500",
      "3. low": "234.8800",
      "4. close": "235.3200",
      "5. volume": "23040483"
  },
  "2019-10-14": {
      "1. open": "234.9000",
      "2. high": "238.1342",
      "3. low": "234.6701",
      "4. close": "235.8700",
      "5. volume": "24413484"
  },
  "2019-10-11": {
      "1. open": "232.9500",
      "2. high": "237.6400",
      "3. low": "232.3075",
      "4. close": "236.2100",
      "5. volume": "41990210"
  },
  "2019-10-10": {
      "1. open": "227.9300",
      "2. high": "230.4400",
      "3. low": "227.3000",
      "4. close": "230.0900",
      "5. volume": "28962984"
  },
  "2019-10-09": {
      "1. open": "227.0300",
      "2. high": "227.7900",
      "3. low": "225.6400",
      "4. close": "227.0300",
      "5. volume": "19029424"
  },
  "2019-10-08": {
      "1. open": "225.8200",
      "2. high": "228.0600",
      "3. low": "224.3300",
      "4. close": "224.4000",
      "5. volume": "29282700"
  },
  "2019-10-07": {
      "1. open": "226.2700",
      "2. high": "229.9300",
      "3. low": "225.8400",
      "4. close": "227.0600",
      "5. volume": "30889269"
  },
  "2019-10-04": {
      "1. open": "225.6400",
      "2. high": "227.4900",
      "3. low": "223.8900",
      "4. close": "227.0100",
      "5. volume": "34755553"
  },
  "2019-10-03": {
      "1. open": "218.4300",
      "2. high": "220.9600",
      "3. low": "215.1320",
      "4. close": "220.8200",
      "5. volume": "30352686"
  },
  "2019-10-02": {
      "1. open": "223.0600",
      "2. high": "223.5800",
      "3. low": "217.9300",
      "4. close": "218.9600",
      "5. volume": "35767257"
  },
  "2019-10-01": {
      "1. open": "225.0700",
      "2. high": "228.2200",
      "3. low": "224.2000",
      "4. close": "224.5900",
      "5. volume": "36187163"
  },
  "2019-09-30": {
      "1. open": "220.9000",
      "2. high": "224.5800",
      "3. low": "220.7900",
      "4. close": "223.9700",
      "5. volume": "26318583"
  },
  "2019-09-27": {
      "1. open": "220.5400",
      "2. high": "220.9600",
      "3. low": "217.2814",
      "4. close": "218.8200",
      "5. volume": "25361285"
  },
  "2019-09-26": {
      "1. open": "220.0000",
      "2. high": "220.9400",
      "3. low": "218.8300",
      "4. close": "219.8900",
      "5. volume": "19088312"
  },
  "2019-09-25": {
      "1. open": "218.5500",
      "2. high": "221.5000",
      "3. low": "217.1402",
      "4. close": "221.0300",
      "5. volume": "22481006"
  },
  "2019-09-24": {
      "1. open": "221.0550",
      "2. high": "222.4900",
      "3. low": "217.1900",
      "4. close": "217.6800",
      "5. volume": "31434367"
  },
  "2019-09-23": {
      "1. open": "218.9500",
      "2. high": "219.8400",
      "3. low": "217.6500",
      "4. close": "218.7200",
      "5. volume": "19419648"
  },
  "2019-09-20": {
      "1. open": "221.3800",
      "2. high": "222.5600",
      "3. low": "217.4730",
      "4. close": "217.7300",
      "5. volume": "57977094"
  },
  "2019-09-19": {
      "1. open": "222.0100",
      "2. high": "223.7600",
      "3. low": "220.3700",
      "4. close": "220.9600",
      "5. volume": "22187876"
  },
  "2019-09-18": {
      "1. open": "221.0600",
      "2. high": "222.8500",
      "3. low": "219.4400",
      "4. close": "222.7700",
      "5. volume": "25643093"
  },
  "2019-09-17": {
      "1. open": "219.9600",
      "2. high": "220.8200",
      "3. low": "219.1200",
      "4. close": "220.7000",
      "5. volume": "18386468"
  },
  "2019-09-16": {
      "1. open": "217.7300",
      "2. high": "220.1300",
      "3. low": "217.5600",
      "4. close": "219.9000",
      "5. volume": "21158141"
  },
  "2019-09-13": {
      "1. open": "220.0000",
      "2. high": "220.7900",
      "3. low": "217.0200",
      "4. close": "218.7500",
      "5. volume": "39763296"
  },
  "2019-09-12": {
      "1. open": "224.8000",
      "2. high": "226.4200",
      "3. low": "222.8600",
      "4. close": "223.0850",
      "5. volume": "32226669"
  },
  "2019-09-11": {
      "1. open": "218.0700",
      "2. high": "223.7100",
      "3. low": "217.7300",
      "4. close": "223.5900",
      "5. volume": "44289646"
  },
  "2019-09-10": {
      "1. open": "213.8600",
      "2. high": "216.7800",
      "3. low": "211.7100",
      "4. close": "216.7000",
      "5. volume": "31777931"
  },
  "2019-09-09": {
      "1. open": "214.8400",
      "2. high": "216.4400",
      "3. low": "211.0700",
      "4. close": "214.1700",
      "5. volume": "27309401"
  },
  "2019-09-06": {
      "1. open": "214.0500",
      "2. high": "214.4200",
      "3. low": "212.5100",
      "4. close": "213.2600",
      "5. volume": "19362294"
  },
  "2019-09-05": {
      "1. open": "212.0000",
      "2. high": "213.9700",
      "3. low": "211.5100",
      "4. close": "213.2800",
      "5. volume": "23946984"
  },
  "2019-09-04": {
      "1. open": "208.3900",
      "2. high": "209.4800",
      "3. low": "207.3200",
      "4. close": "209.1900",
      "5. volume": "19216820"
  },
  "2019-09-03": {
      "1. open": "206.4300",
      "2. high": "206.9800",
      "3. low": "204.2200",
      "4. close": "205.7000",
      "5. volume": "20059574"
  }
};
alphaVantageRouter.get('/DailyPriceQuote/:ticker', async (req, res) => {
  const returnObject = {};
  const dailyArray = [];
  const metricsObject = {};

  let result;
  if (yargs.hasOwnProperty('M')) {
    result = cloneDeep(mockDailyPriceQuote);
  }
  else {
    const ticker = req.params.ticker.toUpperCase();
    let axiosString = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${avApiKey}`;

    // if (outputsize === 'full') {
    //   axiosString = axiosString + '&outputsize=full';
    // }
    
    let res = await axios.get(axiosString);
    if (res.data.hasOwnProperty('Note')) {
      return ('Cannot call api any longer')
    }
    result = res.data['Time Series (Daily)'];
  }

  // Return an array instead of object of objects
  for (let prop in result) {
    let tempDate = new Date(prop);
    dailyArray.push({
      date: `${tempDate.getMonth()+1}/${tempDate.getDate()}/${tempDate.getFullYear()}`,
      open: parseFloat(result[prop]['1. open']),
      high: parseFloat(result[prop]['2. high']),
      low: parseFloat(result[prop]['3. low']),
      close: parseFloat(result[prop]['4. close']),
      volume: parseFloat(result[prop]['5. volume']),
    });
  }

  returnObject['Daily Array'] = dailyArray.reverse();

  // Metrics Add On
  // Lowest value in the timeline
  const lowArray = dailyArray.map(x => x.low);
  metricsObject['Lowest Price'] = {
    date: dailyArray[lowArray.indexOf(Math.min(...lowArray))].date,
    value: Math.min(...lowArray),
  }

  // Highest value in the timeline
  const highArray = dailyArray.map(x => x.high);
  metricsObject['Highest Price'] = {
    date: dailyArray[highArray.indexOf(Math.max(...highArray))].date,
    value: Math.max(...highArray),
  }

  returnObject['Metrics'] = metricsObject;
  res.status(200).send({
    data: returnObject,
  });
});

// Get the performance of various industries
const mockIndustryPerformance = {
  "Meta Data": {
    "Information": "US Sector Performance (realtime & historical)",
    "Last Refreshed": "2020-01-26 20:19:39 US/Eastern"
  },
  "Rank A: Real-Time Performance": {
    "Utilities": "0.33%",
    "Real Estate": "-0.23%",
    "Information Technology": "-0.45%",
    "Industrials": "-0.48%",
    "Consumer Staples": "-0.65%",
    "Materials": "-0.69%",
    "Communication Services": "-1.04%",
    "Energy": "-1.17%",
    "Consumer Discretionary": "-1.33%",
    "Financials": "-1.36%",
    "Health Care": "-1.68%"
  },
  "Rank B: 1 Day Performance": {
    "Utilities": "0.33%",
    "Real Estate": "-0.23%",
    "Information Technology": "-0.45%",
    "Industrials": "-0.48%",
    "Consumer Staples": "-0.65%",
    "Materials": "-0.69%",
    "Communication Services": "-1.04%",
    "Energy": "-1.17%",
    "Consumer Discretionary": "-1.33%",
    "Financials": "-1.36%",
    "Health Care": "-1.68%"
  },
  "Rank C: 5 Day Performance": {
    "Utilities": "3.18%",
    "Real Estate": "1.14%",
    "Information Technology": "1.03%",
    "Consumer Staples": "-0.22%",
    "Communication Services": "-0.49%",
    "Industrials": "-1.03%",
    "Consumer Discretionary": "-1.21%",
    "Financials": "-1.76%",
    "Materials": "-1.79%",
    "Health Care": "-1.95%",
    "Energy": "-4.88%"
  },
  "Rank D: 1 Month Performance": {
    "Utilities": "6.84%",
    "Information Technology": "6.82%",
    "Real Estate": "4.89%",
    "Communication Services": "3.46%",
    "Industrials": "1.76%",
    "Consumer Discretionary": "1.49%",
    "Consumer Staples": "1.03%",
    "Health Care": "-0.09%",
    "Financials": "-1.03%",
    "Materials": "-2.18%",
    "Energy": "-6.03%"
  },
  "Rank E: 3 Month Performance": {
    "Information Technology": "20.75%",
    "Health Care": "11.59%",
    "Communication Services": "10.40%",
    "Industrials": "7.16%",
    "Financials": "6.46%",
    "Utilities": "5.94%",
    "Materials": "4.17%",
    "Consumer Discretionary": "4.04%",
    "Consumer Staples": "3.95%",
    "Real Estate": "-0.02%",
    "Energy": "-1.75%"
  },
  "Rank F: Year-to-Date (YTD) Performance": {
    "Information Technology": "6.20%",
    "Utilities": "5.75%",
    "Communication Services": "3.77%",
    "Real Estate": "3.27%",
    "Industrials": "2.46%",
    "Consumer Staples": "1.00%",
    "Consumer Discretionary": "0.45%",
    "Health Care": "0.43%",
    "Financials": "-1.44%",
    "Materials": "-2.74%",
    "Energy": "-5.86%"
  },
  "Rank G: 1 Year Performance": {
    "Information Technology": "51.29%",
    "Communication Services": "28.05%",
    "Utilities": "27.17%",
    "Real Estate": "22.58%",
    "Industrials": "21.68%",
    "Consumer Staples": "21.19%",
    "Consumer Discretionary": "18.81%",
    "Financials": "18.01%",
    "Health Care": "15.11%",
    "Materials": "14.32%",
    "Energy": "-5.88%"
  },
  "Rank H: 3 Year Performance": {
    "Information Technology": "104.56%",
    "Health Care": "48.47%",
    "Consumer Discretionary": "48.23%",
    "Utilities": "41.29%",
    "Financials": "31.95%",
    "Industrials": "29.70%",
    "Real Estate": "28.99%",
    "Consumer Staples": "21.28%",
    "Materials": "16.66%",
    "Communication Services": "7.79%",
    "Energy": "-20.61%"
  },
  "Rank I: 5 Year Performance": {
    "Information Technology": "146.76%",
    "Consumer Discretionary": "76.20%",
    "Financials": "57.26%",
    "Industrials": "46.58%",
    "Health Care": "45.28%",
    "Utilities": "38.82%",
    "Consumer Staples": "27.88%",
    "Materials": "23.91%",
    "Communication Services": "23.40%",
    "Energy": "-24.38%"
  },
  "Rank J: 10 Year Performance": {
    "Information Technology": "385.63%",
    "Consumer Discretionary": "332.45%",
    "Health Care": "224.53%",
    "Industrials": "188.68%",
    "Financials": "163.99%",
    "Consumer Staples": "140.85%",
    "Utilities": "128.69%",
    "Materials": "96.69%",
    "Communication Services": "79.27%",
    "Energy": "1.69%"
  }
};
alphaVantageRouter.get('/IndustryPerformance', async (req, res) => {
  let result;
  if (yargs.hasOwnProperty('M')) {
    result = cloneDeep(mockIndustryPerformance);
  }
  else {
    let res = await axios.get(`https://www.alphavantage.co/query?function=SECTOR&apikey=${avApiKey}`);
    if (res.data.hasOwnProperty('Note')) {
      return ('Cannot call api any longer');
    }
    result = res.data;
  }

  delete result['Meta Data'];

  res.status(200).send({
    data: result,
  });
});

// Get simple moving average
const mockSimpleMovingAverage = {
  "Meta Data": {
    "1: Symbol": "AAPL",
    "2: Indicator": "Simple Moving Average (SMA)",
    "3: Last Refreshed": "2020-01-31",
    "4: Interval": "daily",
    "5: Time Period": 15,
    "6: Series Type": "open",
    "7: Time Zone": "US/Eastern"
  },
  "Technical Analysis: SMA": {
    "2020-01-31": {
        "SMA": "316.2116"
    },
    "2020-01-30": {
        "SMA": "315.2986"
    },
    "2020-01-29": {
        "SMA": "313.7397"
    },
    "2020-01-28": {
        "SMA": "312.0990"
    },
    "2020-01-27": {
        "SMA": "310.8450"
    },
    "2020-01-24": {
        "SMA": "309.9843"
    },
    "2020-01-23": {
        "SMA": "308.3837"
    },
    "2020-01-22": {
        "SMA": "306.5177"
    },
    "2020-01-21": {
        "SMA": "304.5763"
    },
    "2020-01-17": {
        "SMA": "302.8383"
    },
    "2020-01-16": {
        "SMA": "300.7417"
    },
    "2020-01-15": {
        "SMA": "298.8150"
    },
    "2020-01-14": {
        "SMA": "296.7270"
    },
    "2020-01-13": {
        "SMA": "294.4290"
    },
    "2020-01-10": {
        "SMA": "292.2863"
    },
    "2020-01-09": {
        "SMA": "290.2330"
    },
    "2020-01-08": {
        "SMA": "288.3887"
    },
    "2020-01-07": {
        "SMA": "287.0447"
    },
    "2020-01-06": {
        "SMA": "285.1527"
    },
    "2020-01-03": {
        "SMA": "283.4187"
    },
    "2020-01-02": {
        "SMA": "281.5293"
    },
    "2019-12-31": {
        "SMA": "279.6867"
    },
    "2019-12-30": {
        "SMA": "278.3580"
    },
    "2019-12-27": {
        "SMA": "276.8927"
    },
    "2019-12-26": {
        "SMA": "275.0707"
    },
    "2019-12-24": {
        "SMA": "273.4873"
    },
    "2019-12-23": {
        "SMA": "271.7287"
    },
    "2019-12-20": {
        "SMA": "270.8447"
    },
    "2019-12-19": {
        "SMA": "269.8027"
    },
    "2019-12-18": {
        "SMA": "268.8747"
    },
    "2019-12-17": {
        "SMA": "268.0173"
    },
    "2019-12-16": {
        "SMA": "266.8933"
    },
    "2019-12-13": {
        "SMA": "265.9327"
    },
    "2019-12-12": {
        "SMA": "265.4147"
    },
    "2019-12-11": {
        "SMA": "265.2653"
    },
    "2019-12-10": {
        "SMA": "265.2047"
    },
    "2019-12-09": {
        "SMA": "265.0180"
    },
    "2019-12-06": {
        "SMA": "264.5967"
    },
    "2019-12-05": {
        "SMA": "264.3480"
    },
    "2019-12-04": {
        "SMA": "264.1707"
    },
    "2019-12-03": {
        "SMA": "264.2027"
    },
    "2019-12-02": {
        "SMA": "264.2020"
    },
    "2019-11-29": {
        "SMA": "263.6300"
    },
    "2019-11-27": {
        "SMA": "263.1060"
    },
    "2019-11-26": {
        "SMA": "262.5187"
    },
    "2019-11-25": {
        "SMA": "261.8593"
    },
    "2019-11-22": {
        "SMA": "261.5007"
    },
    "2019-11-21": {
        "SMA": "260.6307"
    },
    "2019-11-20": {
        "SMA": "259.5340"
    },
    "2019-11-19": {
        "SMA": "258.1487"
    },
    "2019-11-18": {
        "SMA": "256.8867"
    },
    "2019-11-15": {
        "SMA": "255.6613"
    },
    "2019-11-14": {
        "SMA": "254.2933"
    },
    "2019-11-13": {
        "SMA": "253.0107"
    },
    "2019-11-12": {
        "SMA": "251.7420"
    },
    "2019-11-11": {
        "SMA": "250.3827"
    },
    "2019-11-08": {
        "SMA": "248.9973"
    },
    "2019-11-07": {
        "SMA": "247.3907"
    },
    "2019-11-06": {
        "SMA": "245.8140"
    },
    "2019-11-05": {
        "SMA": "244.2540"
    },
    "2019-11-04": {
        "SMA": "242.8767"
    },
    "2019-11-01": {
        "SMA": "241.3813"
    },
    "2019-10-31": {
        "SMA": "240.2753"
    },
    "2019-10-30": {
        "SMA": "238.9880"
    },
    "2019-10-29": {
        "SMA": "237.8060"
    },
    "2019-10-28": {
        "SMA": "236.2627"
    },
    "2019-10-25": {
        "SMA": "234.8527"
    },
    "2019-10-24": {
        "SMA": "233.6847"
    },
    "2019-10-23": {
        "SMA": "231.9460"
    },
    "2019-10-22": {
        "SMA": "230.6767"
    },
    "2019-10-21": {
        "SMA": "229.6040"
    },
    "2019-10-18": {
        "SMA": "228.4960"
    },
    "2019-10-17": {
        "SMA": "227.5593"
    },
    "2019-10-16": {
        "SMA": "226.5533"
    },
    "2019-10-15": {
        "SMA": "225.5653"
    },
    "2019-10-14": {
        "SMA": "224.5430"
    },
    "2019-10-11": {
        "SMA": "223.4797"
    },
    "2019-10-10": {
        "SMA": "222.7083"
    },
    "2019-10-09": {
        "SMA": "222.3137"
    },
    "2019-10-08": {
        "SMA": "221.9157"
    },
    "2019-10-07": {
        "SMA": "221.5250"
    },
    "2019-10-04": {
        "SMA": "220.9557"
    },
    "2019-10-03": {
        "SMA": "220.5797"
    },
    "2019-10-02": {
        "SMA": "221.0043"
    },
    "2019-10-01": {
        "SMA": "220.6717"
    },
    "2019-09-30": {
        "SMA": "219.9243"
    },
    "2019-09-27": {
        "SMA": "219.5203"
    },
    "2019-09-26": {
        "SMA": "219.0877"
    },
    "2019-09-25": {
        "SMA": "218.5543"
    },
    "2019-09-24": {
        "SMA": "217.8770"
    },
    "2019-09-23": {
        "SMA": "216.9020"
    },
    "2019-09-20": {
        "SMA": "216.3160"
    },
    "2019-09-19": {
        "SMA": "215.4573"
    },
    "2019-09-18": {
        "SMA": "214.2633"
    },
    "2019-09-17": {
        "SMA": "213.3833"
    },
    "2019-09-16": {
        "SMA": "212.4433"
    },
    "2019-09-13": {
        "SMA": "211.8900"
    },
    "2019-09-12": {
        "SMA": "211.4360"
    },
    "2019-09-11": {
        "SMA": "210.6487"
    },
    "2019-09-10": {
        "SMA": "210.1693"
    },
    "2019-09-09": {
        "SMA": "209.9533"
    },
    "2019-09-06": {
        "SMA": "209.2493"
    },
    "2019-09-05": {
        "SMA": "208.5433"
    },
    "2019-09-04": {
        "SMA": "207.9540"
    },
    "2019-09-03": {
        "SMA": "207.4627"
    },
    "2019-08-30": {
        "SMA": "207.0087"
    },
    "2019-08-29": {
        "SMA": "206.4180"
    },
    "2019-08-28": {
        "SMA": "205.8647"
    },
    "2019-08-27": {
        "SMA": "205.2853"
    },
    "2019-08-26": {
        "SMA": "204.5153"
    },
    "2019-08-23": {
        "SMA": "203.9907"
    },
    "2019-08-22": {
        "SMA": "203.7307"
    },
    "2019-08-21": {
        "SMA": "203.7780"
    },
    "2019-08-20": {
        "SMA": "204.0067"
    },
  }
};
alphaVantageRouter.get('/SimpleMovingAverage/:ticker', async (req, res) => {
  let result;
  if (yargs.hasOwnProperty('M')) {
    result = cloneDeep(mockSimpleMovingAverage);
  }
  else {
    const ticker = req.params.ticker.toUpperCase();
    let res = await axios.get(`https://www.alphavantage.co/query?function=SMA&symbol=${ticker}&interval=daily&time_period=15&series_type=open&apikey=${avApiKey}`);
    if (res.data.hasOwnProperty('Note')) {
      return ('Cannot call api any longer');
    }
    result = res.data;
  }

  delete result['Meta Data'];

  res.status(200).send({
    data: result,
  });
});

// Get RSI
const mockRelativeStrengthIndex = {
  "Meta Data": {
    "1: Symbol": "AAPL",
    "2: Indicator": "Relative Strength Index (RSI)",
    "3: Last Refreshed": "2020-01-31",
    "4: Interval": "daily",
    "5: Time Period": 14,
    "6: Series Type": "open",
    "7: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: RSI": {
    "2020-01-31": {
        "RSI": "66.0421"
    },
    "2020-01-30": {
        "RSI": "65.7793"
    },
    "2020-01-29": {
        "RSI": "70.9318"
    },
    "2020-01-28": {
        "RSI": "62.7026"
    },
    "2020-01-27": {
        "RSI": "60.4756"
    },
    "2020-01-24": {
        "RSI": "77.7761"
    },
    "2020-01-23": {
        "RSI": "76.3389"
    },
    "2020-01-22": {
        "RSI": "77.6599"
    },
    "2020-01-21": {
        "RSI": "76.8774"
    },
    "2020-01-17": {
        "RSI": "76.3687"
    },
    "2020-01-16": {
        "RSI": "74.8734"
    },
    "2020-01-15": {
        "RSI": "73.8769"
    },
    "2020-01-14": {
        "RSI": "82.3278"
    },
    "2020-01-13": {
        "RSI": "80.1253"
    },
    "2020-01-10": {
        "RSI": "79.6411"
    },
    "2020-01-09": {
        "RSI": "78.0329"
    },
    "2020-01-08": {
        "RSI": "71.8513"
    },
    "2020-01-07": {
        "RSI": "77.2186"
    },
    "2020-01-06": {
        "RSI": "72.9891"
    },
    "2020-01-03": {
        "RSI": "80.7173"
    },
    "2020-01-02": {
        "RSI": "80.1898"
    },
    "2019-12-31": {
        "RSI": "75.9543"
    },
    "2019-12-30": {
        "RSI": "75.5934"
    },
    "2019-12-27": {
        "RSI": "79.5072"
    },
    "2019-12-26": {
        "RSI": "74.9337"
    },
    "2019-12-24": {
        "RSI": "74.8260"
    },
    "2019-12-23": {
        "RSI": "71.1435"
    },
    "2019-12-20": {
        "RSI": "75.3247"
    },
    "2019-12-19": {
        "RSI": "72.9545"
    },
    "2019-12-18": {
        "RSI": "73.6767"
    },
    "2019-12-17": {
        "RSI": "73.4898"
    },
    "2019-12-16": {
        "RSI": "71.3826"
    },
    "2019-12-13": {
        "RSI": "65.9677"
    },
    "2019-12-12": {
        "RSI": "61.4709"
    },
    "2019-12-11": {
        "RSI": "63.6569"
    },
    "2019-12-10": {
        "RSI": "63.4106"
    },
    "2019-12-09": {
        "RSI": "66.1879"
    },
    "2019-12-06": {
        "RSI": "63.5171"
    },
    "2019-12-05": {
        "RSI": "59.1273"
    },
    "2019-12-04": {
        "RSI": "55.4589"
    },
    "2019-12-03": {
        "RSI": "51.3443"
    },
    "2019-12-02": {
        "RSI": "71.1606"
    },
    "2019-11-29": {
        "RSI": "70.3665"
    },
    "2019-11-27": {
        "RSI": "69.1662"
    },
    "2019-11-26": {
        "RSI": "72.8179"
    },
    "2019-11-25": {
        "RSI": "67.9275"
    },
    "2019-11-22": {
        "RSI": "67.7748"
    },
    "2019-11-21": {
        "RSI": "70.6379"
    },
    "2019-11-20": {
        "RSI": "75.6273"
    },
    "2019-11-19": {
        "RSI": "82.5327"
    },
    "2019-11-18": {
        "RSI": "81.1073"
    },
    "2019-11-15": {
        "RSI": "79.5424"
    },
    "2019-11-14": {
        "RSI": "79.7450"
    },
    "2019-11-13": {
        "RSI": "77.7786"
    },
    "2019-11-12": {
        "RSI": "78.9190"
    },
    "2019-11-11": {
        "RSI": "76.4364"
    },
    "2019-11-08": {
        "RSI": "77.4528"
    },
    "2019-11-07": {
        "RSI": "77.5756"
    },
    "2019-11-06": {
        "RSI": "76.1947"
    },
    "2019-11-05": {
        "RSI": "76.8191"
    },
    "2019-11-04": {
        "RSI": "77.4080"
    },
    "2019-11-01": {
        "RSI": "71.8282"
    },
    "2019-10-31": {
        "RSI": "69.7821"
    },
    "2019-10-30": {
        "RSI": "67.4123"
    },
    "2019-10-29": {
        "RSI": "76.9214"
    },
    "2019-10-28": {
        "RSI": "75.7521"
    },
    "2019-10-25": {
        "RSI": "72.1510"
    },
    "2019-10-24": {
        "RSI": "75.4482"
    },
    "2019-10-23": {
        "RSI": "73.4358"
    },
    "2019-10-22": {
        "RSI": "72.6231"
    },
    "2019-10-21": {
        "RSI": "69.2392"
    },
    "2019-10-18": {
        "RSI": "66.1080"
    },
    "2019-10-17": {
        "RSI": "67.1918"
    },
    "2019-10-16": {
        "RSI": "65.3788"
    },
    "2019-10-15": {
        "RSI": "71.8527"
    },
    "2019-10-14": {
        "RSI": "70.5151"
    },
    "2019-10-11": {
        "RSI": "68.7080"
    },
    "2019-10-10": {
        "RSI": "63.3363"
    },
    "2019-10-09": {
        "RSI": "62.2578"
    },
    "2019-10-08": {
        "RSI": "60.8188"
    },
    "2019-10-07": {
        "RSI": "61.6302"
    },
    "2019-10-04": {
        "RSI": "60.9530"
    },
    "2019-10-03": {
        "RSI": "51.9376"
    },
    "2019-10-02": {
        "RSI": "60.2298"
    },
    "2019-10-01": {
        "RSI": "64.3728"
    },
    "2019-09-30": {
        "RSI": "58.9305"
    },
    "2019-09-27": {
        "RSI": "58.4214"
    },
    "2019-09-26": {
        "RSI": "57.6908"
    },
    "2019-09-25": {
        "RSI": "55.7522"
    },
    "2019-09-24": {
        "RSI": "60.1752"
    },
    "2019-09-23": {
        "RSI": "57.5472"
    },
    "2019-09-20": {
        "RSI": "61.9278"
    },
    "2019-09-19": {
        "RSI": "63.0838"
    },
    "2019-09-18": {
        "RSI": "62.0930"
    },
    "2019-09-17": {
        "RSI": "60.9665"
    },
    "2019-09-16": {
        "RSI": "58.6536"
    },
    "2019-09-13": {
        "RSI": "62.1336"
    },
    "2019-09-12": {
        "RSI": "70.3265"
    },
    "2019-09-11": {
        "RSI": "64.1767"
    },
    "2019-09-10": {
        "RSI": "59.2738"
    },
    "2019-09-09": {
        "RSI": "61.0807"
    },
    "2019-09-06": {
        "RSI": "60.1719"
    },
    "2019-09-05": {
        "RSI": "57.7972"
    },
    "2019-09-04": {
        "RSI": "53.2381"
    },
    "2019-09-03": {
        "RSI": "50.5446"
    },
    "2019-08-30": {
        "RSI": "56.2724"
    },
    "2019-08-29": {
        "RSI": "54.1240"
    },
    "2019-08-28": {
        "RSI": "47.8133"
    },
    "2019-08-27": {
        "RSI": "53.6718"
    },
    "2019-08-26": {
        "RSI": "50.6874"
    },
    "2019-08-23": {
        "RSI": "56.7465"
    },
    "2019-08-22": {
        "RSI": "64.2587"
    },
    "2019-08-21": {
        "RSI": "64.0235"
    },
    "2019-08-20": {
        "RSI": "61.5439"
    },
    "2019-08-19": {
        "RSI": "61.2383"
    },
    "2019-08-16": {
        "RSI": "52.7307"
    },
    "2019-08-15": {
        "RSI": "51.4509"
    },
    "2019-08-14": {
        "RSI": "51.0003"
    },
    "2019-08-13": {
        "RSI": "47.7900"
    },
    "2019-08-12": {
        "RSI": "45.6259"
    },
    "2019-08-09": {
        "RSI": "47.8353"
    },
    "2019-08-08": {
        "RSI": "46.2529"
    },
    "2019-08-07": {
        "RSI": "38.7390"
    },
    "2019-08-06": {
        "RSI": "39.7075"
    },
    "2019-08-05": {
        "RSI": "41.5062"
    },
    "2019-08-02": {
        "RSI": "51.1652"
    },
    "2019-08-01": {
        "RSI": "67.3119"
    },
    "2019-07-31": {
        "RSI": "73.8252"
    },
    "2019-07-30": {
        "RSI": "63.9901"
    },
    "2019-07-29": {
        "RSI": "63.4913"
    },
    "2019-07-26": {
        "RSI": "61.8897"
    },
    "2019-07-25": {
        "RSI": "65.7427"
    },
    "2019-07-24": {
        "RSI": "63.9390"
    },
    "2019-07-23": {
        "RSI": "66.0294"
    },
    "2019-07-22": {
        "RSI": "58.3262"
    },
    "2019-07-19": {
        "RSI": "64.3551"
    },
    "2019-07-18": {
        "RSI": "61.2436"
    },
    "2019-07-17": {
        "RSI": "61.3826"
    },
    "2019-07-16": {
        "RSI": "62.8120"
    },
    "2019-07-15": {
        "RSI": "62.0522"
    },
    "2019-07-12": {
        "RSI": "59.5341"
    },
    "2019-07-11": {
        "RSI": "61.5220"
    },
    "2019-07-10": {
        "RSI": "59.3840"
    },
    "2019-07-09": {
        "RSI": "55.1876"
    },
    "2019-07-08": {
        "RSI": "58.6035"
    },
    "2019-07-05": {
        "RSI": "64.4473"
    },
    "2019-07-03": {
        "RSI": "64.3563"
    },
    "2019-07-02": {
        "RSI": "61.9410"
    },
    "2019-07-01": {
        "RSI": "65.8401"
    },
    "2019-06-28": {
        "RSI": "59.8534"
    },
    "2019-06-27": {
        "RSI": "63.5625"
    },
    "2019-06-26": {
        "RSI": "59.9558"
    },
    "2019-06-25": {
        "RSI": "61.4347"
    },
    "2019-06-24": {
        "RSI": "61.6701"
    },
  }
};
alphaVantageRouter.get('/RelativeStrengthIndex/:ticker', async (req, res) => {
  let result;
  if (yargs.hasOwnProperty('M')) {
    result = cloneDeep(mockRelativeStrengthIndex);
  }
  else {
    const ticker = req.params.ticker.toUpperCase();
    let res = await axios.get(`https://www.alphavantage.co/query?function=RSI&symbol=${ticker}&interval=daily&time_period=14&series_type=open&apikey=${avApiKey}`);
    if (res.data.hasOwnProperty('Note')) {
      return ('Cannot call api any longer');
    }
    result = res.data;
  }

  delete result['Meta Data'];

  res.status(200).send({
    data: result,
  });
})


module.exports = alphaVantageRouter;