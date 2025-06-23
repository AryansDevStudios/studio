"use client";

import Link from 'next/link';
import { Home, Loader2, AlertTriangle, Copy } from 'lucide-react';

import { useGameState } from '@/hooks/use-game-state';
import { TicTacToeBoard } from '@/components/tic-tac-toe-board';
import { GameResultDialog } from '@/components/game-result-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function GameRoom({ roomId }: { roomId: string }) {
  const { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain } = useGameState(roomId);
  const { toast } = useToast();
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
        title: "Copied!",
        description: "Room code copied to clipboard.",
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold">Joining Room...</p>
        <p className="text-muted-foreground">Please wait while we connect you to the game.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold text-destructive">{error}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Go back to Home</Link>
        </Button>
      </div>
    );
  }
  
  if (!game) {
    return null;
  }

  const getStatusMessage = () => {
    if (game.winner) {
        if (game.winner === 'draw') return "It's a draw!";
        return `Player ${game.winner} wins!`;
    }
    if (game.playerCount < 2) return "Waiting for opponent to join...";
    if (game.nextPlayer === playerSymbol) return "Your turn!";
    return `Waiting for Player ${game.nextPlayer}'s turn...`;
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm animate-fade-in">
        <GameResultDialog game={game} onPlayAgain={handlePlayAgain} playerSymbol={playerSymbol} />
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2">
              <CardTitle>Room Code: {roomId}</CardTitle>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyRoomId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{playerSymbol ? `You are Player ${playerSymbol}` : 'You are a spectator.'}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-xl font-medium text-primary">{getStatusMessage()}</p>
            </div>
            <TicTacToeBoard
                board={game.board}
                onCellClick={handleCellClick}
                disabled={!playerSymbol || game.nextPlayer !== playerSymbol || !!game.winner}
            />
            <Button asChild variant="outline">
                <Link href="/"><Home className="mr-2 h-4 w-4" />Leave Room</Link>
            </Button>
        </CardContent>
    </Card>
  );
}
