import { DB } from "../db/db";
import { RandomAttackData } from "../types/data";
import { randomCell } from "../utils/randomCell";
import { handleAttack } from "./attack";

export function handleRandomAttack(data: RandomAttackData) {
  const db = DB.getInstance();
  const games = db.games;

  const { gameId, indexPlayer } = data;

  const game = games.find((g) => g.gameId === gameId);
  if (!game) {
    return;
  }

  const user = game.gameUsers.find((u) => u.userId === indexPlayer);
  if (!user) {
    return;
  }

  handleAttack({
    gameId,
    ...randomCell(user.hasShotAt),
    indexPlayer,
  });
}
