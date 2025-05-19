import { ResponseType } from "../enums/responseType";
import { DB } from "../db/db";
import { User } from "../types/user";
import { RegData } from "../types/data";
import { handleUpdateRoom } from "./updateRoom";

export function handleReg(
  dataObj: RegData,
  clientId: number | string,
  ws: any
) {
  const db = DB.getInstance();
  const users = db.users;

  const user: User = {
    userName: dataObj.name,
    userId: clientId,
    roomId: "",
    userWins: 0,
    userWs: ws,
  };

  users.push(user);

  const response = {
    type: ResponseType.reg,
    data: JSON.stringify({
      name: user.userName,
      index: user.userId,
      error: false,
      errorText: "",
    }),
    id: 0,
  };

  ws.send(JSON.stringify(response));

  handleUpdateRoom();
}
