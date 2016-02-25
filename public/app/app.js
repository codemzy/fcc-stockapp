/* global io */

angular.module('StocksRockApp', [])

    .controller('index', function($scope) {
     $scope.stocks = [{ title: "Test 1"}, { title: "Test 2"}];
     $scope.socket = io();

     // ADD STOCK FUNCTION
     $scope.addStock = function() {
         var stock = $scope.newStock;
         $scope.socket.emit('messages', stock);
     };
     // DO SOMETHING WHEN DATA EMITTED FROM SERVER
     $scope.socket.on('messages', function (data) {
         console.log("message recieved");
        $scope.$apply(function() {
            $scope.stocks.push({ title: data });
        });
     });
    });