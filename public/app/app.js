/* global io */

angular.module('StocksRockApp', [])

    .controller('index', ['$scope', 'stock', function($scope, stock) {
     $scope.stocks = [{ title: "Test 1"}, { title: "Test 2"}];
     $scope.socket = io();

     // ADD STOCK FUNCTION
     $scope.addStock = function() {
         var newStock = $scope.newStock;
         stock.addStock(newStock).success(function(data) {
             $scope.stockName = data.name;
             $scope.stockData = data.historic;
             $scope.socket.emit('messages', newStock);
         });
         stock.addStock(newStock).error(function(error) {
             $scope.stockName = error;
             $scope.stockData = error;
         });
     };
     // DO SOMETHING WHEN DATA EMITTED FROM SERVER
     $scope.socket.on('messages', function (data) {
         console.log("message recieved");
        $scope.$apply(function() {
            $scope.stocks.push({ title: data });
        });
     });
    }]);