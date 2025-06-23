"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Loader2, Swords, DoorOpen } from 'lucide-react';

import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePlayerId } from '@/hooks/use-player-id';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerNameDialog } from './player-name-dialog';

const FormSchema = z.object({
  roomId: z.string().length(4, "Room code must be 4 digits.").regex(/^\d{4}$/, "Room code must be 4 digits."),
});

type ActionDetails = {
    type: 'create' | 'join';
    roomId?: string;
}

export function CreateOrJoinRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [actionDetails, setActionDetails] = React.useState<ActionDetails | null>(null);
  const playerId = usePlayerId();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomId: "",
    },
  });
  
  const handleCreateRoom = () => {
    if (!playerId) {
      toast({ title: "Player ID not ready", description: "Please wait a moment and try again.", variant: "destructive" });
      return;
    }
    setActionDetails({ type: 'create' });
  };
  
  const onJoinSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!playerId) {
      toast({ title: "Player ID not ready", description: "Please wait a moment and try again.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      const roomRef = doc(db, 'games', data.roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        toast({ title: "Room Not Found", description: "No room found with this code.", variant: "destructive" });
        return;
      }
      const gameData = roomDoc.data();
      if (gameData.playerCount >= 2 && gameData.players.X.id !== playerId && gameData.players.O.id !== playerId) {
          toast({ title: "Room Full", description: "This room is already full.", variant: "destructive" });
          return;
      }
      
      setActionDetails({ type: 'join', roomId: data.roomId });

    } catch (error) {
      console.error("Error checking room:", error);
      toast({ title: "Error", description: "Could not check room status.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };

  const executeAction = async (name: string) => {
    if (!actionDetails || !playerId) return;
    
    setIsProcessing(true);
    if (actionDetails.type === 'create') {
        await executeCreateRoom(name);
    } else if (actionDetails.type === 'join' && actionDetails.roomId) {
        await executeJoinRoom(name, actionDetails.roomId);
    }
    setIsProcessing(false);
    setActionDetails(null);
  }

  const executeCreateRoom = async (name: string) => {
     try {
      const generateRoomId = () => Math.floor(1000 + Math.random() * 9000).toString();
      
      let newRoomId;
      let roomExists = true;
      let attempt = 0;
      while (roomExists) {
        if (attempt > 20) throw new Error("Could not find an available room ID.");
        newRoomId = generateRoomId();
        const roomDoc = await getDoc(doc(db, 'games', newRoomId));
        roomExists = roomDoc.exists();
        attempt++;
      }

      await setDoc(doc(db, 'games', newRoomId), {
        roomId: newRoomId,
        board: Array(9).fill(null),
        players: { 
          X: { id: playerId, name: name }, 
          O: { id: null, name: null } 
        },
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
    }
  }

  const executeJoinRoom = async (name: string, roomId: string) => {
     try {
      const roomRef = doc(db, 'games', roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        const gameData = roomDoc.data();
        
        if (gameData.players.X?.id === playerId || gameData.players.O?.id === playerId) {
            router.push(`/${roomId}`);
            return;
        }

        if (gameData.playerCount < 2) {
          await updateDoc(roomRef, { 
              'players.O': { id: playerId, name: name },
              playerCount: 2,
           });
          
          router.push(`/${roomId}`);
        } else {
          toast({ title: "Room Full", description: "This room is already full.", variant: "destructive" });
        }
      } else {
        toast({ title: "Room Not Found", description: "No room found with this code.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast({ title: "Error Joining Room", description: "An unexpected error occurred.", variant: "destructive" });
    }
  }

  return (
    <>
    <PlayerNameDialog 
        isOpen={!!actionDetails}
        onOpenChange={(open) => !open && setActionDetails(null)}
        onConfirm={executeAction}
        isProcessing={isProcessing}
    />
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-2">
      <CardContent className="p-0">
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-t-none">
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
                              autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-lg" disabled={isProcessing || !playerId}>
                    {isProcessing && actionDetails?.type === 'join' ? <Loader2 className="animate-spin" /> : "Join Game"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="create" className="p-6 text-center space-y-6">
              <p className="text-muted-foreground text-lg">Ready to start a new battle? Click below to generate a fresh game room.</p>
              <Button onClick={handleCreateRoom} variant="default" className="w-full h-12 text-lg" disabled={isProcessing || !playerId}>
                  {isProcessing && actionDetails?.type === 'create' ? <Loader2 className="animate-spin" /> : <Swords />}
                  Create a New Room
              </Button>
            </TabsContent>
          </Tabs>
      </CardContent>
    </Card>
    </>
  );
}

    