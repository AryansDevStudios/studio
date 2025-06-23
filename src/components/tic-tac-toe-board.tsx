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
    if (symbol === 'X') return <X className="h-20 w-20 md:h-28 md:w-28 text-destructive stroke-[2.5]" />;
    if (symbol === 'O') return <Circle className="h-20 w-20 md:h-28 md:w-28 text-accent stroke-[2.5]" />;
    return null;
};

export function TicTacToeBoard({ board, onCellClick, disabled }: TicTacToeBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {board.map((symbol, index) => (
        <div key={index} className="relative group">
            <Button
              onClick={() => onCellClick(index)}
              disabled={disabled || symbol !== null}
              variant="secondary"
              className={cn(
                "w-28 h-28 md:w-36 md:h-36 flex items-center justify-center rounded-lg shadow-inner transition-all duration-200 ease-in-out",
                "bg-muted/50 hover:bg-muted/80 border-2 border-transparent",
                {
                  'cursor-not-allowed': disabled,
                  'hover:scale-105 hover:border-primary cursor-pointer': !disabled && symbol === null,
                }
              )}
              aria-label={`Cell ${index + 1}, ${symbol ? `Player ${symbol}` : 'Empty'}`}
            >
              <div className="transition-transform duration-300 ease-out group-hover:scale-110">
                <PlayerIcon symbol={symbol} />
              </div>
            </Button>
        </div>
      ))}
    </div>
  );
}
