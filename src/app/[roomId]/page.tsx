import { GameRoom } from '@/components/game-room';

export default function GamePage({ params }: { params: { roomId: string } }) {
  if (!/^\d{4}$/.test(params.roomId)) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid Room Code</h1>
                <p className="text-muted-foreground">Room codes must be 4 digits.</p>
            </div>
        </main>
    )
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <GameRoom roomId={params.roomId} />
    </main>
  );
}
