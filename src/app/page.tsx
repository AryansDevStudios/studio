"use client";

import { CreateOrJoinRoom } from '@/components/create-or-join-room';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="text-center mb-8 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary font-headline tracking-tight">
          TicTacToe Meet
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg max-w-md mx-auto">
          Create a room or join an existing one to play a timeless classic with a friend.
        </p>
      </div>
      <CreateOrJoinRoom />
    </main>
  );
}
