/* global io */

angular.module('StocksRockApp', [])

    .controller('index', ['$scope', 'stock', function($scope, stock) {
        $scope.stocks = [{ symbol: "Loading...", name: "Loading..."}];
        $scope.socket = io();
        $scope.help = false;
        // CLEAR HELP IF WARNING CLOSED
        $scope.closeHelp = function() {
            $scope.help = false;
        };
        // GET NAMES OF STOCKS IN DB
        stock.getStock().success(function(data) {
         $scope.stocks = data;
        });
        // ADD STOCK FUNCTION
        $scope.addStock = function() {
         var newStock = $scope.newStock.toUpperCase();
         var length = $scope.stocks.length;
         // check if stock symbol already exists
         for (var i = 0; i < length; i++) {
             if (newStock == $scope.stocks[i].symbol) {
                 $scope.help = "This stock symbol already exists";
                 return;
             }
         }
         // doesn't exist so try to add
         stock.addStock(newStock).success(function(data) {
             $scope.stockName = data.name;
             $scope.stockData = data.historic;
             // emit the message that we have added a new stock item
             $scope.socket.emit('messages', { symbol: data.name.symbol, name: data.name.name });
             $scope.help = false;
         });
         stock.addStock(newStock).error(function(error) {
             $scope.stockName = error;
             $scope.stockData = error;
         });
        };
        // DO SOMETHING WHEN DATA EMITTED FROM SERVER
        $scope.socket.on('messages', function (data) {
            $scope.$apply(function() {
                $scope.stocks.push({ symbol: data.symbol, name: data.name });
            });
        });
    }]);