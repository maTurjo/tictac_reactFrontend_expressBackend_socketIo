interface IndividualConnection{
    userId:string,
    userName:string
}
interface ActiveGame{
    player1:IndividualConnection,
    player2:IndividualConnection,
    gameId:string,
    turn:string,
    gameMatrix:string[][],
    winner:IndividualConnection
    player1WinCount:number,
    player2WinCount:number

  }

const determineWinner=({gameMatrix,player1,player2,player1WinCount,player2WinCount}:ActiveGame)=>{

    const player1mark="0";
    const player2mark="X";

    let winner="";
    let winConnection:IndividualConnection;

    // player 1 winning logic

    // 0,0,0
    if(gameMatrix[0][0]=== player1mark && gameMatrix[0][1]===player1mark && gameMatrix[0][2]===player1mark) winner="player1"
    if(gameMatrix[1][0]=== player1mark && gameMatrix[1][1]===player1mark && gameMatrix[1][2]===player1mark) winner="player1"
    if(gameMatrix[2][0]=== player1mark && gameMatrix[2][1]===player1mark && gameMatrix[2][2]===player1mark) winner="player1"

    // 0
    // 0
    // 0
    if(gameMatrix[0][0]=== player1mark && gameMatrix[1][0]===player1mark && gameMatrix[2][0]===player1mark) winner="player1"
    if(gameMatrix[0][1]=== player1mark && gameMatrix[1][1]===player1mark && gameMatrix[2][1]===player1mark) winner="player1"
    if(gameMatrix[0][2]=== player1mark && gameMatrix[1][2]===player1mark && gameMatrix[2][2]===player1mark) winner="player1"

    // diagonal
    if(gameMatrix[0][0]=== player1mark && gameMatrix[1][1]===player1mark && gameMatrix[2][2]===player1mark) winner="player1"
    if(gameMatrix[0][2]=== player1mark && gameMatrix[1][1]===player1mark && gameMatrix[2][0]===player1mark) winner="player1"

    // player 2 winning logic

    // 0,0,0
    if(gameMatrix[0][0]=== player2mark && gameMatrix[0][1]===player2mark && gameMatrix[0][2]===player2mark) winner="player2"
    if(gameMatrix[1][0]=== player2mark && gameMatrix[1][1]===player2mark && gameMatrix[1][2]===player2mark) winner="player2"
    if(gameMatrix[2][0]=== player2mark && gameMatrix[2][1]===player2mark && gameMatrix[2][2]===player2mark) winner="player2"

    // 0
    // 0
    // 0
    if(gameMatrix[0][0]=== player2mark && gameMatrix[1][0]===player2mark && gameMatrix[2][0]===player2mark) winner="player2"
    if(gameMatrix[0][1]=== player2mark && gameMatrix[1][1]===player2mark && gameMatrix[2][1]===player2mark) winner="player2"
    if(gameMatrix[0][2]=== player2mark && gameMatrix[1][2]===player2mark && gameMatrix[2][2]===player2mark) winner="player2"

    // diagonal
    if(gameMatrix[0][0]=== player2mark && gameMatrix[1][1]===player2mark && gameMatrix[2][2]===player2mark) winner="player2"
    if(gameMatrix[0][2]=== player2mark && gameMatrix[1][1]===player2mark && gameMatrix[2][0]===player2mark) winner="player2"

    if(winner==="player1"){
        winConnection=player1
        player1WinCount++;
    }
    else if(winner==="player2"){
        winConnection=player2
        player2WinCount++;
    }
    return {winConnection,player1WinCount,player2WinCount};
}

export default determineWinner;