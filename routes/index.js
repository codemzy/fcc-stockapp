var yahooFinance = require('yahoo-finance');

module.exports = function (app, db) {
    
    // homepage
    app.route('/')
        .get(function (req, res) {
    		res.sendFile(process.cwd() + '/public/app/index.html');
        });
    
    // api to get stock names based on stocks saved in the db
    app.route('/api/stock/names')
        .get(function (req, res) {
            db.collection('stock').find({}, {"_id": 0, "symbol": 1, "name": 1}).toArray(function(err, stocks) {
                if (err) {
                    res.status(500).send('Not found!');
                } else {
                    // respond with all stocks names and data
                    res.json(stocks);
                }
            });
        });
    
    // api to add new stock and get stock data
    app.route('/api/stock/new/:id')
        .get(function (req, res) {
            var stockName = req.params.id;
            
        // get the snapshot for the name         
        yahooFinance.snapshot({
          symbol: stockName,
          fields: ['s', 'n']  // ex: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
        }, function (err, snapshot) {
            if (err) {
                res.status(500).send('Not found!');
            } else if (!snapshot.name) {
                res.status(500).send('Not found!');
            } else {
                // get the historic data for the year
                yahooFinance.historical({
                  symbol: stockName,
                  from: '2012-01-01',
                  to: '2012-12-31',
                  period: 'm'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
                }, function (err, quotes) {
                  if (err) {
                      res.status(500).send('Not found!');
                  } else {
                      // TO DO add the stock name to the database
                      
                      // respond with the data
                      res.json({ name: snapshot, historic: quotes });
                  }
                });
                
            }
        });
            
            
        });
        
    // next route
    
};