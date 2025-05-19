import { randomInt } from "./randomInt";

export function randomCell(hasShotAt: boolean[][]) {
  let i = randomInt(0, hasShotAt.length - 1);
  let j = randomInt(0, hasShotAt.length - 1);

  while (hasShotAt[i]![j]) {
    i = randomInt(0, hasShotAt.length - 1);
    j = randomInt(0, hasShotAt.length - 1);
  }

  return {
    x: j,
    y: i,
  };
}
