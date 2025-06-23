"use client";

import { CreateOrJoinRoom } from '@/components/create-or-join-room';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStats } from '@/hooks/use-game-stats';
import { Gamepad2, Zap, Palette, UserCheck, Code, RotateCw, Trophy, Frown, Handshake } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <Card className="bg-background/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function Home() {
    const { stats, resetStats } = useGameStats();

    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
            
            <div className="w-full max-w-5xl mx-auto py-12">
                <div className="text-center mb-10 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tighter">
                        Tic-Tac-Toe Arena
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg sm:text-xl max-w-2xl mx-auto">
                        The classic game of X's and O's, reimagined for the modern web. Challenge your friends to a match!
                    </p>
                </div>
                
                <div className="mb-10 animate-fade-in-up flex justify-center" style={{ animationDelay: '0.4s' }}>
                    <CreateOrJoinRoom />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                        <StatCard title="Games Played" value={stats.played} icon={<Gamepad2 className="h-4 w-4 text-muted-foreground" />} />
                        <StatCard title="Wins" value={stats.wins} icon={<Trophy className="h-4 w-4 text-muted-foreground" />} />
                        <StatCard title="Losses" value={stats.losses} icon={<Frown className="h-4 w-4 text-muted-foreground" />} />
                        <StatCard title="Draws" value={stats.draws} icon={<Handshake className="h-4 w-4 text-muted-foreground" />} />
                    </div>
                    <div className="flex justify-end items-center gap-4 text-sm text-muted-foreground mb-12">
                         {stats.lastReset && (
                           <p>Last reset: {new Date(stats.lastReset).toLocaleDateString()}</p>
                         )}
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-xs">
                                    <RotateCw className="mr-2 h-3 w-3" />
                                    Reset Stats
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently reset your game statistics. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={resetStats}>Reset</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <h2 className="text-3xl font-bold text-center mb-8">Why You'll Love It</h2>
                    <div className="grid gap-6 md:grid-cols-2 text-left">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Zap className="text-primary"/>Real-time Multiplayer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Challenge friends or foes from anywhere in the world with instant room creation and seamless online play.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Palette className="text-primary"/>Sleek & Responsive Design</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Enjoy a clean, modern interface that looks great and plays smoothly on any device, from desktop to mobile.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><UserCheck className="text-primary"/>Personalized Experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Play with your own name, track your personal game statistics, and feel the thrill of victory.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/>Built with Modern Tech</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Powered by Next.js and Firebase for a fast, reliable, and scalable gaming experience.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
