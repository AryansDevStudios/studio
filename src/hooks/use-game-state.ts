"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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
  const opponentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Player heartbeat to indicate they are online
  useEffect(() => {
    if (!playerSymbol || !game || game.winner) return;

    const gameRef = doc(db, 'games', roomId);
    const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            updateDoc(gameRef, {
                [`players.${playerSymbol}.lastSeen`]: serverTimestamp()
            }).catch(err => console.error("Heartbeat failed", err));
        }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [game, playerSymbol, roomId]);

  // Check for opponent timeout
  useEffect(() => {
    // Always clear any existing timeout when the effect re-runs or unmounts.
    const clearTimer = () => {
      if (opponentTimeoutRef.current) {
        clearTimeout(opponentTimeoutRef.current);
      }
    };

    if (!game || game.playerCount < 2 || game.winner || !playerSymbol) {
      clearTimer();
      return;
    }

    const TIMEOUT_MS = 20000;
    const gameRef = doc(db, 'games', roomId);
    const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
    const opponent = game.players[opponentSymbol];

    if (!opponent.id || !opponent.lastSeen) {
      clearTimer();
      return;
    }

    const timeSinceLastSeen = new Date().getTime() - opponent.lastSeen.toDate().getTime();
    const timeUntilTimeout = TIMEOUT_MS - timeSinceLastSeen;

    clearTimer(); // Clear previous timer before setting a new one.

    if (timeUntilTimeout > 0) {
      // Opponent is still active, set a timeout to check again after the remaining time.
      opponentTimeoutRef.current = setTimeout(() => {
        getDoc(gameRef).then(docSnap => {
            if (docSnap.exists()) {
                const currentData = docSnap.data() as Game;
                if(currentData.winner) return;

                const opponentData = currentData.players[opponentSymbol];
                if (opponentData.lastSeen && (new Date().getTime() - opponentData.lastSeen.toDate().getTime() > TIMEOUT_MS)) {
                    updateDoc(gameRef, {
                        winner: playerSymbol,
                        winReason: 'timeout'
                    });
                }
            }
        });
      }, timeUntilTimeout + 1000); // Check 1s after timeout is expected
    } else {
      // Opponent has already timed out. Make sure we don't overwrite an existing win.
      if (!game.winner) {
        updateDoc(gameRef, { winner: playerSymbol, winReason: 'timeout' });
      }
    }

    return clearTimer;
  }, [game, playerSymbol, roomId]);

  const handleCellClick = useCallback(async (index: number) => {
    if (!game || !playerSymbol) return;

    if (game.board[index] || game.winner || game.nextPlayer !== playerSymbol) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = playerSymbol;
    const winner = checkWinner(newBoard);
    
    const updates: any = {
      board: newBoard,
      nextPlayer: game.nextPlayer === 'X' ? 'O' : 'X',
      winner: winner,
      [`players.${playerSymbol}.lastSeen`]: serverTimestamp(),
    };

    if (winner && winner !== 'draw') {
        updates.winReason = 'score';
    }

    try {
        await updateDoc(doc(db, 'games', roomId), updates);
    } catch (e) {
        console.error("Error making move:", e);
        toast({ title: "Error", description: "Could not make move. Check Firestore rules.", variant: "destructive"});
    }
  }, [game, playerSymbol, roomId, toast]);

  const handlePlayAgain = useCallback(async () => {
    if (!game) return;

    // To prevent a race condition on Play Again, only Player X can trigger a reset.
    if (playerSymbol !== 'X') {
        toast({ title: "Please Wait", description: "Waiting for Player X to start the next game."});
        return;
    }

    try {
        await updateDoc(doc(db, 'games',roomId), {
            board: Array(9).fill(null),
            nextPlayer: 'X',
            winner: null,
            winReason: null,
            'players.X.lastSeen': serverTimestamp(),
            'players.O.lastSeen': serverTimestamp(),
        });
    } catch(e) {
        console.error("Error resetting game:", e);
        toast({ title: "Error", description: "Could not restart game. Check Firestore rules.", variant: "destructive"});
    }
  }, [game, roomId, toast, playerSymbol]);

  const handleLeaveRoom = useCallback(async () => {
    if (!game || !playerSymbol) {
        router.push('/');
        return;
    }

    // If game is already over, just navigate away.
    if (game.winner) {
        router.push('/');
        return;
    }

    const gameRef = doc(db, 'games', roomId);
    try {
        const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
        // Only declare a winner by abandonment if an opponent actually exists.
        if (game.players[opponentSymbol]?.id) {
            await updateDoc(gameRef, {
                winner: opponentSymbol,
                winReason: 'abandonment'
            });
        }
    } catch (error) {
        console.error("Error updating state on leave:", error);
    }
    router.push('/');
  }, [game, playerSymbol, roomId, router]);


  return { game, playerSymbol, loading, error, handleCellClick, handlePlayAgain, handleLeaveRoom };
}
