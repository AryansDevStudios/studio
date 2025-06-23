"use client";

import * as React from 'react';
import Link from 'next/link';
import { Trophy, Frown, Handshake, LogOut, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Game, PlayerSymbol } from '@/types';
import { Button } from './ui/button';

interface GameResultDialogProps {
  game: Game | null;
  onPlayAgain: () => void;
  playerSymbol: PlayerSymbol | null;
}

export function GameResultDialog({ game, onPlayAgain, playerSymbol }: GameResultDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isWaiting, setIsWaiting] = React.useState(false);

  React.useEffect(() => {
    if (game?.winner) {
      setIsWaiting(false); // Reset waiting state if a winner is declared
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [game?.winner]);

  if (!game) return null;

  const isWinner = game.winner === playerSymbol;
  const isDraw = game.winner === 'draw';
  const isAbandonment = game.winReason === 'abandonment';

  const handlePlayAgainClick = () => {
    onPlayAgain();
    // Player 'O' has to wait for Player 'X' to restart the game.
    if (playerSymbol === 'O') {
      setIsWaiting(true);
    }
  }

  const getResultIcon = () => {
    if (isDraw) return <Handshake className="h-16 w-16 text-muted-foreground" />;
    if (isWinner && isAbandonment) return <LogOut className="h-16 w-16 text-yellow-400" />;
    if (isWinner) return <Trophy className="h-16 w-16 text-yellow-400" />;
    return <Frown className="h-16 w-16 text-destructive" />;
  };

  const getResultTitle = () => {
    if (isDraw) return "A Stalemate!";
    if (isWinner && isAbandonment) return "Victory by Forfeit";
    if (isWinner) return "Victory!";
    return "Defeat";
  };
  
  const getResultDescription = () => {
    if (isDraw) return "A hard-fought battle with no winner. Well played by both sides!";
    if (isWinner && game.winReason === 'abandonment') return "Your opponent left the match. A win is a win!";
    if (isWinner) return "Congratulations! Your strategic genius has paid off. Care for a rematch?";
    if (game.winReason === 'abandonment') return "You left the match, resulting in a loss. Ready for a comeback?";
    return "A valiant effort, but your opponent was victorious this time. Ready for a comeback?";
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
            <div className="mb-4">
                {getResultIcon()}
            </div>
          <AlertDialogTitle className="text-3xl font-bold text-center">{getResultTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg mt-2">
            {isWaiting ? "Waiting for the other player to start the next round..." : getResultDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center pt-4 gap-3">
          <AlertDialogCancel asChild>
            <Link href="/" className="w-full">Exit to Home</Link>
          </AlertDialogCancel>
          <Button onClick={handlePlayAgainClick} className="w-full" disabled={isWaiting}>
             {isWaiting ? <Loader2 className="animate-spin" /> : "Play Again"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
