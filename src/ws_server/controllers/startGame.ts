import { Game } from "../types/game";
import { handleTurn } from "./turn";

export function handleStartGame(game: Game) {
  game.gameUsers.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: "start_game",
          data: JSON.stringify({
            ships: u.userShips,
            currentPlayerIndex: u.userId,
          }),
          id: 0,
        })
      );
    }
  });

  handleTurn(game, game.currentPlayer);
}
