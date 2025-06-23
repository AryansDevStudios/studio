"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GameStats } from '@/types';

const STATS_KEY = 'tictactoe-game-stats';

const getInitialStats = (): GameStats => ({
  played: 0,
  wins: 0,
  losses: 0,
  draws: 0,
});

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') {
      return getInitialStats();
    }
    try {
      const storedStats = window.localStorage.getItem(STATS_KEY);
      return storedStats ? JSON.parse(storedStats) : getInitialStats();
    } catch (error) {
      console.error("Error reading stats from localStorage", error);
      return getInitialStats();
    }
  });

  const updateStats = useCallback((result: 'win' | 'loss' | 'draw') => {
    setStats(prevStats => {
        const newStats = { ...prevStats, played: prevStats.played + 1 };
        if (result === 'win') newStats.wins++;
        else if (result === 'loss') newStats.losses++;
        else if (result === 'draw') newStats.draws++;

        try {
            window.localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
        } catch (error) {
            console.error("Error saving stats to localStorage", error);
        }
        return newStats;
    });
  }, []);
  
  // This effect will sync stats across tabs if they are on the same page
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STATS_KEY && event.newValue) {
        try {
          setStats(JSON.parse(event.newValue));
        } catch (error) {
            console.error("Error parsing stats from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { stats, updateStats };
}

    