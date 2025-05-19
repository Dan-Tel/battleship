import { WebSocketServer } from "ws";
import { isJSON } from "./utils/isJSON";
import { RequestType } from "./enums/requestType";
import { handleReg } from "./controllers/reg";
import { handleCreateRoom } from "./controllers/createRoom";

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
      }
    });
  });
}
