const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routers
const testRouter = require('./routes/testRoutes');
const yahooFinanceRouter = require('./routes/yahooFinance');

app.use('/testRoutes', testRouter);
app.use('/yahooFinanceRoutes', yahooFinanceRouter);

app.listen('5000', () => {
  console.log('Server running on port 5000');
});