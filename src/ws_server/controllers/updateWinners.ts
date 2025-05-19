import { ResponseType } from "../enums/responseType";
import { DB } from "../db/db";

export function handleUpdateWinners() {
  const db = DB.getInstance();
  const users = db.users;

  const winners = users
    .filter((u) => u.userWins > 0)
    .map((u) => ({
      name: u.userName,
      wins: u.userWins,
    }));

  users.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: ResponseType.updateWinners,
          data: JSON.stringify(winners),
          id: 0,
        })
      );
    }
  });
}
