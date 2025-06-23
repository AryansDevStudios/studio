import type { Timestamp } from 'firebase/firestore';

export type PlayerSymbol = 'X' | 'O';

export interface Game {
  board: (PlayerSymbol | null)[];
  players: {
    X: string | null;
    O: string | null;
  };
  playerCount: number;
  nextPlayer: PlayerSymbol;
  winner: PlayerSymbol | 'draw' | null;
  createdAt: Timestamp;
  roomId: string;
}
