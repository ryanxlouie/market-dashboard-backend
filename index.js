const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routers
const testRouter = require('./routes/testRoutes');
const yahooFinanceRouter = require('./routes/yahooFinance');
const alphaVantageRouter = require('./routes/alphaVantage');
const beAnalysisRouter = require('./routes/beAnalysis');

app.use('/testRoutes', testRouter);
app.use('/yahooFinanceRoutes', yahooFinanceRouter);
app.use('/alphaVantageRoutes', alphaVantageRouter);
app.use('/beAnalysisRoutes', beAnalysisRouter);

app.listen('5000', () => {
  console.log('Server running on port 5000');
});