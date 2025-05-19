import { DB } from "../db/db";
import { handleUpdateRoom } from "./updateRoom";

export function handleCreateRoom(clientId: number | string) {
  const db = DB.getInstance();
  const users = db.users;
  const rooms = db.rooms;

  const user = users.find((u) => u.userId == clientId);
  if (!user) {
    return;
  }

  const oldRoom = rooms.find((r) => r.roomId == user.roomId);
  if (oldRoom) {
    oldRoom.roomUsers = oldRoom.roomUsers.filter((u) => u.index != clientId);
  }

  user.roomId = Date.now().toString();

  rooms.push({
    roomId: user.roomId,
    roomUsers: [{ name: user.userName, index: clientId }],
  });

  handleUpdateRoom();
}
