import { ShipSize } from "../enums/shipSize";

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipSize;
}
