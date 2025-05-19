import { Ship } from "./ship";

export interface RegData {
  name: string;
  password: string;
}

export interface AddUserToRoomData {
  indexRoom: number | string;
}

export interface AddShipsData {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}

export interface AttackData {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

export interface RandomAttackData {
  gameId: number | string;
  indexPlayer: number | string;
}
