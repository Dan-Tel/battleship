import { DB } from "../db/db";
import { ResponseType } from "../enums/responseType";

export function handleUpdateRoom() {
  const db = DB.getInstance();
  db.filterRooms();

  const users = db.users;
  const rooms = db.rooms;

  users.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: ResponseType.updateRoom,
          data: JSON.stringify(rooms),
          id: 0,
        })
      );
    }
  });
}
