import { DB } from "../db/db";
import { Game } from "../types/game";
import { handleUpdateWinners } from "./updateWinners";

export function handleFinish(game: Game, winPlayer: number | string) {
  const db = DB.getInstance();
  const users = db.users;

  const user = users.find((u) => u.userId === winPlayer);
  if (!user) {
    return;
  }

  user.userWins++;

  game.gameUsers.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: "finish",
          data: JSON.stringify({
            winPlayer,
          }),
          id: 0,
        })
      );
    }
  });

  handleUpdateWinners();
}
