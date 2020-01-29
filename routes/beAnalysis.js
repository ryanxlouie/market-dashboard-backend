const express = require('express');
const { cloneDeep } = require('lodash');
const { recessionArray } = require('../lib/recessions');

const beAnalysisRouter = express.Router();

// GDP of the Unites States and some metrics
// Have to use mock data because getting some weird axios error
const mockGDPAnalysis =  [
  {
    CL_UNIT:"Level",
    DataValue:"104,556",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1929",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"92,160",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1930",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"77,391",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1931",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"59,522",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1932",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"57,154",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1933",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"66,800",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1934",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"74,241",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1935",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"84,830",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1936",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"93,003",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1937",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"87,352",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1938",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"93,437",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1939",
    UNIT_MULT:"6",
  },
  {
    CL_UNIT:"Level",
    DataValue:"102,899",
    LineDescription:"Gross domestic product",
    LineNumber:"1",
    METRIC_NAME:"Current Dollars",
    SeriesCode:"A191RC",
    TableName:"T10105",
    TimePeriod:"1940",
    UNIT_MULT:"6",
  }
];
beAnalysisRouter.get('/GDPAnalysis', async (req, res) => {
  const returnObject = {};
  const gdpArray = [];
  const metricsObject = {};

  let result = cloneDeep(mockGDPAnalysis);

  // Sort the result for the correct series code
  for (let a = 0; a < result.length; a += 1) {
    if (result[a]['SeriesCode'] === 'A191RC') {
      let temp = result[a];
      temp['DataValue'] = parseInt(result[a]['DataValue'].replace(/,/g, ''), 10);
      gdpArray.push(temp);
    }
    else {
      break;
    }
  }

  // Sort by year
  gdpArray.sort((a,b) => {
    return (parseInt(a['TimePeriod'], 10) - parseInt(b['TimePeriod'], 10))
  });

  // Metrics Add on
  const dateArray = gdpArray.map(x => x['TimePeriod']);

  // Average drop in a recession
  const recessionResult = [];
  for (let a = 0; a < recessionArray.length; a += 1) {
    const startIndex = dateArray.indexOf(recessionArray[a][0]);
    const endIndex = dateArray.indexOf(recessionArray[a][2]);
    if ( startIndex >= 0 && endIndex >= 0) {
      const startValue = gdpArray[startIndex]['DataValue'] - (gdpArray[startIndex]['DataValue'] - gdpArray[startIndex+1]['DataValue'])*recessionArray[a][1];
      const endValue = gdpArray[endIndex]['DataValue'] - (gdpArray[endIndex]['DataValue'] - gdpArray[endIndex+1]['DataValue'])*recessionArray[a][3];
      recessionResult.push((startValue - endValue) / startValue);
    } 
    else {
      break;
    }
  }
  metricsObject['Average Loss in Recession'] = recessionResult.reduce((acc, current) => acc + current) / recessionResult.length;

  // Average gain in a expansion
  const expansionResult = [];
  for (let a = 0; a < recessionArray.length-1; a += 1) {
    const startIndex = dateArray.indexOf(recessionArray[a][2]);
    const endIndex = dateArray.indexOf(recessionArray[a+1][0]);
    if (startIndex >= 0 && endIndex >= 0) {
      const startValue = gdpArray[startIndex]['DataValue'] + (gdpArray[startIndex+1]['DataValue'] - gdpArray[startIndex]['DataValue'])*recessionArray[a][3];
      const endValue = gdpArray[endIndex]['DataValue'] - (gdpArray[endIndex]['DataValue'] - gdpArray[endIndex+1]['DataValue'])*recessionArray[a+1][1];
      expansionResult.push((endValue - startValue) / startValue);
    }
  }
  metricsObject['Average Gain in Expansion'] = expansionResult.reduce((acc, current) => acc + current) / expansionResult.length;

  // Average time in a recession
  let recessionCount = 0;
  let recessionDivs = 0;
  for (let a = 0; a < recessionArray.length; a += 1) {
    const startIndex = dateArray.indexOf(recessionArray[a][0]);
    const endIndex = dateArray.indexOf(recessionArray[a][2]);
    if (startIndex >= 0 && endIndex >= 0) {
      const start = parseInt(recessionArray[a][0], 10) + recessionArray[a][1];
      const end = parseInt(recessionArray[a][2], 10) + recessionArray[a][3];
      recessionCount += end - start;
      recessionDivs++;
    }
    else {
      break;
    }
  }
  metricsObject['Average Time in Recession'] = recessionCount/recessionDivs;

  // Average time between recessions
  let expansionCount = 0;
  let expansionDivs = 0;
  for (let a = 0; a < recessionArray.length - 1; a += 1) {
    const startIndex = dateArray.indexOf(recessionArray[a][2]);
    const endIndex = dateArray.indexOf(recessionArray[a+1][0]);
    if (startIndex >= 0 && endIndex >= 0) {
      const start = parseInt(recessionArray[a][2], 10) + recessionArray[a][3];
      const end = parseInt(recessionArray[a+1][0], 10) + recessionArray[a+1][1];
      expansionCount += end - start;
      expansionDivs++;
    }
    else {
      break;
    }
  }
  metricsObject['Average Time in Expansion'] = expansionCount/expansionDivs;

  returnObject['GDP Data'] = gdpArray;
  returnObject['Metrics'] = metricsObject
  res.status(200).send({
    data: returnObject,
  });
});

module.exports = beAnalysisRouter;