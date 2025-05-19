import { AddShipsData } from "../types/data.js";
import { DB } from "../db/db";
import { Ship } from "../types/ship";

export function handleAddShips(data: AddShipsData) {
  const db = DB.getInstance();
  const games = db.games;

  const { gameId, ships, indexPlayer } = data;

  const game = games.find((g) => g.gameId == gameId);
  if (!game) {
    return;
  }

  const user = game.gameUsers.find((b) => b.userId == indexPlayer);
  if (!user) {
    return;
  }

  user.userShips = ships;

  const board = user.userBoard;

  ships.forEach((s: Ship) => {
    const { x, y } = s.position;
    const isVertical = s.direction;
    const length = s.length;

    user.aliveShips += length;

    for (let z = 0; z < length; z++) {
      if (isVertical) {
        board[y + z]![x] = true;
      } else {
        board[y]![x + z] = true;
      }
    }
  });

  user.isReady = true;
}
