"use client";

import { CreateOrJoinRoom } from '@/components/create-or-join-room';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
      <div className="text-center mb-10 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tighter">
          Tic-Tac-Toe Arena
        </h1>
        <p className="text-muted-foreground mt-3 text-lg sm:text-xl max-w-xl mx-auto">
          The classic game of X's and O's, reimagined for the modern web. Challenge your friends to a match!
        </p>
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <CreateOrJoinRoom />
      </div>
    </main>
  );
}
