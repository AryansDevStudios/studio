"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Swords, DoorOpen } from 'lucide-react';

import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const FormSchema = z.object({
  roomId: z.string().length(4, "Room code must be 4 digits.").regex(/^\d{4}$/, "Room code must be 4 digits."),
});

export function CreateOrJoinRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomId: "",
    },
  });

  const handleCreateRoom = async () => {
    setIsCreating(true);
    const generateRoomId = () => Math.floor(1000 + Math.random() * 9000).toString();
    
    let newRoomId;
    let roomExists = true;
    while (roomExists) {
        newRoomId = generateRoomId();
        const roomDoc = await getDoc(doc(db, 'games', newRoomId));
        roomExists = roomDoc.exists();
    }
    
    const playerId = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('tictactoe-player-id', playerId);

    await setDoc(doc(db, 'games', newRoomId), {
      roomId: newRoomId,
      board: Array(9).fill(null),
      players: { X: playerId, O: null },
      playerCount: 1,
      nextPlayer: 'X',
      winner: null,
      createdAt: serverTimestamp(),
    });

    toast({ title: "Room Created!", description: `Your room code is ${newRoomId}.` });
    router.push(`/${newRoomId}`);
  };

  const onJoinSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsJoining(true);
    const { roomId } = data;
    const roomRef = doc(db, 'games', roomId);
    const roomDoc = await getDoc(roomRef);

    if (roomDoc.exists()) {
      const gameData = roomDoc.data();
      if (gameData.playerCount < 2) {
        const playerId = localStorage.getItem('tictactoe-player-id') || Math.random().toString(36).substring(2, 9);
        if (!localStorage.getItem('tictactoe-player-id')) {
            localStorage.setItem('tictactoe-player-id', playerId);
        }
        
        // Check if player is already in the game
        if (gameData.players.X !== playerId) {
            await setDoc(roomRef, { 
                players: { ...gameData.players, O: playerId },
                playerCount: 2,
             }, { merge: true });
        }
        
        router.push(`/${roomId}`);
      } else {
        toast({ title: "Room Full", description: "This room is already full.", variant: "destructive" });
        setIsJoining(false);
      }
    } else {
      toast({ title: "Room Not Found", description: "No room found with this code.", variant: "destructive" });
      setIsJoining(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-2xl bg-card/80 backdrop-blur-sm animate-fade-in-up">
      <CardHeader>
        <CardTitle>Join a Game</CardTitle>
        <CardDescription>Enter a 4-digit room code to join.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onJoinSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="1234" {...field} className="text-center text-lg h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isJoining || isCreating}>
              {isJoining ? <Loader2 className="animate-spin" /> : <DoorOpen />}
              Join Room
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button onClick={handleCreateRoom} variant="secondary" className="w-full" disabled={isCreating || isJoining}>
            {isCreating ? <Loader2 className="animate-spin" /> : <Swords />}
            Create a New Room
        </Button>
      </CardContent>
    </Card>
  );
}
