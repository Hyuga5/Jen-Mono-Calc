"use client";

import { useGame } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  LogOut,
  Wifi,
  WifiOff,
  ClipboardCopy,
} from "lucide-react";
import { PlayerList } from "./player-list";
import { BankActionsCard } from "./bank-actions-card";
import { TransactionLog } from "./transaction-log";
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
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { InvitePlayersCard } from "./invite-players-card";

function CreatorActions() {
    const { endGame } = useGame();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <LogOut className="mr-2 h-4 w-4" /> End Game
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>End Game Session for Everyone?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will delete all player and transaction data for this session. This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={endGame}>End Game</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function PlayerActions() {
    const { leaveGame } = useGame();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" /> Exit Game
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Exit Game Session?</AlertDialogTitle>
                <AlertDialogDescription>
                    You will be removed from the game, but the session will continue for others. You can rejoin later if you wish.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={leaveGame}>Exit Game</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function GameDashboard() {
  const { localPlayer, gameId, isCreator } = useGame();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const copyGameId = () => {
    if (!gameId) return;
    navigator.clipboard.writeText(gameId);
    toast({ title: "Copied!", description: "Game ID copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-secondary/50 dark:bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Landmark className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold font-headline">
                Jen MonoCalc
              </h1>
              {gameId && (
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-muted-foreground">Game ID:</p>
                  <Badge variant="secondary">{gameId}</Badge>
                  <Button variant="ghost" size="icon" onClick={copyGameId} className="h-7 w-7">
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "secondary" : "destructive"} className="hidden sm:flex items-center gap-2">
                {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {isOnline ? "Online" : "Offline"}
            </Badge>
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{localPlayer?.name}</p>
              <p className="text-sm text-muted-foreground">
                ${localPlayer ? formatCurrency(localPlayer.balance) : "0"}
              </p>
            </div>
             {isCreator ? <CreatorActions /> : <PlayerActions />}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BankActionsCard />
            <TransactionLog />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <InvitePlayersCard gameId={gameId} />
            <PlayerList />
          </div>
        </div>
      </main>
    </div>
  );
}
