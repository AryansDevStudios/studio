"use client";

import { CreateOrJoinRoom } from '@/components/create-or-join-room';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStats } from '@/hooks/use-game-stats';
import { Gamepad2, Users, BarChart, Zap } from 'lucide-react';
import * as React from 'react';

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
    const { stats } = useGameStats();

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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <StatCard title="Games Played" value={stats.played} icon={<Gamepad2 className="h-4 w-4 text-muted-foreground" />} />
                    <StatCard title="Wins" value={stats.wins} icon={<Trophy className="h-4 w-4 text-muted-foreground" />} />
                    <StatCard title="Losses" value={stats.losses} icon={<Frown className="h-4 w-4 text-muted-foreground" />} />
                    <StatCard title="Draws" value={stats.draws} icon={<Handshake className="h-4 w-4 text-muted-foreground" />} />
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

// Dummy icons for illustration since they might not be in lucide-react
const Trophy = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A3.48 3.48 0 0 1 9 19.5a3.5 3.5 0 0 1-2-3.44V14.7"/>
    <path d="M15 14.66V17c0 .55.47.98.97 1.21A3.48 3.48 0 0 0 16 19.5a3.5 3.5 0 0 0 2-3.44V14.7"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
    <path d="M12 2v10"/>
  </svg>
);
const Frown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const Handshake = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17a2 2 0 0 1-2 2H4.5a2.5 2.5 0 0 1 0-5H8" />
    <path d="M14 14a2 2 0 0 0-2-2h-1" />
    <path d="M13 11a2 2 0 0 0 2-2V4.5a2.5 2.5 0 0 0-5 0V8" />
    <path d="M3 14a2 2 0 0 0 2 2h1" />
  </svg>
);

const Palette = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.668 0-.92-.742-1.667-1.648-1.667-.926 0-1.648-.746-1.648-1.667 0-.92.742-1.666 1.648-1.666.926 0 1.648-.746 1.648-1.667 0-.92.742-1.666 1.648-1.666.926 0 1.648-.746 1.648-1.667 0-.92.742-1.666 1.648-1.666A10 10 0 0 0 12 2z"/>
  </svg>
);

const UserCheck = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const Code = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

    