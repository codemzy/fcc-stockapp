angular.module('StocksRockApp')
.factory('stock', ['$http', function($http) {
  // add the stock and get the data
  this.addStock = function(stock) {
    return $http.get('/api/stock/new/' + stock)
              .success(function(data) {
                return data;
              })
              .error(function(err) {
                return err;
              });
  };
  return this;
}]);