"use client";

import { useState, useEffect } from 'react';

const generatePlayerId = () => Math.random().toString(36).substring(2, 9);

export function usePlayerId() {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let storedPlayerId = sessionStorage.getItem('tictactoe-player-id');
    if (!storedPlayerId) {
      storedPlayerId = generatePlayerId();
      sessionStorage.setItem('tictactoe-player-id', storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  return playerId;
}
