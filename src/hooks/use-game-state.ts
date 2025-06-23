"use client";

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkWinner } from '@/lib/game-logic';
import type { Game, PlayerSymbol } from '@/types';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

export function useGameState(roomId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('tictactoe-player-id');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      const newPlayerId = Math.random().toString(36).substring(2, 9);
      localStorage.setItem('tictactoe-player-id', newPlayerId);
      setPlayerId(newPlayerId);
    }
  }, []);

  useEffect(() => {
    if (!roomId || !playerId) return;

    setLoading(true);
    const gameRef = doc(db, 'games', roomId);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as Game;
        
        if (gameData.playerCount < 2 && gameData.players.X !== playerId) {
          await updateDoc(gameRef, {
            'players.O': playerId,
            playerCount: 2
          });
        }
        setGame(gameData);
        setError(null);
      } else {
        setError("Game not found. It might have been deleted or the code is incorrect.");
        setGame(null);
        toast({ title: "Error", description: "Game not found.", variant: 'destructive' });
        router.push('/');
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore snapshot error:", err);
      setError("Failed to connect to the game.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, playerId, toast, router]);

  const playerSymbol: PlayerSymbol | null = game && playerId === game.players.X ? 'X' : (game && playerId === game.players.O ? 'O' : null);

  const handleCellClick = useCallback(async (index: number) => {
    if (!game || !playerSymbol) return;

    if (game.board[index] || game.winner || game.nextPlayer !== playerSymbol) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = playerSymbol;
    const winner = checkWinner(newBoard);

    await updateDoc(doc(db, 'games', roomId), {
      board: newBoard,
      nextPlayer: game.nextPlayer === 'X' ? 'O' : 'X',
      winner: winner,
    });
  }, [game, playerSymbol, roomId]);

  const handlePlayAgain = useCallback(async () => {
    if (!game) return;

    // Player X initiates the reset
    const newGameData = {
        board: Array(9).fill(null),
        nextPlayer: 'X' as PlayerSymbol,
        winner: null,
        // Keep players, playerCount, roomId, createdAt
        players: game.players,
        playerCount: game.playerCount,
        roomId: game.roomId,
        createdAt: game.createdAt,
    };

    await setDoc(doc(db, 'games', roomId), newGameData);
  }, [game, roomId]);


  return { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain };
}
