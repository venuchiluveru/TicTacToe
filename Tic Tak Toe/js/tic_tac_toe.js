myApp.controller('gameController', 
                              ['$scope','GameDataService', function($scope, GameDataService) { 
  var player1 = 'X';
  var player2 = 'O';
  var played = null;
  $scope.currentPlayer = player1;  
  $scope.newSize = 4;
  $scope.newNumberToWin = 4;
  $scope.playerone = "Player 1"
  $scope.playertwo = "Player 2"
  $scope.currentPlayerName = $scope.playerone
  $scope.scoreOne = 0;
  $scope.scoreTwo = 0;
  $scope.updated = 0;
  $scope.moveCount = 0;


  var scores = localStorage.getItem('scores')
  if (scores){
    scores = JSON.parse(scores);
    $scope.scoreOne = scores["one"];
    $scope.scoreTwo = scores["two"];
  }
  
  
  var initData = function() {
    played = []; 
    $scope.winner = null;  
    $scope.draw = null;
    $scope.boardsize =  $scope.newSize; 
    $scope.numberToWin = $scope.newNumberToWin;
    $scope.board = GameDataService.getBoardBySize($scope.boardsize);
    $scope.updated = 0;
    $scope.moveCount = 0;
  };
                                
  var evaluateTurn = function() { 
    var movesByPlayer = _.filter(played, { 'player': $scope.currentPlayer });
    if (movesByPlayer.length < $scope.numberToWin) {
      return;
    }
    
    var diagonalDownCount = 0;
    var diagonalUpCount = 0;

    for (var i = 0; i < $scope.numberToWin; i++) {
      var rowCount = 0;
      var colCount = 0;
      var diagonalUpIndex = $scope.numberToWin - 1 - i;
      
      angular.forEach(movesByPlayer, function(move) {
        if (move.row === i && move.col === i) {
          diagonalDownCount += 1; 
        }
        if (move.row === diagonalUpIndex && move.col === i) {
          diagonalUpCount += 1; 
        }  
        if (move.row === i) {
          rowCount += 1; 
        }
        if (move.col === i) {
          colCount += 1; 
        }  
        if (diagonalUpCount === $scope.numberToWin 
            || diagonalDownCount === $scope.numberToWin 
            || colCount === $scope.numberToWin 
            || rowCount === $scope.numberToWin) {

          $scope.winner = $scope.currentPlayer;
          var scoreTwo = 0;
          var scoreOne = 0;
          oldScores = localStorage.getItem('scores')
          if (oldScores){
            oldScores = JSON.parse(oldScores);
            scoreOne = oldScores["one"];
            scoreTwo = oldScores["two"];
          }
          if ($scope.updated == 0){
            if ($scope.currentPlayer == 'X') scoreOne++;
            else scoreTwo++;
            $scope.updated = 1;
          }
          localStorage.setItem('scores',JSON.stringify({'one':scoreOne, 'two':scoreTwo}))
          return;
        }
      });              
   } 
    
    if (played.length === ($scope.boardsize * $scope.boardsize)) {
      $scope.draw = true;
    }
  };
  
  var changePlayer = function() {
    if($scope.currentPlayer === player1){
      $scope.currentPlayerName = $scope.playertwo;
      $scope.currentPlayer = player2;
    }
    else{
      $scope.currentPlayerName = $scope.playerone;
      $scope.currentPlayer = player1;           
    }
  };

  $scope.reset = function() {
    localStorage.setItem('scores', JSON.stringify({'one':0,'two':0}));
    $scope.scoreOne = 0;
    $scope.scoreTwo = 0;
  }
  
  $scope.playTurn = function($event, positionInfo) {       
    $scope.errors = null;    
    
    if ($scope.winner) {            
      return;
    }
    
    if (positionInfo.player !== null) {
      return;
    }      

    positionInfo.player = $scope.currentPlayer;
    played.push(positionInfo); 
    evaluateTurn();   
    $scope.moveCount++
    if (!$scope.winner && ($scope.moveCount == 0 || $scope.moveCount ==2)) { 
      $scope.moveCount = 0;
      changePlayer();  
    } 
  };  
  
  $scope.startGame = function() {  
    $scope.errors = null;
    initData();
    var scores = localStorage.getItem('scores')
    if (scores){
      scores = JSON.parse(scores);
      $scope.scoreOne = scores["one"];
      $scope.scoreTwo = scores["two"];
    }
  };    
  
  initData();
  
}]);


