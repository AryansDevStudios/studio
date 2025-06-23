"use client";

import { X, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlayerSymbol } from '@/types';

interface TicTacToeBoardProps {
  board: (PlayerSymbol | null)[];
  onCellClick: (index: number) => void;
  disabled: boolean;
}

const PlayerIcon = ({ symbol }: { symbol: PlayerSymbol | null }) => {
    if (symbol === 'X') return <X className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />;
    if (symbol === 'O') return <Circle className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />;
    return null;
};

export function TicTacToeBoard({ board, onCellClick, disabled }: TicTacToeBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {board.map((symbol, index) => (
        <Button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || symbol !== null}
          variant="secondary"
          className={cn(
            "w-24 h-24 sm:w-28 sm:w-28 md:w-32 md:h-32 flex items-center justify-center rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105",
            "bg-background/50 hover:bg-background/80",
            {
              'cursor-not-allowed opacity-70': disabled,
              'cursor-pointer': !disabled && symbol === null,
            }
          )}
          aria-label={`Cell ${index + 1}, ${symbol ? `Player ${symbol}` : 'Empty'}`}
        >
          <PlayerIcon symbol={symbol} />
        </Button>
      ))}
    </div>
  );
}
