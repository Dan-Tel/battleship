import { AddUserToRoomData } from "ws_server/types/data";
import { DB } from "../db/db";
import { handleUpdateRoom } from "./updateRoom";

export function handleAddUserToRoom(
  data: AddUserToRoomData,
  clientId: number | string
) {
  const db = DB.getInstance();
  const users = db.users;
  const rooms = db.rooms;

  const { indexRoom } = data;

  const room = rooms.find((r) => r.roomId == indexRoom);

  if (!room) {
    throw new Error("Room was not found");
  }

  const user = users.find((u) => u.userId == clientId);
  if (!user) {
    return;
  }

  const oldRoom = rooms.find((r) => r.roomId == user.roomId);
  if (oldRoom) {
    oldRoom.roomUsers = oldRoom.roomUsers.filter((u) => u.index != clientId);
  }

  room.roomUsers.push({ name: user.userName, index: clientId });
  user.roomId = indexRoom;

  handleUpdateRoom();
}
