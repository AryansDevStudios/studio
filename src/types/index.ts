import type { Timestamp } from 'firebase/firestore';

export type PlayerSymbol = 'X' | 'O';

export interface Player {
  id: string | null;
  name: string | null;
}

export interface Game {
  board: (PlayerSymbol | null)[];
  players: {
    X: Player;
    O: Player;
  };
  playerCount: number;
  nextPlayer: PlayerSymbol;
  winner: PlayerSymbol | 'draw' | null;
  winReason?: 'score' | 'abandonment';
  createdAt: Timestamp;
  roomId: string;
}

export interface GameStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  lastReset: string | null;
}