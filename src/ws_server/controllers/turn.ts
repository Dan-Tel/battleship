import { ResponseType } from "../enums/responseType";
import { Game } from "../types/game";

export function handleTurn(game: Game, currentPlayer: number | string) {
  game.gameUsers.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: ResponseType.turn,
          data: JSON.stringify({ currentPlayer }),
          id: 0,
        })
      );
    }
  });
}
