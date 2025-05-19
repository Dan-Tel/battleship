import { Game } from "../types/game";
import { Room } from "../types/room";
import { User } from "../types/user";

export class DB {
  private static instance: DB;
  users: User[] = [
    { userName: "BOT", userId: 0, roomId: "", userWins: 0, userWs: null },
  ];
  rooms: Room[] = [];
  games: Game[] = [];

  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }

    return DB.instance;
  }

  filterRooms() {
    this.rooms = this.rooms.filter((r) => r.roomUsers.length === 1);
  }
}
