/* global io */

angular.module('StocksRockApp', [])

    .controller('index', ['$scope', 'stock', function($scope, stock) {
        $scope.stocks = [{ symbol: "Loading...", name: "Loading..."}];
        $scope.socket = io();
        $scope.help = false;
        $scope.stockData = [];
        // CLEAR HELP IF WARNING CLOSED
        $scope.closeHelp = function() {
            $scope.help = false;
        };
        // SET UP THE THE CHART
        var chartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: []
        };
        // GET NAMES OF STOCKS IN DB
        stock.getStock().success(function(data) {
         $scope.stocks = data.name;
         for (var key in data.data) {
             var colour = randomColor();
             var arrData = [];
             var dataLength = data.data[key].length;
             for (var i = 0; i < dataLength; i++) {
                 arrData.push(parseInt(data.data[key][i].close, 10));
             }
             var obj = {
                label: data.data[key][0].symbol,
                fillColor: "rgba(" + colour + ",0.2)",
                strokeColor: "rgba(" + colour + ",1)",
                pointColor: "rgba(" + colour + ",1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                data: arrData
             };
             $scope.stockData.push(obj);
             chartData.datasets.push(obj);
         }
        var ctx = document.getElementById("stockChart").getContext("2d");
        var stocksRockChart = new Chart(ctx).Line(chartData, options);
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
             // emit the message that we have added a new stock item
             $scope.socket.emit('messages', { symbol: data.name.symbol, name: data.name.name, data: data.historic });
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
                $scope.stockData[data.symbol] = data.data;
            });
        });
        // RANDOM COLOR GENERATOR
        var randomColor = function() {
            var red = Math.floor(((Math.random()*256) + 255) / 2);
            var green = Math.floor(((Math.random()*256) + 255) / 2);
            var blue = Math.floor(((Math.random()*256) + 255) / 2);
            return red + "," + green + "," + blue;
        };
        // CHART OPTIONS
        var options = {
            showScale: true,
            scaleOverride: false,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            scaleIntegersOnly: true,
            scaleBeginAtZero: false,
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve : true,
            bezierCurveTension : 0.4,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true,
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
            responsive: true,
            maintainAspectRatio: false
        };
    }]);