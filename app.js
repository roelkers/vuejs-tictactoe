Vue.component('field', {
  props: ['marker'],
  template: `<div class="field"
v-on:click="$emit('add-marker')">
  <h2>{{ marker }}</h2>
</div`
})


var app = new Vue({
  el: '#app',
  data: {
    gameEnded: false,
    message:"",
    userMarker:'',
    oppMarker:'',
    userDoesStart:true,
    board: [
      "","","","","","","","",""
    ]
  },
  methods: {
    determineOppMarker : function (){
      if(this.userMarker==="x")
        this.oppMarker="o";
      else
        this.oppMarker="x";
    },
    markField : function(index){
      if(this.board[index]===""){
        Vue.set(this.board, index, this.userMarker);
        this.updateGameLogic();
      }
    },
    updateGameLogic: function() {
      let userWon = this.checkGameEnd(this.userMarker);
      if(userWon===true){
        this.message="You won!";
        this.gameEnded = true;
        return;
      }
      if(!this.movesStillLeft()){
        this.message="It's a draw!";
        this.gameEnded = true;
        return;
      }
      this.opponentsTurn();
      let oppWon = this.checkGameEnd(this.oppMarker);
      if(oppWon===true){
        this.message="Opponent won!";
        this.gameEnded=true;
        return;
      }
      if(!this.movesStillLeft()){
        this.message="It's a draw!";
        this.gameEnded = true;
        return;
      }
    },
    movesStillLeft: function(){
      for(let i=0;i<9;i++){
        if(this.board[i]===""){
          return true;
        }
      }
      return false;
    },
    checkGameEnd: function(marker){
     return(this.checkRows(marker) || this.checkColumns(marker) || this.checkDiagonals(marker))
    },
    checkRows: function(marker){
      for(let i=0; i<=2; i++){
        if(this.board[3*i]===marker &&
           this.board[3*i+1]===marker &&
           this.board[3*i+2]===marker)
          return true;
      }
      return false;
    },
    checkColumns: function(marker){
      for(let i=0; i<=2; i++){
        if(this.board[i]===marker &&
           this.board[i+3]===marker &&
           this.board[i+6]===marker)
          return true;
      }
      return false;
    },
    checkDiagonals: function(marker){
      return(this.board[0]===marker &&
           (this.board[4]===marker &&
           this.board[8]===marker)
           || (this.board[2]===marker &&
           this.board[4]===marker &&
           this.board[6]===marker));
    },
    startNewGame: function(){
      if(this.gameEnded){
        for(let i=0; i<9; i++){
          Vue.set(this.board, i, "");
        }
        this.UserDoesStart = !this.UserDoesStart;
        console.log(this.UserDoesStart);
        if(!this.UserDoesStart){
          this.opponentsTurn();
        }
        this.message="";
        this.gameEnded=false;
      }
    },
    opponentsTurn: function(){
      let bestMove = this.findBestMove();
      Vue.set(this.board, bestMove, this.oppMarker);
    },
    findBestMove: function(){
      let val;
      let bestVal = -1000;
      let bestMove = null;
      for(let i=0; i<9; i++){
        val=0;
        if(this.board[i]===""){
          //Make move
          Vue.set(this.board,i,this.oppMarker);
          val = this.minimax(0,false);
          if (val>bestVal){
            bestMove = i;
            bestVal = val;
          }
          //undo the move
          Vue.set(this.board,i,"");
        }
      }
      return bestMove;
    },
    minimax: function(depth,isMax){
      let score = this.evaluateBoard();
      if(score===10){
        return score-depth;
      }
      if(score===-10){
        return score+depth;
      }
      if(!this.movesStillLeft()){
        return 0;
      }
      if(isMax){
        let  best = -1000;
        for(let i=0; i<9; i++){
          if(this.board[i]===""){
            Vue.set(this.board,i,this.oppMarker);
            best = Math.max(best,this.minimax(depth+1,!isMax));
            //undo the move
            Vue.set(this.board,i,"");
          }
        }
      return best;
      }
      else{
        let best = 1000;
        for(let i=0; i<9; i++){
          if(this.board[i]===""){
            Vue.set(this.board,i,this.userMarker);
            best = Math.min(best,this.minimax(depth+1,!isMax));
            //undo the move
            Vue.set(this.board,i,"");
          }
        }
      return best;
      }
    },
    evaluateBoard: function(){
      if(this.checkGameEnd(this.oppMarker))
        return 10;
      else if(this.checkGameEnd(this.userMarker))
        return -10;
      else
        return 0;
    }
  }
})
