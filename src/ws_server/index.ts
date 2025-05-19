import { WebSocketServer } from "ws";
import { isJSON } from "./utils/isJSON";
import { RequestType } from "./enums/requestType";
import { handleReg } from "./controllers/reg";
import { handleCreateRoom } from "./controllers/createRoom";
import { handleAddUserToRoom } from "./controllers/addUserToRoom";
import { handleAddShips } from "./controllers/addShips";
import { handleAttack } from "./controllers/attack";
import { handleRandomAttack } from "./controllers/randomAttack";
import { handleSinglePlay } from "./controllers/singlePlay";

export function startWSServer() {
  const wss = new WebSocketServer({ port: 3000 });

  wss.on("connection", function connection(ws) {
    const clientId = Date.now().toString();

    ws.on("error", console.error);

    ws.on("message", function message(msg) {
      const { type, data } = JSON.parse(`${msg}`);
      const dataObj = isJSON(data) ? JSON.parse(data) : data;

      console.log(type, "from", clientId);

      switch (type) {
        case RequestType.reg:
          handleReg(dataObj, clientId, ws);
          break;
        case RequestType.createRoom:
          handleCreateRoom(clientId);
          break;
        case RequestType.addUserToRoom:
          handleAddUserToRoom(dataObj, clientId);
          break;
        case RequestType.addShips:
          handleAddShips(dataObj);
          break;
        case RequestType.attack:
          handleAttack(dataObj);
          break;
        case RequestType.randomAttack:
          handleRandomAttack(dataObj);
          break;
        case RequestType.singlePlay:
          handleSinglePlay(clientId);
          break;
      }
    });
  });
}
