import { Room } from "ws_server/types/room";
import { DB } from "../db/db";
import { ShipSize } from "../enums/shipSize";
import { handleAddShips } from "./addShips";

export function handleCreateGame(room: Room) {
  const db = DB.getInstance();
  const users = db.users;
  const games = db.games;

  const gameId = room.roomId;
  const roomUsersIds = room.roomUsers.map((u) => u.index);

  const gameUsers = users.filter((u) => roomUsersIds.includes(u.userId));

  if (gameUsers[0]!.userName === "BOT") {
    gameUsers.push(gameUsers.shift()!);
  }

  games.push({
    gameId,
    gameUsers: gameUsers.map((u) => ({
      userName: u.userName,
      userId: u.userId,
      userBoard: new Array(10).fill(false).map(() => new Array(10).fill(false)),
      hasShotAt: new Array(10).fill(false).map(() => new Array(10).fill(false)),
      userShips: [],
      aliveShips: 0,
      isReady: false,
      userWs: u.userWs,
    })),
    currentPlayer: gameUsers[0]!.userId,
  });

  gameUsers.forEach((u) => {
    if (u.userName != "BOT") {
      u.userWs.send(
        JSON.stringify({
          type: "create_game",
          data: JSON.stringify({
            idGame: gameId,
            idPlayer: u.userId,
          }),
          id: 0,
        })
      );
    } else {
      handleAddShips({
        gameId: gameId,
        ships: botShipPlacement(),
        indexPlayer: u.userId,
      });
    }
  });
}

function botShipPlacement() {
  return [
    {
      position: { x: 2, y: 0 },
      direction: true,
      type: ShipSize.huge,
      length: 4,
    },
    {
      position: { x: 8, y: 1 },
      direction: true,
      type: ShipSize.large,
      length: 3,
    },
    {
      position: { x: 3, y: 9 },
      direction: false,
      type: ShipSize.large,
      length: 3,
    },
    {
      position: { x: 1, y: 6 },
      direction: false,
      type: ShipSize.medium,
      length: 2,
    },
    {
      position: { x: 4, y: 6 },
      direction: false,
      type: ShipSize.medium,
      length: 2,
    },
    {
      position: { x: 4, y: 0 },
      direction: false,
      type: ShipSize.medium,
      length: 2,
    },
    {
      position: { x: 1, y: 8 },
      direction: true,
      type: ShipSize.small,
      length: 1,
    },
    {
      position: { x: 5, y: 3 },
      direction: true,
      type: ShipSize.small,
      length: 1,
    },
    {
      position: { x: 8, y: 8 },
      direction: false,
      type: ShipSize.small,
      length: 1,
    },
    {
      position: { x: 0, y: 2 },
      direction: false,
      type: ShipSize.small,
      length: 1,
    },
  ];
}
