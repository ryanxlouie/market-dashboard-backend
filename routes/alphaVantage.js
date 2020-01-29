const express = require('express');
const axios = require('axios');
const { cloneDeep } = require('lodash');
const yargs = require('yargs').argv;
const { avApiKey } = require('../config');

const alphaVantageRouter = express.Router();

// Gets the daily prices for a set time range
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


module.exports = alphaVantageRouter;