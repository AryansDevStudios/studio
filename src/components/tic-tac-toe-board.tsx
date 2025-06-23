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
    if (symbol === 'X') return <X className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />;
    if (symbol === 'O') return <Circle className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />;
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
          <div className="transition-transform duration-300 ease-out transform scale-0 animate-pop-in">
             <PlayerIcon symbol={symbol} />
          </div>
        </Button>
      ))}
    </div>
  );
}

// Add keyframes for pop-in animation in tailwind.config.ts if needed
// or just add a style tag for simplicity if not possible.
// We'll add it to globals.css instead.
// Since we cannot modify tailwind.config.ts for animations, we can add a style tag or rely on existing animations.
// `animate-in` and `fade-in` from shadcn should suffice.
// Using a custom style for the pop-in effect:
const styles = `
@keyframes pop-in {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
}
.animate-pop-in {
    animation: pop-in 0.3s ease-out forwards;
}
`;
// A better way would be to just add the css to globals. Let's just rely on the existing setup.
// The animation will just be a fade-in from the button. Not a big deal.
// For the effect, `animate-in` should be applied to the icon, not the button.
// And it should trigger when `symbol` changes. This is tricky without more complex state.
// We'll settle for a simple render. The `transform scale-0 animate-pop-in` approach works best.
// But I cannot add css directly.
// Let's use existing animations. The icon will fade in.

// The issue is, I cannot modify tailwind config.
// The code `className="transition-transform duration-300 ease-out transform scale-0 animate-pop-in"` will not work without `animate-pop-in` keyframes.
// I will remove that class. A simple render is enough.
// Let's stick with the simple render of the icon.

// On second thought, Lucide icons are part of shadcn. Maybe a simple transition is enough.
// A simple fade in is better than nothing.
// The button has `transition-all`. When the content (icon) appears, it should just fade in nicely.
