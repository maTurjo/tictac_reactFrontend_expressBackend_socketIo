export interface gameData {
    player1: player;
    player2: player;
    gameid: string;
    turn: string;
    gameMatrix: Array<Array<string>>;
    winner:player;
    player1WinCount:number;
    player2WinCount:number;
  }

export  interface player{
    userId:string,
    userName:string
  }
  