"use client";

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkWinner } from '@/lib/game-logic';
import type { Game, PlayerSymbol } from '@/types';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';
import { usePlayerId } from './use-player-id';

export function useGameState(roomId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const playerId = usePlayerId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!roomId || !playerId) return;

    setLoading(true);
    const gameRef = doc(db, 'games', roomId);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as Game;
        
        const isPlayer = gameData.players.X?.id === playerId || gameData.players.O?.id === playerId;
        
        if (!isPlayer && gameData.playerCount >= 2) {
          setError("This game is full and you are not a player.");
          setGame(null);
        } else {
          setGame(gameData);
          setError(null);
        }
      } else {
        setError("Game not found. It might have been deleted or the code is incorrect.");
        setGame(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore snapshot error:", err);
      setError("Failed to connect to the game. Check your Firestore Rules.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, playerId]);

  const playerSymbol: PlayerSymbol | null = game && playerId === game.players.X?.id ? 'X' : (game && playerId === game.players.O?.id ? 'O' : null);

  const handleCellClick = useCallback(async (index: number) => {
    if (!game || !playerSymbol) return;

    if (game.board[index] || game.winner || game.nextPlayer !== playerSymbol) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = playerSymbol;
    const winner = checkWinner(newBoard);

    try {
        await updateDoc(doc(db, 'games', roomId), {
          board: newBoard,
          nextPlayer: game.nextPlayer === 'X' ? 'O' : 'X',
          winner: winner,
        });
    } catch (e) {
        console.error("Error making move:", e);
        toast({ title: "Error", description: "Could not make move. Check Firestore rules.", variant: "destructive"});
    }
  }, [game, playerSymbol, roomId, toast]);

  const handlePlayAgain = useCallback(async () => {
    if (!game) return;

    try {
        await updateDoc(doc(db, 'games', roomId), {
            board: Array(9).fill(null),
            nextPlayer: 'X',
            winner: null,
        });
    } catch(e) {
        console.error("Error resetting game:", e);
        toast({ title: "Error", description: "Could not restart game. Check Firestore rules.", variant: "destructive"});
    }
  }, [game, roomId, toast]);

  const handleLeaveRoom = useCallback(async () => {
    if (playerId) {
        const gameRef = doc(db, 'games', roomId);
        try {
            const docSnap = await getDoc(gameRef);
            if (docSnap.exists()) {
                const gameData = docSnap.data() as Game;
                if (!gameData.winner) {
                    const updates: any = {};
                    if (gameData.players.X?.id === playerId) {
                        updates['players.X'] = { id: null, name: null };
                        updates.playerCount = gameData.playerCount - 1;
                    } else if (gameData.players.O?.id === playerId) {
                        updates['players.O'] = { id: null, name: null };
                        updates.playerCount = gameData.playerCount - 1;
                    }
                    if (Object.keys(updates).length > 1) {
                        await updateDoc(gameRef, updates);
                    }
                }
            }
        } catch (error) {
            console.error("Error updating state on leave:", error);
        }
    }
    router.push('/');
  }, [playerId, roomId, router]);


  return { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain, handleLeaveRoom };
}
