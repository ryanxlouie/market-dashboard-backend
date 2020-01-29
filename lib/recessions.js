// Array of all the United States Recessions
const recessionArray = [
  ['1929', 0.67, '1933', 0.25],
  ['1937', 0.42, '1938', 0.5],
  ['1945', 0.17, '1945', 0.83],
  ['1948', 0.92, '1949', 0.83],
  ['1953', 0.58, '1954', 0.42],
  ['1957', 0.67, '1958', 0.33],
  ['1960', 0.33, '1961', 0.17],
  ['1970', 0, '1970', 0.92],
  ['1973', 0.92, '1975', 0.25],
  ['1980', 0, '1980', 0.58],
  ['1981', 0.58, '1982', 0.92],
  ['1990', 0.58, '1991', 0.25],
  ['2001', 0.25, '2001', 0.92],
  ['2007', 0, '2009', 0.5],
];

// Returns the plot bands for a given xAxis
function recessionPlotBands (xAxis) {
  let returnData = [];

  for (let a = 0; a < recessionArray.length; a += 1) {
    if (xAxis.indexOf(recessionArray[a][0]) >= 0 && xAxis.indexOf(recessionArray[a][2]) >= 0) {
      returnData.push({
        color: '#ffcccc',
        from: xAxis.indexOf(recessionArray[a][0]) + recessionArray[a][1],
        to: xAxis.indexOf(recessionArray[a][2]) + recessionArray[a][3],
      });
    }
  }
  return returnData
}

module.exports = {
  recessionArray,
  recessionPlotBands,
}