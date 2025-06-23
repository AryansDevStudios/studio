"use client";

import * as React from 'react';
import Link from 'next/link';
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

interface GameResultDialogProps {
  game: Game | null;
  onPlayAgain: () => void;
  playerSymbol: PlayerSymbol | null;
}

export function GameResultDialog({ game, onPlayAgain, playerSymbol }: GameResultDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (game?.winner) {
      // Delay opening the dialog slightly to allow the final move to render
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [game?.winner]);

  if (!game) return null;

  const getResultTitle = () => {
    if (game.winner === 'draw') return "It's a Draw!";
    if (game.winner === playerSymbol) return "🎉 You Won! 🎉";
    return "😢 You Lost 😢";
  };
  
  const getResultDescription = () => {
    if (game.winner === 'draw') return "A hard-fought battle with no winner. Well played by both sides!";
    if (game.winner === playerSymbol) return "Congratulations! Your strategic genius has paid off. Care for another round?";
    return "A valiant effort, but your opponent was victorious this time. Ready for a comeback?";
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">{getResultTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {getResultDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel asChild>
            <Link href="/">Exit to Home</Link>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onPlayAgain}>
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
