interface RoomUser {
  name: string;
  index: number | string;
}

export interface Room {
  roomId: number | string;
  roomUsers: RoomUser[];
}
