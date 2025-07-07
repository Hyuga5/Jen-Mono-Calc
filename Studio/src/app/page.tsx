"use client";

import { GameDashboard } from "@/components/game-dashboard";
import { Lobby } from "@/components/lobby";
import { GameProvider, useGame } from "@/contexts/game-context";
import { Landmark, Loader2 } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { FirebaseSetup } from "@/components/firebase-setup";

function AppContent() {
  const { gameId, isLoading, localPlayer } = useGame();

  if (!isFirebaseConfigured()) {
    return <FirebaseSetup />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
        <Landmark className="h-16 w-16 mb-4 text-primary" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h1 className="text-2xl font-bold mt-4 font-headline">Jenish MonoCalc</h1>
        <p className="text-muted-foreground">Loading your game session...</p>
      </div>
    );
  }

  return gameId && localPlayer ? <GameDashboard /> : <Lobby />;
}

export default function Home() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
