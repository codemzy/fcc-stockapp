var yahooFinance = require('yahoo-finance');

module.exports = function (app) {
    
    // homepage
    app.route('/')
        .get(function (req, res) {
    		res.sendFile(process.cwd() + '/public/app/index.html');
        });
    
    // api to get stock data
    app.route('/api/stocks/:id')
        .get(function (req, res) {
            yahooFinance.historical({
              symbol: 'AAPL',
              from: '2012-01-01',
              to: '2012-12-31',
              period: 'm'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
            }, function (err, quotes) {
              if (err) {
                  res.json({ "error": "No data found" });
              } else {
                  res.json(quotes);
              }
            });
        });
    
};