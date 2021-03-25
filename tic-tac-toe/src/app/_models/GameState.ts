import { Tile } from "./Tile";

export interface GameState {
  _id: string;
  player: number,
  board: [Tile],
  createdAt: Date
}
