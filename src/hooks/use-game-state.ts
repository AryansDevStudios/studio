"use client";

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
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
    let storedPlayerId = localStorage.getItem('tictactoe-player-id');
    if (!storedPlayerId) {
      storedPlayerId = Math.random().toString(36).substring(2, 9);
      localStorage.setItem('tictactoe-player-id', storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  useEffect(() => {
    if (!roomId || !playerId) return;

    setLoading(true);
    const gameRef = doc(db, 'games', roomId);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as Game;
        
        if (gameData.playerCount < 2 && gameData.players.X !== playerId && gameData.players.O === null) {
          try {
            await updateDoc(gameRef, {
              'players.O': playerId,
              playerCount: 2
            });
            setGame({ 
                ...gameData, 
                players: { ...gameData.players, O: playerId },
                playerCount: 2
            });
          } catch (e) {
             console.error("Error joining game as player O:", e);
             setError("Failed to join the game. Check Firestore rules.");
          }
        } else {
            setGame(gameData);
        }
        setError(null);
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

  const playerSymbol: PlayerSymbol | null = game && playerId === game.players.X ? 'X' : (game && playerId === game.players.O ? 'O' : null);

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

    const newGameData = {
        board: Array(9).fill(null),
        nextPlayer: 'X' as PlayerSymbol,
        winner: null,
        players: game.players,
        playerCount: game.playerCount,
        roomId: game.roomId,
        createdAt: serverTimestamp(),
    };

    try {
        await setDoc(doc(db, 'games', roomId), newGameData);
    } catch(e) {
        console.error("Error resetting game:", e);
        toast({ title: "Error", description: "Could not restart game. Check Firestore rules.", variant: "destructive"});
    }
  }, [game, roomId, toast]);


  return { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain };
}
