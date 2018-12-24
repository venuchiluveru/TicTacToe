var myApp = angular.module('myApp', ['ngCookies','ngRoute']);


myApp.factory('GameDataService', function() {
  var service = {};

  var createBoard = function(boardsize) {
    var data = [];
      for (var i = 0; i < boardsize; i++) {
        for (var j = 0; j < boardsize; j++) {
          data.push({'row':i, 'col': j, 'player': null});
        }
      }
    return data;
  };
  
  service.getDefaultBoard = function() {
    return createBoard(3);
  };  
  
  service.getBoardBySize = function(boardsize) {
    return createBoard(boardsize);
  };
  
  return service;
});


myApp.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/templates/login.html',
            controller: 'Login'
        })
        .when('/game', {
            templateUrl: '/templates/tic_tac_toe.html',
            controller: 'gameController'
        })
        .otherwise({
            redirectTo: '/login'
        });
});


myApp.controller('Login', ['$scope', '$cookies', '$window', '$http', '$location' , function ($scope, $cookies, $window, $http, $location) {
    $scope.email = '';
    $scope.password = '';
    $scope.isLoginPageVisible = true;

    var session = $cookies.get("session");

    var hours = new Date().getHours();
    var expiredTime = hours + 1;

    if (session) {
            $scope.isLoginPageVisible = (session >= hours) ? false : true;
            if (!$scope.isLoginPageVisible){
                $location.url('/game');
            }
    }

    $scope.onSubmitButtonClick = function () {
        hours = new Date().getHours();
        expiredTime = hours + 1;
        $cookies.put("session", hours);

        $http.get('userdata.json').then(function (response) {
            $scope.data = response.data;

            var validateData = $scope.data.values.map((user) => {
                if ((user.email === $scope.email) && (user.password == $scope.password)){
                    return true;
                }
            });

            if (validateData)
                $location.url('/game');
                $scope.isLoginPageVisible = false;
        });
    }


}]);