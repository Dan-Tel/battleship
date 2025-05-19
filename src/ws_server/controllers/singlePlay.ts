import { DB } from "../db/db";
import { handleAddUserToRoom } from "./addUserToRoom";
import { handleCreateRoom } from "./createRoom";

export function handleSinglePlay(clientId: number | string) {
  const db = DB.getInstance();
  const users = db.users;

  handleCreateRoom(clientId);
  const user = users.find((u) => u.userId == clientId);
  if (!user) {
    return;
  }

  handleAddUserToRoom({ indexRoom: user.roomId }, 0);
}
