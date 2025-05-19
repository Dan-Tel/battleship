import { AttackData } from "../types/data";
import { DB } from "../db/db";
import { handleTurn } from "./turn";
import { randomCell } from "../utils/randomCell";
import { handleFinish } from "./finish";

export function handleAttack(data: AttackData) {
  const db = DB.getInstance();
  const games = db.games;

  const { gameId, x, y, indexPlayer } = data;

  const game = games.find((g) => g.gameId == gameId);
  if (!game) {
    return;
  }

  const user = game.gameUsers.find((b) => b.userId == indexPlayer);
  const enemy = game.gameUsers.find((b) => b.userId != indexPlayer);

  if (!user || !enemy) {
    return;
  }

  if (game.currentPlayer != indexPlayer) {
    return;
  }

  const board = enemy.userBoard;
  const hasShotAt = user.hasShotAt;

  let status = board[y]![x] ? "shot" : "miss";

  if (hasShotAt[y]![x]) {
    return;
  }
  hasShotAt[y]![x] = true;

  game.currentPlayer = enemy.userId;

  if (status == "shot") {
    enemy.aliveShips--;
    if (user.userName != "BOT") {
      game.currentPlayer = user.userId;
    }

    if (isShipDestroyed(board, hasShotAt, x, y)) {
      status = "killed";

      const statusOfNearbyCells = getStatusOfNearbyCells(
        board,
        hasShotAt,
        x,
        y
      );

      statusOfNearbyCells.forEach((s) => {
        if (user.userName != "BOT") {
          user.userWs.send(
            JSON.stringify({
              type: "attack",
              data: JSON.stringify({
                ...s,
                currentPlayer: indexPlayer,
              }),
            })
          );
        }

        if (enemy.userName != "BOT") {
          enemy.userWs.send(
            JSON.stringify({
              type: "attack",
              data: JSON.stringify({
                ...s,
                currentPlayer: indexPlayer,
              }),
            })
          );
        }
      });
    }
  }

  if (user.userName != "BOT") {
    user.userWs.send(
      JSON.stringify({
        type: "attack",
        data: JSON.stringify({
          position: {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer,
          status: status,
        }),
        id: 0,
      })
    );
  }

  if (enemy.userName != "BOT") {
    enemy.userWs.send(
      JSON.stringify({
        type: "attack",
        data: JSON.stringify({
          position: {
            x: x,
            y: y,
          },
          currentPlayer: user.userId,
          status: status,
        }),
        id: 0,
      })
    );
  }

  if (enemy.aliveShips == 0) {
    handleFinish(game, indexPlayer);
  }

  if (enemy.userName == "BOT") {
    handleAttack({
      gameId: gameId,
      ...randomCell(enemy.hasShotAt),
      indexPlayer: enemy.userId,
    });
  } else {
    handleTurn(game, game.currentPlayer);
  }
}

function isShipDestroyed(
  board: boolean[][],
  hasShotAt: boolean[][],
  x: number,
  y: number
) {
  const stack = [[y, x]];
  const visited = new Array(10)
    .fill(false)
    .map(() => new Array(10).fill(false));

  while (stack.length) {
    const [i, j] = stack.pop() as [number, number];

    if (visited[i]![j]) {
      continue;
    }
    visited[i]![j] = true;

    if (!hasShotAt[i]![j]) {
      return false;
    }

    if (i - 1 >= 0 && board[i - 1]![j]) {
      stack.push([i - 1, j]);
    }
    if (i + 1 < 10 && board[i + 1]![j]) {
      stack.push([i + 1, j]);
    }
    if (j - 1 >= 0 && board[i]![j - 1]) {
      stack.push([i, j - 1]);
    }
    if (j + 1 < 10 && board[i]![j + 1]) {
      stack.push([i, j + 1]);
    }
  }

  return true;
}

function getStatusOfNearbyCells(
  board: boolean[][],
  hasShotAt: boolean[][],
  x: number,
  y: number
) {
  const status = [];

  const stack = [[y, x]];
  const visited = new Array(10)
    .fill(false)
    .map(() => new Array(10).fill(false));

  while (stack.length) {
    const [i, j] = stack.pop() as [number, number];

    if (visited[i]![j]) {
      continue;
    }
    visited[i]![j] = true;

    if (board[i]![j]) {
      status.push({ position: { x: j, y: i }, status: "killed" });
    } else {
      if (!hasShotAt[i]![j]) {
        hasShotAt[i]![j] = true;

        status.push({ position: { x: j, y: i }, status: "miss" });
      }

      continue;
    }

    const up = i - 1 >= 0;
    const down = i + 1 < 10;
    const left = j - 1 >= 0;
    const right = j + 1 < 10;

    if (up) {
      stack.push([i - 1, j]);
    }
    if (down) {
      stack.push([i + 1, j]);
    }
    if (left) {
      stack.push([i, j - 1]);
    }
    if (right) {
      stack.push([i, j + 1]);
    }

    if (up && left) {
      stack.push([i - 1, j - 1]);
    }
    if (up && right) {
      stack.push([i - 1, j + 1]);
    }
    if (down && left) {
      stack.push([i + 1, j - 1]);
    }
    if (down && right) {
      stack.push([i + 1, j + 1]);
    }
  }

  return status;
}
