import { Ship } from "./ship";

interface GameUser {
  userName: string;
  userId: number | string;
  userBoard: boolean[][];
  hasShotAt: boolean[][];
  userShips: Ship[];
  aliveShips: number;
  isReady: boolean;
  userWs: WebSocket;
}

export interface Game {
  gameId: number | string;
  gameUsers: GameUser[];
  currentPlayer: number | string;
}
