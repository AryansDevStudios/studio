"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Swords, DoorOpen, PartyPopper } from 'lucide-react';

import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePlayerId } from '@/hooks/use-player-id';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FormSchema = z.object({
  roomId: z.string().length(4, "Room code must be 4 digits.").regex(/^\d{4}$/, "Room code must be 4 digits.").optional(),
});

export function CreateOrJoinRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const playerId = usePlayerId();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomId: "",
    },
  });

  const handleCreateRoom = async () => {
    if (!playerId) {
      toast({ title: "Player ID not ready", description: "Please wait a moment and try again.", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const generateRoomId = () => Math.floor(1000 + Math.random() * 9000).toString();
      
      let newRoomId;
      let roomExists = true;
      let attempt = 0;
      while (roomExists) {
        if (attempt > 20) { // Safety break
            throw new Error("Could not find an available room ID.");
        }
        newRoomId = generateRoomId();
        const roomDoc = await getDoc(doc(db, 'games', newRoomId));
        roomExists = roomDoc.exists();
        attempt++;
      }

      await setDoc(doc(db, 'games', newRoomId), {
        roomId: newRoomId,
        board: Array(9).fill(null),
        players: { X: playerId, O: null },
        playerCount: 1,
        nextPlayer: 'X',
        winner: null,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Room Created!", description: `Your room code is ${newRoomId}. Redirecting...` });
      router.push(`/${newRoomId}`);
    } catch (error) {
        console.error("Error creating room:", error);
        toast({ title: "Error Creating Room", description: "Please check your Firestore security rules and internet connection.", variant: "destructive" });
        setIsCreating(false);
    }
  };

  const onJoinSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!playerId) {
      toast({ title: "Player ID not ready", description: "Please wait a moment and try again.", variant: "destructive" });
      return;
    }
    const { roomId } = data;
    if (!roomId) {
        form.setError("roomId", { type: "manual", message: "Please enter a room code." });
        return;
    }

    setIsJoining(true);
    
    try {
      const roomRef = doc(db, 'games', roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        const gameData = roomDoc.data();
        
        if (gameData.players.X === playerId || gameData.players.O === playerId) {
            router.push(`/${roomId}`);
            return;
        }

        if (gameData.playerCount < 2) {
          await setDoc(roomRef, { 
              players: { ...gameData.players, O: playerId },
              playerCount: 2,
           }, { merge: true });
          
          router.push(`/${roomId}`);
        } else {
          toast({ title: "Room Full", description: "This room is already full.", variant: "destructive" });
          setIsJoining(false);
        }
      } else {
        toast({ title: "Room Not Found", description: "No room found with this code.", variant: "destructive" });
        setIsJoining(false);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast({ title: "Error Joining Room", description: "An unexpected error occurred.", variant: "destructive" });
      setIsJoining(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-2">
      <CardContent className="p-0">
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-b-none">
            <TabsTrigger value="join" className="text-base h-full"><DoorOpen className="mr-2"/>Join Room</TabsTrigger>
            <TabsTrigger value="create" className="text-base h-full"><Swords className="mr-2"/>Create Room</TabsTrigger>
          </TabsList>
          <TabsContent value="join" className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onJoinSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Room Code</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="1234" {...field} 
                            className="text-center text-2xl h-14 tracking-[1em]"
                            maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-lg" disabled={isJoining || isCreating || !playerId}>
                  {isJoining ? <Loader2 className="animate-spin" /> : <PartyPopper />}
                  Let's Go!
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="create" className="p-6 text-center space-y-6">
            <p className="text-muted-foreground text-lg">Ready to start a new battle? Click below to generate a fresh game room.</p>
            <Button onClick={handleCreateRoom} variant="default" className="w-full h-12 text-lg" disabled={isCreating || isJoining || !playerId}>
                {isCreating ? <Loader2 className="animate-spin" /> : <Swords />}
                Create a New Room
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
