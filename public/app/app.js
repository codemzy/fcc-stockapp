/* global io */

angular.module('StocksRockApp', [])

    .controller('index', ['$scope', 'stock', function($scope, stock) {
        $scope.stocks = [{ symbol: "Loading...", name: "Loading..."}];
        $scope.socket = io();
        // GET NAMES OF STOCKS IN DB
        stock.getStock().success(function(data) {
         $scope.stocks = data;
        });
        // ADD STOCK FUNCTION
        $scope.addStock = function() {
         var newStock = $scope.newStock;
         stock.addStock(newStock).success(function(data) {
             $scope.stockName = data.name;
             $scope.stockData = data.historic;
             $scope.socket.emit('messages', { symbol: data.name.symbol, name: data.name.name });
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