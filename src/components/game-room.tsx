"use client";

import * as React from 'react';
import Link from 'next/link';
import { Home, Loader2, AlertTriangle, Copy, Users, Sword, Shield } from 'lucide-react';

import { useGameState } from '@/hooks/use-game-state';
import { TicTacToeBoard } from '@/components/tic-tac-toe-board';
import { GameResultDialog } from '@/components/game-result-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function GameRoom({ roomId }: { roomId: string }) {
  const { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain, handleLeaveRoom } = useGameState(roomId);
  const { toast } = useToast();
  const [hasBeenFull, setHasBeenFull] = React.useState(false);

  React.useEffect(() => {
    if (game?.playerCount === 2) {
      setHasBeenFull(true);
    }
  }, [game?.playerCount]);
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
        title: "Copied to Clipboard!",
        description: `Room code ${roomId} is ready to share.`,
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <h2 className="text-2xl font-semibold">Joining Room...</h2>
        <p className="text-muted-foreground mt-2">Connecting you to the Arena.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen">
        <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-semibold text-destructive">{error}</h2>
        <Button asChild variant="link" className="mt-4 text-lg">
          <Link href="/">Return to Home Base</Link>
        </Button>
      </div>
    );
  }
  
  if (!game) {
    return null; // Or a more specific "Game not found" state
  }

  const getStatusMessage = () => {
    if (game.winner) {
        if (game.winner === 'draw') return "It's a draw! Stalemate.";
        if (game.winner === playerSymbol) return "Victory is yours!";
        return "You have been defeated.";
    }
    if (hasBeenFull && game.playerCount < 2) {
        return "Your opponent has fled the battle.";
    }
    if (game.playerCount < 2) return "Waiting for a challenger...";
    if (game.nextPlayer === playerSymbol) return "Your turn to strike!";
    return `Awaiting opponent's move...`;
  };

  const isMyTurn = game.nextPlayer === playerSymbol && !game.winner;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in min-h-screen flex flex-col justify-center">
        <GameResultDialog game={game} onPlayAgain={handlePlayAgain} playerSymbol={playerSymbol} />
        
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Room Code: <span className="text-primary font-mono">{roomId}</span></h1>
                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={copyRoomId}>
                    <Copy className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex items-center gap-2 text-lg mt-2 sm:mt-0">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{game.playerCount} / 2</span>
            </div>
        </header>
        
        <Card className="w-full shadow-2xl bg-card/80 backdrop-blur-sm border-2">
            <CardContent className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 md:p-12">
                
                <div className="flex flex-col items-center gap-6">
                    <div className="text-center">
                        <Badge variant={isMyTurn ? "default" : "secondary"} className="text-lg px-4 py-2 mb-4 transition-all duration-300 scale-105">
                            {getStatusMessage()}
                        </Badge>
                        {playerSymbol && (
                             <p className="text-muted-foreground flex items-center justify-center gap-2">
                                You are Player {playerSymbol}
                                {playerSymbol === 'X' ? <Sword className="h-5 w-5 text-destructive" /> : <Shield className="h-5 w-5 text-accent" />}
                            </p>
                        )}
                    </div>

                    <TicTacToeBoard
                        board={game.board}
                        onCellClick={handleCellClick}
                        disabled={!playerSymbol || game.nextPlayer !== playerSymbol || !!game.winner}
                    />
                    
                    <Button variant="outline" onClick={handleLeaveRoom} className="w-full max-w-xs mt-4">
                        <Home className="mr-2 h-4 w-4" />
                        Leave Arena
                    </Button>
                </div>

            </CardContent>
        </Card>
    </div>
  );
}
